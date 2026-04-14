from datetime import datetime
from pydantic import BaseModel, Field


class CreateMarketplaceListingRequest(BaseModel):
    title: str = Field(min_length=3, max_length=140)
    brand: str = Field(min_length=1, max_length=80)
    model: str = Field(min_length=1, max_length=80)
    variant: str = Field(min_length=1, max_length=120)
    year: int = Field(ge=1990, le=2100)
    fuel_type: str = Field(min_length=1, max_length=30)
    city: str = Field(min_length=1, max_length=120)
    km_driven: int = Field(ge=0, le=2_000_000)
    price: float = Field(gt=0)
    description: str = Field(min_length=10, max_length=2000)
    contact_phone: str = Field(min_length=7, max_length=30)
    image_url: str | None = None


class MarketplaceListingOut(BaseModel):
    id: str
    seller_id: str
    seller_name: str | None = None
    title: str
    brand: str
    model: str
    variant: str
    year: int
    fuel_type: str
    city: str
    km_driven: int
    price: float
    description: str
    contact_phone: str
    image_url: str | None = None
    status: str
    created_at: datetime
