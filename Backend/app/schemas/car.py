from datetime import datetime
from pydantic import BaseModel, Field


class CreateCarRequest(BaseModel):
    brand_id: str
    model_id: str
    variant: str = Field(min_length=1, max_length=120)
    fuel_type: str
    year: int = Field(ge=1990, le=2100)
    city_id: str


class CarOut(BaseModel):
    id: str
    user_id: str
    brand_id: str
    model_id: str
    variant: str
    fuel_type: str
    year: int
    city_id: str
    is_active: bool
    created_at: datetime
