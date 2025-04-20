from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
from typing import List, Optional

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Promptcraft Guild API",
    description="API for the Promptcraft Guild game - handles prompt evaluation and generation",
    version="0.1.0"
)

# Set up CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, set this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from .prometheus import router as prometheus_router
from .mistral import router as mistral_router

# Include routers
app.include_router(prometheus_router, prefix="/api/evaluate", tags=["evaluation"])
app.include_router(mistral_router, prefix="/api/generate", tags=["generation"])

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": {"api": "up"}}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Promptcraft Guild API",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True) 