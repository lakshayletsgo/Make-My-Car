from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class AdminCreateVendorRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=64)
    slug: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=10, max_length=1000)
    category: str
    price_range: str
    address: str
    latitude: float
    longitude: float
    city_id: str
    website: Optional[str] = None
    image: Optional[str] = None


class AdminCreateVendorResponse(BaseModel):
    message: str
    vendor_id: str
    vendor_user_id: str
    temporary_password: Optional[str] = None


class AdminAnalyticsOverview(BaseModel):
    total_users: int
    total_vendors: int
    active_vendors: int
    verified_vendors: int
    total_bookings: int
    completed_bookings: int
    cancelled_bookings: int
