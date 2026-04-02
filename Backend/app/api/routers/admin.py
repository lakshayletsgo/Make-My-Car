import secrets
import string
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.map_helpers import resolve_google_maps_link
from app.core.security import require_roles
from app.core.email import send_vendor_welcome_email
from app.db import supabase, supabase_admin
from app.schemas.admin import (
    AdminAnalyticsOverview,
    AdminBannerUploadResponse,
    AdminCreateVendorRequest,
    AdminCreateVendorResponse,
    AdminResolveMapLinkRequest,
    AdminResolveMapLinkResponse,
)

router = APIRouter()
BANNERS_BUCKET = "Banners"


def _generate_temporary_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def _extract_public_url(raw: object) -> str:
    if isinstance(raw, str):
        return raw
    if isinstance(raw, dict):
        value = raw.get("publicURL") or raw.get("publicUrl")
        if isinstance(value, str):
            return value
    raise ValueError("Storage did not return a public URL")


@router.post(
    "/admin/maps/resolve",
    response_model=AdminResolveMapLinkResponse,
)
async def resolve_google_maps_link_by_admin(
    payload: AdminResolveMapLinkRequest,
    _admin=Depends(require_roles("ADMIN")),
):
    try:
        latitude, longitude, resolved_url = resolve_google_maps_link(payload.gmaps_link)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Unable to resolve Google Maps link: {exc}")

    return {
        "latitude": latitude,
        "longitude": longitude,
        "resolved_url": resolved_url,
    }


@router.post(
    "/admin/vendors/banner-upload",
    response_model=AdminBannerUploadResponse,
)
async def upload_vendor_banners_by_admin(
    files: list[UploadFile] = File(...),
    _admin=Depends(require_roles("ADMIN")),
):
    if not supabase_admin:
        raise HTTPException(status_code=500, detail="Service role client is not configured")
    if not files:
        raise HTTPException(status_code=400, detail="No files were provided")

    uploaded_urls: list[str] = []

    for upload in files:
        content_type = upload.content_type or ""
        if not (content_type.startswith("image/") or content_type.startswith("video/")):
            raise HTTPException(status_code=400, detail="Only image or video files are allowed")

        file_bytes = await upload.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="One of the files is empty")

        original_name = upload.filename or "banner"
        safe_name = "".join(ch for ch in original_name if ch.isalnum() or ch in {".", "-", "_"}) or "banner"
        object_path = f"vendors/{uuid.uuid4().hex}-{safe_name}"

        supabase_admin.storage.from_(BANNERS_BUCKET).upload(
            path=object_path,
            file=file_bytes,
            file_options={"content-type": content_type, "upsert": "false"},
        )

        public_url = _extract_public_url(supabase_admin.storage.from_(BANNERS_BUCKET).get_public_url(object_path))
        uploaded_urls.append(public_url)

    return {"urls": uploaded_urls}


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
                    "location": payload.location,
                    "latitude": payload.latitude,
                    "longitude": payload.longitude,
                    "phone": payload.phone,
                    "email": payload.email,
                    "website": payload.website,
                    "image": payload.image or ((payload.gallery or [None])[0]),
                    "gallery": payload.gallery or [],
                    "city_id": payload.city_id,
                    "is_verified": True,
                    "is_active": True
                    # "location": payload.gmaps_link,
                }
            )
            .execute()
            .data
            or []
        )

        if not inserted_vendor:
            raise ValueError("Failed to insert vendor profile")

        vendor = inserted_vendor[0]

        # Send welcome email with credentials
        send_vendor_welcome_email(
            vendor_email=payload.email,
            vendor_name=payload.name,
            vendor_id=vendor["id"],
            temporary_password=temp_password,
        )

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
