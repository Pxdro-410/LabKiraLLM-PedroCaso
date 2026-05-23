"""
Seed script to populate the database with initial sample data.
Run with: python -m app.seed  (from the backend/ directory)
"""
import asyncio
from decimal import Decimal

from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models.category import Category
from app.models.order import Order, OrderItem  # noqa: F401 — ensure models are registered
from app.models.product import Product


SEED_DATA = [
    {
        "name": "Entradas",
        "description": "Aperitivos y entradas para comenzar tu experiencia",
        "products": [
            {
                "name": "Ceviche Clásico",
                "description": "Fresco ceviche de pescado con limón, cebolla morada y cilantro",
                "price": Decimal("12.90"),
                "is_available": True,
            },
            {
                "name": "Tequeños de Queso",
                "description": "Crujientes palitos de masa rellenos de queso blanco derretido",
                "price": Decimal("8.50"),
                "is_available": True,
            },
            {
                "name": "Tabla de Embutidos",
                "description": "Selección de jamones, chorizos y quesos artesanales con pan tostado",
                "price": Decimal("18.00"),
                "is_available": True,
            },
        ],
    },
    {
        "name": "Platos Principales",
        "description": "Nuestros platos estrella preparados con ingredientes frescos",
        "products": [
            {
                "name": "Lomo Saltado",
                "description": "Clásico salteado de lomo fino con papas fritas, tomate y cebolla",
                "price": Decimal("22.50"),
                "is_available": True,
            },
            {
                "name": "Pollo a la Brasa",
                "description": "Pollo entero marinado y asado a la leña, acompañado de papas y ensalada",
                "price": Decimal("28.00"),
                "is_available": True,
            },
            {
                "name": "Pasta Alfredo con Camarones",
                "description": "Fettuccine en salsa cremosa de parmesano con camarones salteados",
                "price": Decimal("24.90"),
                "is_available": True,
            },
            {
                "name": "Hamburguesa Gourmet",
                "description": "Carne de res 200g, queso cheddar, bacon, lechuga, tomate y salsa especial",
                "price": Decimal("19.90"),
                "is_available": True,
            },
        ],
    },
    {
        "name": "Postres",
        "description": "Dulces tentaciones para cerrar con broche de oro",
        "products": [
            {
                "name": "Tiramisú Casero",
                "description": "Clásico postre italiano con mascarpone, café espresso y cacao",
                "price": Decimal("9.50"),
                "is_available": True,
            },
            {
                "name": "Brownie con Helado",
                "description": "Brownie de chocolate caliente con bola de helado de vainilla y salsa de caramelo",
                "price": Decimal("10.90"),
                "is_available": True,
            },
            {
                "name": "Cheesecake de Frutos Rojos",
                "description": "Tarta de queso cremosa con coulis de fresas y arándanos frescos",
                "price": Decimal("11.50"),
                "is_available": True,
            },
        ],
    },
    {
        "name": "Bebidas",
        "description": "Refrescantes bebidas para acompañar tu comida",
        "products": [
            {
                "name": "Limonada Frozen",
                "description": "Limonada helada con menta fresca y un toque de jengibre",
                "price": Decimal("6.50"),
                "is_available": True,
            },
            {
                "name": "Jugo Natural del Día",
                "description": "Jugo fresco de temporada preparado al momento sin azúcar añadida",
                "price": Decimal("5.90"),
                "is_available": True,
            },
            {
                "name": "Agua Mineral",
                "description": "Agua mineral natural con o sin gas, botella 500ml",
                "price": Decimal("3.00"),
                "is_available": True,
            },
            {
                "name": "Café Americano",
                "description": "Café de especialidad preparado en cafetera de filtro, taza grande",
                "price": Decimal("4.50"),
                "is_available": True,
            },
        ],
    },
]


async def seed_db() -> None:
    """Populate the database with sample categories and products.

    This function is idempotent: it checks whether data already exists
    before inserting, so it is safe to run multiple times.
    """
    async with AsyncSessionLocal() as session:
        # Check if categories already exist — if so, skip seeding
        result = await session.execute(select(Category).limit(1))
        existing = result.scalars().first()
        if existing is not None:
            print("Database already seeded. Skipping.")
            return

        print("Seeding database with sample data...")

        for category_data in SEED_DATA:
            products_data = category_data.pop("products")

            category = Category(**category_data)
            session.add(category)
            await session.flush()  # Obtain category.id before creating products

            for product_data in products_data:
                product = Product(category_id=category.id, **product_data)
                session.add(product)

        await session.commit()
        print("Database seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed_db())
