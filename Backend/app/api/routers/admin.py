import secrets
import string

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import require_roles
from app.db import supabase, supabase_admin
from app.schemas.admin import (
    AdminAnalyticsOverview,
    AdminCreateVendorRequest,
    AdminCreateVendorResponse,
)

router = APIRouter()


def _generate_temporary_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%"
    return "".join(secrets.choice(alphabet) for _ in range(length))


@router.post(
    "/admin/vendors",
    response_model=AdminCreateVendorResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_vendor_by_admin(
    payload: AdminCreateVendorRequest,
    _admin=Depends(require_roles("ADMIN")),
):
    if not supabase_admin:
        raise HTTPException(status_code=500, detail="Service role client is not configured")

    existing_vendor = (
        supabase.table("vendors")
        .select("id")
        .or_(f"slug.eq.{payload.slug},email.eq.{payload.email}")
        .limit(1)
        .execute()
        .data
        or []
    )
    if existing_vendor:
        raise HTTPException(status_code=400, detail="Vendor with same slug or email already exists")

    existing_user = (
        supabase.table("users")
        .select("id")
        .eq("email", payload.email)
        .limit(1)
        .execute()
        .data
        or []
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    temp_password = payload.password or _generate_temporary_password()

    created_user_id = None
    try:
        created_auth_user = supabase_admin.auth.admin.create_user(
            {
                "email": payload.email,
                "password": temp_password,
                "email_confirm": True,
                "user_metadata": {
                    "name": payload.name,
                    "phone": payload.phone,
                    "role": "VENDOR",
                },
            }
        )
        created_user = getattr(created_auth_user, "user", None)
        if not created_user or not getattr(created_user, "id", None):
            raise ValueError("Failed to create auth user")

        created_user_id = created_user.id

        supabase_admin.table("users").insert(
            {
                "id": created_user_id,
                "email": payload.email,
                "password": "[SUPABASE_MANAGED]",
                "name": payload.name,
                "phone": payload.phone or "",
                "role": "VENDOR",
                "is_verified": True,
            }
        ).execute()

        inserted_vendor = (
            supabase_admin.table("vendors")
            .insert(
                {
                    "name": payload.name,
                    "slug": payload.slug,
                    "description": payload.description,
                    "category": payload.category,
                    "price_range": payload.price_range,
                    "address": payload.address,
                    "latitude": payload.latitude,
                    "longitude": payload.longitude,
                    "phone": payload.phone,
                    "email": payload.email,
                    "website": payload.website,
                    "image": payload.image,
                    "city_id": payload.city_id,
                    "is_verified": True,
                    "is_active": True,
                }
            )
            .execute()
            .data
            or []
        )

        if not inserted_vendor:
            raise ValueError("Failed to insert vendor profile")

        vendor = inserted_vendor[0]

        return {
            "message": "Vendor created successfully",
            "vendor_id": vendor["id"],
            "vendor_user_id": created_user_id,
            "temporary_password": temp_password,
        }

    except Exception as exc:
        if created_user_id:
            try:
                supabase_admin.auth.admin.delete_user(created_user_id)
            except Exception:
                pass
        raise HTTPException(status_code=500, detail=f"Failed to create vendor: {exc}")


@router.get("/admin/analytics/overview", response_model=AdminAnalyticsOverview)
async def get_admin_analytics_overview(_admin=Depends(require_roles("ADMIN"))):
    users_count = supabase.table("users").select("id", count="exact").execute().count or 0
    vendors_count = supabase.table("vendors").select("id", count="exact").execute().count or 0
    active_vendors_count = (
        supabase.table("vendors").select("id", count="exact").eq("is_active", True).execute().count or 0
    )
    verified_vendors_count = (
        supabase.table("vendors").select("id", count="exact").eq("is_verified", True).execute().count or 0
    )

    total_bookings = supabase.table("bookings").select("id", count="exact").execute().count or 0
    completed_bookings = (
        supabase.table("bookings").select("id", count="exact").eq("status", "COMPLETED").execute().count or 0
    )
    cancelled_bookings = (
        supabase.table("bookings").select("id", count="exact").eq("status", "CANCELLED").execute().count or 0
    )

    return {
        "total_users": users_count,
        "total_vendors": vendors_count,
        "active_vendors": active_vendors_count,
        "verified_vendors": verified_vendors_count,
        "total_bookings": total_bookings,
        "completed_bookings": completed_bookings,
        "cancelled_bookings": cancelled_bookings,
    }
