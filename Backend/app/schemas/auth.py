from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class VerifyEmailRequest(BaseModel):
    token: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    is_verified: bool = False


class MeResponse(BaseModel):
    user: UserOut
    vendor_id: Optional[str] = None


class RegisterResponse(BaseModel):
    message: str
    email_verification_required: bool = True
    dev_verification_token: Optional[str] = None


class GenericMessageResponse(BaseModel):
    message: str
