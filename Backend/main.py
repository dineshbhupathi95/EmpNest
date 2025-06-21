from fastapi import FastAPI
from database.db import Base, engine
from api import user_apis,timesheet_apis
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)
# Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",             
    allow_credentials=True,
    allow_methods=["*"],           
    allow_headers=["*"], 
)
# Include router
app.include_router(user_apis.router, tags=["Users"])
app.include_router(timesheet_apis.router, tags=["Timesheet"])
