from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Enum as PgEnum
from sqlalchemy.orm import relationship
from database.db import Base
import enum

class EmploymentStatus(str, enum.Enum):
    active = "Active"
    inactive = "Inactive"
    on_leave = "On Leave"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(String, unique=True, index=True, nullable=True)
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
    status = Column(PgEnum(EmploymentStatus), default=EmploymentStatus.active)


    reporting_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    manager = relationship("User", remote_side=[id], backref="subordinates", uselist=False)
    timesheets = relationship("Timesheet", back_populates="user", cascade="all, delete-orphan")



class RoleAccess(Base):
    __tablename__ = "role_access"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, index=True)
    category = Column(String, nullable=False)
    feature = Column(String, nullable=False)
    is_allowed = Column(Boolean, default=True)



class AppConfig(Base):
    __tablename__ = "app_config"

    id = Column(Integer, primary_key=True, index=True)
    org_name = Column(String, default="EmpNest")
    topbar_color = Column(String, default="#19047a")
    logo_url = Column(String, nullable=True)