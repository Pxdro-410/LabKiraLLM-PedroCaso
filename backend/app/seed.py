"""
Seed script to populate the database with initial sample data.
Run with: python -m app.seed  (from the backend/ directory)

Images: Unsplash Source API — free, no auth required, high quality.
Format: https://images.unsplash.com/photo-{id}?w=800&q=85&fit=crop&auto=format
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
                # Elegant ceviche plating — vibrant citrus & fish
                "image_url": "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Tequeños de Queso",
                "description": "Crujientes palitos de masa rellenos de queso blanco derretido",
                "price": Decimal("8.50"),
                "is_available": True,
                # Golden fried cheese sticks on dark slate
                "image_url": "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Tabla de Embutidos",
                "description": "Selección de jamones, chorizos y quesos artesanales con pan tostado",
                "price": Decimal("18.00"),
                "is_available": True,
                # Elegant charcuterie board with cured meats & cheeses
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=85&fit=crop&auto=format",
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
                # Stir-fried beef with vegetables — warm tones
                "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Pollo a la Brasa",
                "description": "Pollo entero marinado y asado a la leña, acompañado de papas y ensalada",
                "price": Decimal("28.00"),
                "is_available": True,
                # Perfectly roasted golden chicken
                "image_url": "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Pasta Alfredo con Camarones",
                "description": "Fettuccine en salsa cremosa de parmesano con camarones salteados",
                "price": Decimal("24.90"),
                "is_available": True,
                # Creamy fettuccine with shrimp — elegant plating
                "image_url": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Hamburguesa Gourmet",
                "description": "Carne de res 200g, queso cheddar, bacon, lechuga, tomate y salsa especial",
                "price": Decimal("19.90"),
                "is_available": True,
                # Gourmet burger with melted cheese — dark moody background
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=85&fit=crop&auto=format",
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
                # Classic tiramisu with cocoa dusting — elegant close-up
                "image_url": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Brownie con Helado",
                "description": "Brownie de chocolate caliente con bola de helado de vainilla y salsa de caramelo",
                "price": Decimal("10.90"),
                "is_available": True,
                # Warm chocolate brownie with vanilla ice cream scoop
                "image_url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Cheesecake de Frutos Rojos",
                "description": "Tarta de queso cremosa con coulis de fresas y arándanos frescos",
                "price": Decimal("11.50"),
                "is_available": True,
                # Elegant cheesecake slice with fresh berries
                "image_url": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=85&fit=crop&auto=format",
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
                # Icy lemonade with mint garnish — refreshing & bright
                "image_url": "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Jugo Natural del Día",
                "description": "Jugo fresco de temporada preparado al momento sin azúcar añadida",
                "price": Decimal("5.90"),
                "is_available": True,
                # Fresh orange juice with fruit slices — vibrant colors
                "image_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Agua Mineral",
                "description": "Agua mineral natural con o sin gas, botella 500ml",
                "price": Decimal("3.00"),
                "is_available": True,
                # Elegant glass of sparkling water with ice
                "image_url": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=85&fit=crop&auto=format",
            },
            {
                "name": "Café Americano",
                "description": "Café de especialidad preparado en cafetera de filtro, taza grande",
                "price": Decimal("4.50"),
                "is_available": True,
                # Artisan black coffee in elegant cup — moody dark tones
                "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=85&fit=crop&auto=format",
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
