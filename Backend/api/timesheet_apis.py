# routers/timesheet.py
from fastapi import APIRouter, Depends, HTTPException,Request
from sqlalchemy.orm import Session
from models.timesheet import Timesheet
from models.user import User
from schemas.timesheet_schema import TimesheetCreate, TimesheetOut
from schemas.user_schema import UserOut
from database.db import SessionLocal
from typing import List
from datetime import datetime, date


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/api/timesheet/", response_model=TimesheetOut)
def submit_timesheet(data: TimesheetCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    timesheet = Timesheet(
        user_id=data.user_id,
        week_starting=data.week_starting,
        entries=[entry.dict() for entry in data.entries]
    )
    db.add(timesheet)
    db.commit()
    db.refresh(timesheet)

    # Optional: Notify manager
    if user.reporting_to:
        manager = db.query(User).filter(User.id == user.reporting_to).first()
        if manager:
            print(f"Notify manager {manager.email}: {user.first_name} submitted a timesheet.")

    return timesheet

@router.get("/api/timesheet/reportees/{manager_id}", response_model=List[TimesheetOut])
def get_reportees_timesheets(manager_id: int, db: Session = Depends(get_db)):
    reportees = db.query(User).filter(User.reporting_to == manager_id).all()
    reportee_ids = [u.id for u in reportees]

    timesheets = db.query(Timesheet).filter(Timesheet.user_id.in_(reportee_ids)).all()

    return [
        TimesheetOut(
            id=ts.id,
            user_id=ts.user_id,
            user_details=UserOut.from_orm(ts.user),
            week_starting=ts.week_starting,
            entries=ts.entries,
            status=ts.status,
            description=ts.description,
        )
        for ts in timesheets
    ]

@router.get("/api/timesheet/all", response_model=List[TimesheetOut])
def get_all_timesheets(db: Session = Depends(get_db)):
    return db.query(Timesheet).all()

@router.patch("/api/timesheet/{timesheet_id}")
def update_timesheet_partial(timesheet_id: int, payload: dict, db: Session = Depends(get_db)):
    timesheet = db.query(Timesheet).filter(Timesheet.id == timesheet_id).first()
    if not timesheet:
        raise HTTPException(status_code=404, detail="Timesheet not found")

    for field, value in payload.items():
        if field == "week_starting" and isinstance(value, str):
            try:
                value = datetime.strptime(value, "%Y-%m-%d").date()
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
        setattr(timesheet, field, value)

    db.commit()
    db.refresh(timesheet)
    return timesheet

@router.get("/api/timesheet/user/{user_id}", response_model=List[TimesheetOut])
def get_user_timesheets(user_id: int, db: Session = Depends(get_db)):
    timesheets = db.query(Timesheet).filter(Timesheet.user_id == user_id).order_by(Timesheet.week_starting.desc()).all()
    return [
        TimesheetOut(
            id=ts.id,
            user_id=ts.user_id,
            user_details=ts.user,
            week_starting=ts.week_starting,
            entries=ts.entries,
            status=ts.status,
            description=ts.description,
        )
        for ts in timesheets
    ]
