from pydantic import BaseModel
from typing import List, Optional


class ProductOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price: Optional[float]


class ReviewOut(BaseModel):
    id: str
    rating: int
    title: Optional[str]
    comment: str
    user_id: str
    user_name: Optional[str]


class VendorOut(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    category: str
    price_range: str
    address: str
    location: Optional[str] = None
    latitude: float
    longitude: float
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    image: Optional[str]
    gallery: List[str]
    rating: float
    review_count: int
    is_verified: bool
    is_active: bool
    city_id: str
    products: List[ProductOut] = []
    reviews: List[ReviewOut] = []
