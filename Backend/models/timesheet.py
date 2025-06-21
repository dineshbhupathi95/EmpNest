from sqlalchemy import Column, Integer, String, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database.db import Base

class Timesheet(Base):
    __tablename__ = "timesheets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    week_starting = Column(Date, nullable=False)
    entries = Column(JSON, nullable=False)
    status = Column(String, nullable=True, default="Submitted")
    description = Column(String, nullable=True)
    
    user = relationship("User", back_populates="timesheets")

    @property
    def user_details(self):
        return self.user
