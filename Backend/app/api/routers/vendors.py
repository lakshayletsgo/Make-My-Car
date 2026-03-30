from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.db import supabase
from app.schemas.vendor import VendorOut

router = APIRouter()


@router.get('/vendors', response_model=List[VendorOut])
async def list_vendors(
    category: Optional[str] = Query(None),
    city_id: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    offset = (page - 1) * limit
    query = supabase.table("vendors").select(
        "id,name,slug,description,category,price_range,address,latitude,longitude,phone,email,website,image,gallery,rating,review_count,is_verified,is_active,city_id,created_at,updated_at"
    ).eq("is_active", True)

    if category:
        query = query.eq("category", category)
    if city_id:
        query = query.eq("city_id", city_id)

    rows = query.order("rating", desc=True).order("created_at", desc=True).range(offset, offset + limit - 1).execute().data or []

    vendors = []
    for r in rows:
        # fetch products for each vendor (limited)
        products = supabase.table("products").select("id,name,description,price").eq("vendor_id", r["id"]).limit(5).execute().data or []
        vendors.append({
            **r,
            'products': products,
            'reviews': []
        })

    return vendors


@router.get('/vendors/{vendor_id}', response_model=VendorOut)
async def get_vendor(vendor_id: str):
    by_id = supabase.table("vendors").select("*").eq("id", vendor_id).limit(1).execute().data or []
    vendor = by_id[0] if by_id else None
    if not vendor:
        by_slug = supabase.table("vendors").select("*").eq("slug", vendor_id).limit(1).execute().data or []
        vendor = by_slug[0] if by_slug else None
    if not vendor:
        raise HTTPException(status_code=404, detail='Vendor not found')

    products = supabase.table("products").select("id,name,description,price").eq("vendor_id", vendor["id"]).execute().data or []
    reviews_raw = supabase.table("reviews").select("id,rating,title,comment,user_id").eq("vendor_id", vendor["id"]).eq("status", "APPROVED").order("created_at", desc=True).limit(20).execute().data or []

    user_ids = list({rev["user_id"] for rev in reviews_raw if rev.get("user_id")})
    users_by_id = {}
    if user_ids:
        users = supabase.table("users").select("id,name").in_("id", user_ids).execute().data or []
        users_by_id = {u["id"]: u for u in users}

    return {
        **vendor,
        'products': products,
        'reviews': [{
            'id': rev['id'],
            'rating': rev['rating'],
            'title': rev.get('title'),
            'comment': rev['comment'],
            'user_id': rev['user_id'],
            'user_name': users_by_id.get(rev['user_id'], {}).get('name')
        } for rev in reviews_raw]
    }
