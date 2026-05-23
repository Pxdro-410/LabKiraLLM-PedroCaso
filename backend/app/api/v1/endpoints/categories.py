from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.crud.category import get_all_categories
from app.schemas.category import CategoryRead

router = APIRouter()


@router.get("", response_model=dict)
async def list_categories(db: AsyncSession = Depends(get_db)):
    """Return all categories."""
    categories = await get_all_categories(db)
    return {
        "data": [CategoryRead.model_validate(c).model_dump() for c in categories],
        "error": None,
        "status": 200,
    }
