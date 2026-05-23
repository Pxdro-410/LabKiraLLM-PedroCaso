from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


async def create_order(db: AsyncSession, order_data: OrderCreate) -> Order:
    total = Decimal("0.00")
    items_to_create = []

    for item in order_data.items:
        result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = result.scalars().first()
        if product is None:
            raise HTTPException(
                status_code=404,
                detail=f"Producto con id {item.product_id} no encontrado"
            )
        unit_price = product.price
        total += unit_price * item.quantity
        items_to_create.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "unit_price": unit_price,
        })

    order = Order(status="Pendiente", total=total)
    db.add(order)
    await db.flush()

    for item_data in items_to_create:
        order_item = OrderItem(order_id=order.id, **item_data)
        db.add(order_item)

    await db.commit()

    # Reload with items
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order.id)
    )
    return result.scalars().first()


async def get_order_by_id(db: AsyncSession, order_id: int) -> Order | None:
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order_id)
    )
    return result.scalars().first()
