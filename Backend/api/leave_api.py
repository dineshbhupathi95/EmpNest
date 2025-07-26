from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session
from database.db import SessionLocal
from models import user as user_model
from schemas import user_schema
from datetime import date
from utils import get_user
from typing import List


router = APIRouter(prefix="/api/leaves", tags=["Leave"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[user_schema.LeaveRequestOut])
def get_leave_requests(
    user_id: int = Query(..., description="User ID to filter leave requests"),
    db: Session = Depends(get_db)
):
    leaves = db.query(user_model.LeaveRequest).filter(user_model.LeaveRequest.user_id == user_id).all()
    return leaves

@router.post("/", response_model=user_schema.LeaveRequestOut)
def apply_leave(
    leave: user_schema.LeaveRequestCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate total leave days requested
    leave_days = (leave.end_date - leave.start_date).days + 1

    # Decide leave type and deduct from available leaves
    if user.number_of_leaves >= leave_days:
        leave_type = "paid"
        user.number_of_leaves -= leave_days
    else:
        leave_type = "unpaid"

    new_leave = user_model.LeaveRequest(
        user_id=user_id,
        start_date=leave.start_date,
        end_date=leave.end_date,
        reason=leave.reason,
        leave_type=leave_type,
        manager_id=user.reporting_to,
    )

    db.add(new_leave)
    db.add(user)  # Persist updated leave balance
    db.commit()
    db.refresh(new_leave)
    return new_leave

@router.get("/manager/{manager_id}", response_model=list[user_schema.LeaveRequestOut])
def get_pending_requests(manager_id: int, db: Session = Depends(get_db)):
    return db.query(user_model.LeaveRequest).filter(
        user_model.LeaveRequest.manager_id == manager_id,
        user_model.LeaveRequest.status == "Pending"
    ).all()

@router.put("/{leave_id}/approve")
def approve_leave(leave_id: int, db: Session = Depends(get_db)):
    leave = db.query(user_model.LeaveRequest).filter_by(id=leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    leave.status = "Approved"
    db.commit()
    return {"message": "Leave approved"}

@router.put("/{leave_id}/reject")
def reject_leave(leave_id: int, db: Session = Depends(get_db)):
    leave = db.query(user_model.LeaveRequest).filter_by(id=leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    leave.status = "Rejected"
    db.commit()
    return {"message": "Leave rejected"}

@router.delete("/{leave_id}")
def cancel_leave(
    leave_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    leave = db.query(user_model.LeaveRequest).filter(
        user_model.LeaveRequest.id == leave_id,
        user_model.LeaveRequest.user_id == user_id,
        user_model.LeaveRequest.status != "Approved"
    ).first()

    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found or cannot be canceled")

    db.delete(leave)
    db.commit()
    return {"detail": "Leave request canceled successfully"}
