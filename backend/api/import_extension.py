from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
from supabase import create_client
import os

router = APIRouter()

supabase_url = os.getenv("SUPABASE_URL") or ""
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or ""
supabase = create_client(supabase_url, supabase_key)


class Product(BaseModel):
    title: str = Field(..., description="Product title")
    description: Optional[str] = Field(None, description="Product description")
    price: float = Field(..., description="Product price")
    user_id: Optional[str] = Field(None, description="Owner user id")


class ImportRequest(BaseModel):
    products: List[Product]


class ImportResponse(BaseModel):
    inserted: int
    failed: int


@router.post("/api/import/products", response_model=ImportResponse)
async def import_products(payload: ImportRequest):
    inserted = 0
    for product in payload.products:
        result = (
            supabase.table("products")
            .insert(
                {
                    "user_id": product.user_id,
                    "title": product.title,
                    "description": product.description,
                    "price": product.price,
                }
            )
            .execute()
        )
        if getattr(result, "error", None) is None:
            inserted += 1
    failed = len(payload.products) - inserted
    return ImportResponse(inserted=inserted, failed=failed)
