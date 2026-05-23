from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


class ProductBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: str | None = None
    price: Decimal = Field(..., gt=0, decimal_places=2)
    image_url: str | None = None
    is_available: bool = True


class ProductRead(ProductBase):
    id: int
    category_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
