from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.crud.product import get_all_products, get_product_by_id
from app.schemas.product import ProductRead

router = APIRouter()


@router.get("", response_model=dict)
async def list_products(
    category_id: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Return all available products, optionally filtered by category."""
    products = await get_all_products(db, category_id=category_id)
    return {
        "data": [ProductRead.model_validate(p).model_dump() for p in products],
        "error": None,
        "status": 200,
    }


@router.get("/{product_id}", response_model=dict)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    """Return a single product by ID."""
    product = await get_product_by_id(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {
        "data": ProductRead.model_validate(product).model_dump(),
        "error": None,
        "status": 200,
    }
