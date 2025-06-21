from fastapi import Request, HTTPException
from jose import jwt, JWTError
from functools import wraps
from typing import List
import inspect

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def verify_permission(allowed_roles: List[str]):
    def decorator(endpoint):
        @wraps(endpoint)
        async def wrapper(*args, **kwargs):
            # Automatically extract Request object
            request: Request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if not request:
                raise HTTPException(status_code=500, detail="Request object not found")

            # Extract token from headers
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                raise HTTPException(status_code=401, detail="Authorization header missing or malformed")

            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_role = payload.get("role")
                if user_role not in allowed_roles:
                    raise HTTPException(status_code=403, detail="Access denied")
                # Optional: inject user info if you want
                request.state.user = payload
            except JWTError:
                raise HTTPException(status_code=401, detail="Invalid or expired token")

            return await endpoint(*args, **kwargs)
        return wrapper
    return decorator
