from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import require_roles
from app.db import supabase
from app.schemas.car import CarOut, CreateCarRequest

router = APIRouter()


@router.post("/cars", response_model=CarOut, status_code=status.HTTP_201_CREATED)
async def create_car(payload: CreateCarRequest, current_user=Depends(require_roles("USER", "ADMIN"))):
    inserted = (
        supabase.table("cars")
        .insert(
            {
                "user_id": current_user["id"],
                "brand_id": payload.brand_id,
                "model_id": payload.model_id,
                "variant": payload.variant,
                "fuel_type": payload.fuel_type,
                "year": payload.year,
                "city_id": payload.city_id,
                "is_active": True,
            }
        )
        .execute()
        .data
        or []
    )

    if not inserted:
        raise HTTPException(status_code=500, detail="Failed to create car")

    return inserted[0]


@router.get("/cars/me", response_model=list[CarOut])
async def list_my_cars(current_user=Depends(require_roles("USER", "ADMIN"))):
    rows = (
        supabase.table("cars")
        .select("id,user_id,brand_id,model_id,variant,fuel_type,year,city_id,is_active,created_at")
        .eq("user_id", current_user["id"])
        .eq("is_active", True)
        .order("created_at", desc=True)
        .execute()
        .data
        or []
    )
    return rows


@router.get("/cars/meta/brands")
async def list_car_brands():
    rows = (
        supabase.table("car_brands")
        .select("id,name")
        .eq("is_active", True)
        .order("name")
        .execute()
        .data
        or []
    )
    return rows


@router.get("/cars/meta/models")
async def list_car_models(brand_id: str):
    rows = (
        supabase.table("car_models")
        .select("id,name,brand_id")
        .eq("brand_id", brand_id)
        .eq("is_active", True)
        .order("name")
        .execute()
        .data
        or []
    )
    return rows


@router.get("/cars/meta/cities")
async def list_cities():
    rows = (
        supabase.table("cities")
        .select("id,name,state")
        .eq("is_active", True)
        .order("name")
        .execute()
        .data
        or []
    )
    return rows
