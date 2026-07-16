# ============================================================
# KHO AI - Product and Category Repositories
# Database CRUD Operations (Clean Architecture)
# ============================================================

from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend_fastapi.models.product import Product, Category
from backend_fastapi.schemas.product import ProductCreate, ProductUpdate, CategoryCreate

class CategoryRepository:
    @staticmethod
    def get_by_id(db: Session, category_id: int):
        return db.query(Category).filter(Category.id == category_id).first()

    @staticmethod
    def get_by_name(db: Session, name: str):
        return db.query(Category).filter(Category.name == name).first()

    @staticmethod
    def list_all(db: Session):
        return db.query(Category).all()

    @staticmethod
    def create(db: Session, schema: CategoryCreate):
        db_category = Category(name=schema.name)
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category


class ProductRepository:
    @staticmethod
    def get_by_id(db: Session, product_id: int):
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def get_by_sku(db: Session, sku: str):
        return db.query(Product).filter(Product.sku == sku).first()

    @staticmethod
    def list_all(
        db: Session,
        page: int = 1,
        limit: int = 10,
        search: str = None,
        category_id: int = None,
        status: str = None
    ):
        query = db.query(Product)

        # Filters
        if category_id:
            query = query.filter(Product.category_id == category_id)
        if status and status != "all":
            query = query.filter(Product.status == status)

        # Search by SKU, Barcode, or Name
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Product.sku.ilike(search_pattern),
                    Product.barcode.ilike(search_pattern),
                    Product.name.ilike(search_pattern)
                )
            )

        total = query.count()
        offset = (page - 1) * limit
        items = query.order_by(Product.id.desc()).offset(offset).limit(limit).all()

        return items, total

    @staticmethod
    def create(db: Session, schema: ProductCreate):
        db_product = Product(**schema.model_dump())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def update(db: Session, db_product: Product, schema: ProductUpdate):
        update_data = schema.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def delete(db: Session, db_product: Product):
        db.delete(db_product)
        db.commit()
        return True
