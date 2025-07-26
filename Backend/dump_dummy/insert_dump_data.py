import sys
import os
import random
from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.hash import bcrypt  # make sure no conflict with python-bcrypt

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import models
from models.user import Base, User, EmploymentStatus, RoleAccess  # Import RoleAccess here

# SQLite DB URL
DATABASE_URL = "sqlite:///../test2.db"  # Adjust path if needed

# Create engine and session
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()

# Faker instance
fake = Faker()

# Create tables (if not created)
Base.metadata.create_all(bind=engine)

# Dummy RoleAccess data by category & feature per your example
dummy_access = {
    "Sidenav": {
        "Manage Users": False,
        "Reportees": False,
        "Time sheet Entry": True,
        "Leave Requests": True,
        "Job Board": True,
        "My Profile": True,
        "Org Chart": True,
        "Configuration": True
    }
}

# Roles we want dummy data for
roles = ["admin", "hr", "employee"]

# Insert 10 dummy users
for i in range(10):
    hashed_password = bcrypt.hash("password1")

    user = User(
        emp_id=f"EMP{1000 + i}",
        email=fake.unique.email(),
        hashed_password=hashed_password,
        role=random.choice(roles),
        is_active=True,
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        phone=fake.phone_number(),
        department=random.choice(["IT", "HR", "Finance"]),
        designation=random.choice(["Developer", "Manager", "Analyst"]),
        joining_date=fake.date_between(start_date='-3y', end_date='-30d'),
        status=EmploymentStatus.active,
        number_of_leaves=random.randint(5, 15),
    )
    session.add(user)

# Insert RoleAccess data for each role, category, feature, and is_allowed
for role in roles:
    for category, features in dummy_access.items():
        for feature, allowed in features.items():
            access = RoleAccess(
                role=role,
                category=category,
                feature=feature,
                is_allowed=allowed
            )
            session.add(access)

# Commit all changes
session.commit()

print("✅ Inserted 10 dummy users and role access records.")
