from pydantic import BaseModel, EmailStr,ConfigDict
from datetime import date
from typing import Optional,List
from enum import Enum

class Subordinate(BaseModel):
    id: int
    first_name: Optional[str]
    last_name: Optional[str]
    email: str
    role: str
    reporting_to: Optional[int]

    model_config = ConfigDict(from_attributes=True)

class EmploymentStatus(str, Enum):
    active = "Active"
    inactive = "Inactive"
    on_leave = "On Leave"
    

class UserBase(BaseModel):
    email: EmailStr
    role: str  # admin, hr, employee

class UserCreate(UserBase):
    password: str
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    department: Optional[str]
    designation: Optional[str]
    joining_date: Optional[date]
    reporting_to: Optional[int] = None
    status: Optional[EmploymentStatus] = EmploymentStatus.active


class UserOut(BaseModel):
    id: int
    emp_id: str
    email: EmailStr
    role: str
    is_active: bool
    first_name: Optional[str]
    last_name: Optional[str]
    department: Optional[str]
    designation: Optional[str]
    joining_date: Optional[date]
    phone: Optional[str]
    reporting_to: Optional[int]
    subordinates: List[Subordinate] = []
    status: EmploymentStatus


    model_config = ConfigDict(from_attributes=True)




class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int

class UserUpdate(BaseModel):
    email: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    role: Optional[str]
    department: Optional[str]
    designation: Optional[str]
    joining_date: Optional[date]
    reporting_to: Optional[int] = None


# role
class RoleAccessBase(BaseModel):
    role: str
    category: str
    feature: str
    is_allowed: bool

class RoleAccessCreate(RoleAccessBase):
    pass

class RoleAccessUpdate(RoleAccessBase):
    id: int


class RoleAccessUpdates(BaseModel):
    category: str
    feature: str
    is_allowed: bool

class RoleAccessOut(RoleAccessUpdates):
    role: str



class ConfigUpdate(BaseModel):
    org_name: str
    topbar_color: str
    logo_url: str | None = None

class ConfigOut(ConfigUpdate):
    id: int