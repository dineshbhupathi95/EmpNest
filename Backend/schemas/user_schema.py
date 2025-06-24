from pydantic import BaseModel, EmailStr,ConfigDict
from datetime import date
from typing import Optional,List

class Subordinate(BaseModel):
    id: int
    first_name: Optional[str]
    last_name: Optional[str]
    email: str
    role: str
    reporting_to: Optional[int]

    model_config = ConfigDict(from_attributes=True)


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


class UserOut(BaseModel):
    id: int
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
