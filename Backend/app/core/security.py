from datetime import datetime, timedelta
from typing import Optional

import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Header
from starlette.status import HTTP_401_UNAUTHORIZED

from app.core.config import settings
from app.db import supabase

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = settings.JWT_ALGORITHM


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)
    return token


def create_email_verification_token(user_id: str, email: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.EMAIL_VERIFY_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "email": email,
        "purpose": "email_verify",
        "exp": expire,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=ALGORITHM)


def decode_email_verification_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid or expired verification token")

    if payload.get("purpose") != "email_verify":
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid verification token purpose")

    if not payload.get("sub") or not payload.get("email"):
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid verification token payload")

    return payload


async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Missing auth header")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid auth header")

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user_id = payload.get("user_id") or payload.get("userId") or payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    result = supabase.table("users").select("id,email,name,role").eq("id", user_id).limit(1).execute()
    users = result.data or []
    if not users:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="User not found")

    return users[0]
