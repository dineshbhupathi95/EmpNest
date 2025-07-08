from pydantic import BaseModel
from typing import List, Dict, Literal,Optional
from datetime import date
from schemas.user_schema import UserOut
from pydantic import ConfigDict

class TimesheetEntry(BaseModel):
    type: Literal['project', 'sick', 'pto']
    code: str
    hours_per_day: Dict[str, float]  # Example: { "Monday": 4, "Tuesday": 3 }

class TimesheetCreate(BaseModel):
    user_id: int
    week_starting: date
    entries: List[TimesheetEntry]
    status: Optional[str]

class TimesheetOut(BaseModel):
    id: int
    user_id: int
    user_details: UserOut
    week_starting: date
    entries: Optional[List[TimesheetEntry]]
    status: Optional[str]
    description: Optional[str]

    model_config = ConfigDict(from_attributes=True)

