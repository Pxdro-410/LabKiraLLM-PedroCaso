from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import connect_with_retry
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_with_retry(settings.max_retries, settings.retry_interval)
    yield


app = FastAPI(
    title="Food Business API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"data": None, "error": str(exc.errors()), "status": 400},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"data": None, "error": exc.detail, "status": exc.status_code},
    )


@app.get("/")
async def root():
    return {"data": "Food Business API running", "error": None, "status": 200}


# Register API routes
app.include_router(api_router, prefix="/api/v1")
