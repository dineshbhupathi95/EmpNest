from fastapi import FastAPI
from database.db import Base, engine
from api import user_apis,timesheet_apis,role_api,leave_api
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


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
app.mount("/api/static", StaticFiles(directory="static"), name="static")

# Include router
app.include_router(user_apis.router, tags=["Users"])
app.include_router(timesheet_apis.router, tags=["Timesheet"])
app.include_router(role_api.router, tags=["Role"])
app.include_router(leave_api.router, tags=["Leave"])
