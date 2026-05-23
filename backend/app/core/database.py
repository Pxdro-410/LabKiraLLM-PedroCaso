import asyncio

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text

from app.core.config import settings


engine = create_async_engine(settings.database_url, echo=False)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def connect_with_retry(max_retries: int = 10, interval: int = 5) -> None:
    """Attempt to connect to the database, retrying on failure.

    Args:
        max_retries: Maximum number of connection attempts (default 10).
        interval: Seconds to wait between attempts (default 5).

    Raises:
        RuntimeError: If all attempts fail.
    """
    for attempt in range(1, max_retries + 1):
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            return  # Connection successful
        except Exception:
            if attempt == max_retries:
                raise RuntimeError(
                    f"No se pudo conectar a la base de datos después de {max_retries} intentos"
                )
            await asyncio.sleep(interval)
