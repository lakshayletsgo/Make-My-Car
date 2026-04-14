from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.security import require_roles
from app.db import supabase
from app.schemas.marketplace import CreateMarketplaceListingRequest, MarketplaceListingOut

router = APIRouter()


@router.post("/marketplace/listings", response_model=MarketplaceListingOut, status_code=status.HTTP_201_CREATED)
async def create_marketplace_listing(
    payload: CreateMarketplaceListingRequest,
    current_user=Depends(require_roles("USER", "ADMIN")),
):
    inserted = (
        supabase.table("marketplace_listings")
        .insert(
            {
                "seller_id": current_user["id"],
                "title": payload.title,
                "brand": payload.brand,
                "model": payload.model,
                "variant": payload.variant,
                "year": payload.year,
                "fuel_type": payload.fuel_type,
                "city": payload.city,
                "km_driven": payload.km_driven,
                "price": payload.price,
                "description": payload.description,
                "contact_phone": payload.contact_phone,
                "image_url": payload.image_url,
                "status": "ACTIVE",
            }
        )
        .execute()
        .data
        or []
    )

    if not inserted:
        raise HTTPException(status_code=500, detail="Failed to create marketplace listing")

    listing = inserted[0]
    return {
        **listing,
        "seller_name": current_user.get("name"),
    }


@router.get("/marketplace/listings", response_model=list[MarketplaceListingOut])
async def list_marketplace_listings(
    search: str | None = Query(None, min_length=2),
    city: str | None = Query(None),
    fuel_type: str | None = Query(None),
    min_price: float | None = Query(None, ge=0),
    max_price: float | None = Query(None, ge=0),
    limit: int = Query(40, ge=1, le=100),
):
    query = (
        supabase.table("marketplace_listings")
        .select(
            "id,seller_id,title,brand,model,variant,year,fuel_type,city,km_driven,price,description,contact_phone,image_url,status,created_at"
        )
        .eq("status", "ACTIVE")
    )

    if city:
        query = query.ilike("city", city)
    if fuel_type:
        query = query.ilike("fuel_type", fuel_type)
    if min_price is not None:
        query = query.gte("price", min_price)
    if max_price is not None:
        query = query.lte("price", max_price)
    if search:
        search_value = f"%{search}%"
        query = query.or_(
            f"title.ilike.{search_value},brand.ilike.{search_value},model.ilike.{search_value},variant.ilike.{search_value},description.ilike.{search_value}"
        )

    rows = query.order("created_at", desc=True).limit(limit).execute().data or []

    seller_ids = list({row["seller_id"] for row in rows})
    sellers_by_id = {}
    if seller_ids:
        seller_rows = supabase.table("users").select("id,name").in_("id", seller_ids).execute().data or []
        sellers_by_id = {seller["id"]: seller for seller in seller_rows}

    return [{**row, "seller_name": sellers_by_id.get(row["seller_id"], {}).get("name")} for row in rows]


@router.get("/marketplace/listings/me", response_model=list[MarketplaceListingOut])
async def list_my_marketplace_listings(current_user=Depends(require_roles("USER", "ADMIN"))):
    rows = (
        supabase.table("marketplace_listings")
        .select(
            "id,seller_id,title,brand,model,variant,year,fuel_type,city,km_driven,price,description,contact_phone,image_url,status,created_at"
        )
        .eq("seller_id", current_user["id"])
        .order("created_at", desc=True)
        .execute()
        .data
        or []
    )

    return [{**row, "seller_name": current_user.get("name")} for row in rows]
