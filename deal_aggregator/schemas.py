from pydantic import BaseModel
from typing import List, Optional
import datetime

# Schema for data we have after enrichment, used to create a DB entry
class DealCreate(BaseModel):
    product_id: str
    title: str
    image: Optional[str] = None
    price: float
    original_price: float
    discount: float
    url: str
    source: str
    category: str
    reddit_post_id: str

# Base schema for reading a Deal, includes all fields from DB
class DealBase(DealCreate):
    id: int
    created_at: datetime.datetime
    clicks: int

# Schema for returning a deal from the API
class Deal(DealBase):
    class Config:
        orm_mode = True

class Category(BaseModel):
    category: str
    count: int
