from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.product import Product


async def get_all_products(db: AsyncSession, category_id: int | None = None) -> list[Product]:
    query = select(Product).where(Product.is_available == True)
    if category_id is not None:
        query = query.where(Product.category_id == category_id)
    result = await db.execute(query.order_by(Product.id))
    return list(result.scalars().all())


async def get_product_by_id(db: AsyncSession, product_id: int) -> Product | None:
    result = await db.execute(select(Product).where(Product.id == product_id))
    return result.scalars().first()
