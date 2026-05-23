from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.crud.order import create_order, get_order_by_id
from app.schemas.order import OrderCreate, OrderRead

router = APIRouter()


@router.post("", response_model=dict, status_code=201)
async def place_order(order_data: OrderCreate, db: AsyncSession = Depends(get_db)):
    """Create a new order from the provided cart items."""
    order = await create_order(db, order_data)
    return JSONResponse(
        status_code=201,
        content={
            "data": OrderRead.model_validate(order).model_dump(mode="json"),
            "error": None,
            "status": 201,
        },
    )


@router.get("/{order_id}", response_model=dict)
async def get_order(order_id: int, db: AsyncSession = Depends(get_db)):
    """Return a single order by ID."""
    order = await get_order_by_id(db, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return {
        "data": OrderRead.model_validate(order).model_dump(mode="json"),
        "error": None,
        "status": 200,
    }
