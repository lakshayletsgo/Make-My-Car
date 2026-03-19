from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CreateBookingRequest(BaseModel):
    vendor_id: str
    slot_at: datetime
    notes: Optional[str] = Field(default=None, max_length=1000)


class UpdateBookingStatusRequest(BaseModel):
    status: str


class BookingOut(BaseModel):
    id: str
    user_id: str
    vendor_id: str
    slot_at: datetime
    status: str
    notes: Optional[str] = None
    created_at: datetime
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    vendor_name: Optional[str] = None


class VendorDashboardSummary(BaseModel):
    total_bookings: int
    pending_bookings: int
    confirmed_bookings: int
    completed_bookings: int
    cancelled_bookings: int
