from fastapi import APIRouter, Depends, HTTPException,Request
from sqlalchemy.orm import Session,joinedload
from models import user as user_model
from schemas import user_schema
from database.db import SessionLocal
from passlib.context import CryptContext
from utils.jwt_handler import create_access_token
from utils.permission import verify_permission
from sqlalchemy import or_

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/api/users/", response_model=user_schema.UserOut)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    new_user = user_model.User(
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        department=user.department,
        designation=user.designation,
        joining_date=user.joining_date,
        reporting_to=user.reporting_to

    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/api/login", response_model=user_schema.TokenResponse)
def login(credentials: user_schema.UserLogin, db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(user_model.User.email == credentials.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not pwd_context.verify(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token_data = {
        "sub": user.email,
        "id": user.id,
        "role": user.role
    }
    access_token = create_access_token(token_data)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id
    }

@router.get("/api/users/", response_model=list[user_schema.UserOut])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(user_model.User).options(joinedload(user_model.User.subordinates)).all()
    return users

@router.get("/api/users/{user_id}", response_model=user_schema.UserOut)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/api/users/{user_id}", response_model=user_schema.UserOut)
def update_user(user_id: int, user_update: user_schema.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


def build_org_chart(user: user_model.User, db: Session):
    subordinates = (
        db.query(user_model.User).filter(user_model.User.reporting_to == user.id).all()
    )
    return {
        "id": user.id,
        "name": f"{user.first_name} {user.last_name}",
        "email": user.email,
        "role": user.role,
        "designation":user.designation,
        "reporting_to": user.reporting_to,
        "photo_url": "https://fastly.picsum.photos/id/343/200/200.jpg?hmac=51jfTxjhIC4eQHibl9fcu56Q5VlXZxJLdHsbgsGd_zE",
        "subordinates": [build_org_chart(sub, db) for sub in subordinates]
    }

@router.get("/api/org-chart")
def get_org_chart(db: Session = Depends(get_db)):
    top_level_users = db.query(user_model.User).filter(
        or_(user_model.User.reporting_to == None, user_model.User.reporting_to == 0)
    ).all()
    print("t",top_level_users)
    return [build_org_chart(user, db) for user in top_level_users]

@router.get("/api/admin-or-hr-only")
@verify_permission(["admin", "hr"])
async def protected_admin_route(request: Request):
    user = request.state.user  # Access user info if needed
    return {"message": f"Welcome {user['role']} user!", "user": user}