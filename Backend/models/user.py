from sqlalchemy import Column, Integer, String, Boolean, Date,ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin, hr, employee
    is_active = Column(Boolean, default=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    joining_date = Column(Date, nullable=True)


    reporting_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    manager = relationship("User", remote_side=[id], backref="subordinates", uselist=False)
    timesheets = relationship("Timesheet", back_populates="user", cascade="all, delete-orphan")

