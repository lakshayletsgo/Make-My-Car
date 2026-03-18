from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health():
    return {"success": True, "message": "ok"}
