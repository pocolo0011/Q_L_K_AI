# ============================================================
# KHO AI - SQLAlchemy Models
# Category and Product Models
# ============================================================

from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from backend_fastapi.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    barcode = Column(String(100), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    cost_price = Column(Float, default=0.0, nullable=False)
    sale_price = Column(Float, default=0.0, nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    min_stock = Column(Integer, default=10, nullable=False)
    image = Column(String(500), nullable=True)
    status = Column(String(50), default="active", nullable=False) # active, inactive, discontinued
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    category = relationship("Category", back_populates="products")
