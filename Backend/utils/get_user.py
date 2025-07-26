from fastapi import Depends, HTTPException, status,Header
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def get_current_user_id(
    token: str = Depends(oauth2_scheme),
    x_user_id: int | None = Header(default=None),
):
    # Try OAuth2 first
    if token:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: int = payload.get("sub")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid authentication credentials")
            return int(user_id)
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token or expired token")

    # Fallback to header user id
    if x_user_id is not None:
        # You might want to validate user exists in DB here
        return x_user_id

    raise HTTPException(status_code=401, detail="Authentication credentials not provided")
