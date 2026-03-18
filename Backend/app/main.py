from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers.health import router as health_router
from app.api.routers.auth import router as auth_router
from app.api.routers.vendors import router as vendors_router
from app.core.config import settings

app = FastAPI(title="Make My Car API (FastAPI)")

# Allow frontend app to call API from the browser.
allowed_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(auth_router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(vendors_router, prefix=f"/api/{settings.API_VERSION}")

@app.get("/")
async def root():
    return {"success": True, "message": "Welcome to Make My Car API (FastAPI)", "version": settings.API_VERSION}

@app.on_event("startup")
async def startup():
    # Supabase client is stateless; no explicit startup connection needed.
    return

@app.on_event("shutdown")
async def shutdown():
    # No persistent DB connection to close when using Supabase client.
    return
