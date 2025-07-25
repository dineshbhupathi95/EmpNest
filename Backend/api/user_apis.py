from fastapi import APIRouter, Depends, HTTPException,Request,UploadFile, File, Form
from sqlalchemy.orm import Session,joinedload
from models import user as user_model
from schemas import user_schema
from database.db import SessionLocal
from passlib.context import CryptContext
from utils.jwt_handler import create_access_token
from utils.permission import verify_permission
from sqlalchemy import or_
from typing import List
import shutil
import os

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_next_emp_id(db: Session) -> str:
    last_user = db.query(user_model.User).order_by(user_model.User.id.desc()).first()
    if last_user and last_user.emp_id and last_user.emp_id.startswith("E"):
        last_num = int(last_user.emp_id[1:])
        return f"E{last_num + 1}"
    return "E100"

@router.post("/api/users/", response_model=user_schema.UserOut)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_emp_id = generate_next_emp_id(db)
    hashed_password = pwd_context.hash(user.password)
    new_user = user_model.User(
        emp_id=new_emp_id,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        department=user.department,
        designation=user.designation,
        joining_date=user.joining_date,
        reporting_to=user.reporting_to,
        status=user.status or "Active"
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



@router.get("/api/reportees/{manager_id}", response_model=List[user_schema.UserOut])
def get_reportees(manager_id: int, db: Session = Depends(get_db)):
    reportees = db.query(user_model.User).filter(user_model.User.reporting_to == manager_id).all()
    return [user_schema.UserOut.from_orm(user) for user in reportees]



@router.get("/api/users/{user_id}", response_model=user_schema.UserOut)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Configuration APIs

@router.get("/api/config", response_model=user_schema.ConfigOut)
def get_config(db: Session = Depends(get_db)):
    config = db.query(user_model.AppConfig).first()
    if not config:
        config = user_model.AppConfig()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

@router.post("/api/config")
def update_config(
    org_name: str = Form(...),
    topbar_color: str = Form(...),
    logo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    config = db.query(user_model.AppConfig).first()
    if not config:
        config = user_model.AppConfig()
        db.add(config)
        db.commit()
        db.refresh(config)

    config.org_name = org_name
    config.topbar_color = topbar_color

    if logo:
        logo_path = f"static/logos/{logo.filename}"
        with open(logo_path, "wb") as f:
            shutil.copyfileobj(logo.file, f)
        config.logo_url = f"/{logo_path}"

    db.commit()
    return {"message": "Configuration updated successfully"}
