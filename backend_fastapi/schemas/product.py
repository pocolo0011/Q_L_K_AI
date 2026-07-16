# ============================================================
# KHO AI - Pydantic Schemas
# Product and Category validation
# ============================================================

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


# --- Product Schemas ---
class ProductBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=100)
    barcode: Optional[str] = Field(None, max_length=100)
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category_id: Optional[int] = None
    cost_price: float = Field(default=0.0, ge=0.0)
    sale_price: float = Field(..., gt=0.0)
    quantity: int = Field(default=0, ge=0)
    min_stock: int = Field(default=10, ge=0)
    image: Optional[str] = Field(None, max_length=500)
    status: str = Field(default="active", pattern="^(active|inactive|discontinued)$")

    @field_validator("sku")
    def validate_sku(cls, v):
        if not v.strip():
            raise ValueError("SKU cannot be empty or just whitespace.")
        return v.strip()

    @field_validator("name")
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError("Product name cannot be empty.")
        return v.strip()


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    sku: Optional[str] = Field(None, min_length=1, max_length=100)
    barcode: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category_id: Optional[int] = None
    cost_price: Optional[float] = Field(None, ge=0.0)
    sale_price: Optional[float] = Field(None, gt=0.0)
    quantity: Optional[int] = Field(None, ge=0)
    min_stock: Optional[int] = Field(None, ge=0)
    image: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = Field(None, pattern="^(active|inactive|discontinued)$")


class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[Category] = None

    class Config:
        from_attributes = True


class ProductListItem(BaseModel):
    id: int
    sku: str
    name: str
    category: Optional[str] = None
    sale_price: float
    quantity: int
    status: str
    image: Optional[str] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductListItem]
    total: int
    page: int
    limit: int
    pages: int
