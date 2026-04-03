from fastapi import APIRouter, Depends, HTTPException, status

from app.core.email import send_vendor_booking_notification_email
from app.core.security import require_roles
from app.db import supabase
from app.schemas.booking import (
    BookingOut,
    CreateBookingRequest,
    UpdateBookingStatusRequest,
    VendorDashboardSummary,
)

router = APIRouter()
VALID_STATUSES = {"PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"}


def _resolve_vendor_for_user_email(email: str):
    vendors = supabase.table("vendors").select("id,name,email").eq("email", email).limit(1).execute().data or []
    return vendors[0] if vendors else None


@router.post("/bookings", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
async def create_booking(payload: CreateBookingRequest, current_user=Depends(require_roles("USER"))):
    vendor = supabase.table("vendors").select("id,name,email").eq("id", payload.vendor_id).limit(1).execute().data or []
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    inserted = (
        supabase.table("bookings")
        .insert(
            {
                "user_id": current_user["id"],
                "vendor_id": payload.vendor_id,
                "slot_at": payload.slot_at.isoformat(),
                "status": "PENDING",
                "notes": payload.notes,
            }
        )
        .execute()
        .data
        or []
    )
    if not inserted:
        raise HTTPException(status_code=500, detail="Failed to create booking")

    booking = inserted[0]
    vendor_row = vendor[0]

    vendor_email = vendor_row.get("email")
    if vendor_email:
        # Keep booking creation resilient even if email delivery fails.
        send_vendor_booking_notification_email(
            vendor_email=vendor_email,
            vendor_name=vendor_row.get("name") or "Vendor",
            booking_id=booking["id"],
            slot_at=payload.slot_at,
            customer_name=current_user.get("name"),
            customer_email=current_user.get("email"),
            notes=payload.notes,
        )

    return {
        **booking,
        "user_name": current_user.get("name"),
        "user_email": current_user.get("email"),
        "vendor_name": vendor_row.get("name"),
    }


@router.get("/bookings/me", response_model=list[BookingOut])
async def list_my_bookings(current_user=Depends(require_roles("USER"))):
    rows = (
        supabase.table("bookings")
        .select("id,user_id,vendor_id,slot_at,status,notes,created_at")
        .eq("user_id", current_user["id"])
        .order("created_at", desc=True)
        .execute()
        .data
        or []
    )

    vendor_ids = list({row["vendor_id"] for row in rows})
    vendors = {}
    if vendor_ids:
        vendor_rows = supabase.table("vendors").select("id,name").in_("id", vendor_ids).execute().data or []
        vendors = {v["id"]: v for v in vendor_rows}

    return [{**row, "vendor_name": vendors.get(row["vendor_id"], {}).get("name")} for row in rows]


@router.get("/vendor/bookings", response_model=list[BookingOut])
async def list_vendor_bookings(current_user=Depends(require_roles("VENDOR"))):
    vendor = _resolve_vendor_for_user_email(current_user["email"])
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found for logged in user")

    rows = (
        supabase.table("bookings")
        .select("id,user_id,vendor_id,slot_at,status,notes,created_at")
        .eq("vendor_id", vendor["id"])
        .order("created_at", desc=True)
        .execute()
        .data
        or []
    )

    user_ids = list({row["user_id"] for row in rows})
    users = {}
    if user_ids:
        user_rows = supabase.table("users").select("id,name,email").in_("id", user_ids).execute().data or []
        users = {u["id"]: u for u in user_rows}

    return [
        {
            **row,
            "user_name": users.get(row["user_id"], {}).get("name"),
            "user_email": users.get(row["user_id"], {}).get("email"),
            "vendor_name": vendor["name"],
        }
        for row in rows
    ]


@router.patch("/vendor/bookings/{booking_id}/status", response_model=BookingOut)
async def update_vendor_booking_status(
    booking_id: str,
    payload: UpdateBookingStatusRequest,
    current_user=Depends(require_roles("VENDOR")),
):
    next_status = payload.status.upper()
    if next_status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid booking status")

    vendor = _resolve_vendor_for_user_email(current_user["email"])
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found for logged in user")

    existing = (
        supabase.table("bookings")
        .select("id,user_id,vendor_id,slot_at,status,notes,created_at")
        .eq("id", booking_id)
        .eq("vendor_id", vendor["id"])
        .limit(1)
        .execute()
        .data
        or []
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Booking not found")

    updated = (
        supabase.table("bookings")
        .update({"status": next_status})
        .eq("id", booking_id)
        .eq("vendor_id", vendor["id"])
        .execute()
        .data
        or []
    )
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update booking")

    booking = updated[0]
    user_rows = supabase.table("users").select("name,email").eq("id", booking["user_id"]).limit(1).execute().data or []
    user = user_rows[0] if user_rows else {}

    return {
        **booking,
        "user_name": user.get("name"),
        "user_email": user.get("email"),
        "vendor_name": vendor["name"],
    }


@router.get("/vendor/dashboard/summary", response_model=VendorDashboardSummary)
async def vendor_dashboard_summary(current_user=Depends(require_roles("VENDOR"))):
    vendor = _resolve_vendor_for_user_email(current_user["email"])
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found for logged in user")

    total = supabase.table("bookings").select("id", count="exact").eq("vendor_id", vendor["id"]).execute().count or 0
    pending = (
        supabase.table("bookings")
        .select("id", count="exact")
        .eq("vendor_id", vendor["id"])
        .eq("status", "PENDING")
        .execute()
        .count
        or 0
    )
    confirmed = (
        supabase.table("bookings")
        .select("id", count="exact")
        .eq("vendor_id", vendor["id"])
        .eq("status", "CONFIRMED")
        .execute()
        .count
        or 0
    )
    completed = (
        supabase.table("bookings")
        .select("id", count="exact")
        .eq("vendor_id", vendor["id"])
        .eq("status", "COMPLETED")
        .execute()
        .count
        or 0
    )
    cancelled = (
        supabase.table("bookings")
        .select("id", count="exact")
        .eq("vendor_id", vendor["id"])
        .eq("status", "CANCELLED")
        .execute()
        .count
        or 0
    )

    return {
        "total_bookings": total,
        "pending_bookings": pending,
        "confirmed_bookings": confirmed,
        "completed_bookings": completed,
        "cancelled_bookings": cancelled,
    }
