from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, journals, insights, improvements, preferences

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(journals.router, prefix="/journals", tags=["journals"])
api_router.include_router(insights.router, prefix="/insights", tags=["insights"])
api_router.include_router(improvements.router, prefix="/improvements", tags=["improvements"])
api_router.include_router(preferences.router, prefix="/preferences", tags=["preferences"]) 