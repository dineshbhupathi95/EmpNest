from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import user as user_model
from database.db import SessionLocal
from schemas import user_schema
from typing import List


router = APIRouter(prefix="/api/access")
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/")
def create_access(data: user_schema.RoleAccessCreate, db: Session = Depends(get_db)):
    existing = db.query(user_model.RoleAccess).filter_by(
        role=data.role, category=data.category, feature=data.feature
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Access already exists")
    
    access = user_model.RoleAccess(**data.dict())
    db.add(access)
    db.commit()
    db.refresh(access)
    return access

@router.put("/")
def update_access(data: user_schema.RoleAccessUpdate, db: Session = Depends(get_db)):
    access = db.query(user_model.RoleAccess).filter_by(id=data.id).first()
    if not access:
        raise HTTPException(status_code=404, detail="Access not found")
    
    for field, value in data.dict().items():
        setattr(access, field, value)
    db.commit()
    db.refresh(access)
    return access

@router.get("/{role}")
def get_access_by_role(role: str, db: Session = Depends(get_db)):
    access = db.query(user_model.RoleAccess).filter_by(role=role).all()
    return access


@router.put("/{role}", response_model=List[user_schema.RoleAccessOut])
def update_role_access(role: str, data: List[user_schema.RoleAccessUpdates], db: Session = Depends(get_db)):
    updated = []
    for item in data:
        access = db.query(user_model.RoleAccess).filter_by(role=role, category=item.category, feature=item.feature).first()
        if access:
            access.is_allowed = item.is_allowed
        else:
            access = user_model.RoleAccess(role=role, category=item.category, feature=item.feature, is_allowed=item.is_allowed)
            db.add(access)
        updated.append(access)
    
    db.commit()
    return updated