import asyncio
import os 
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.dummy import router as dummy_router
from app.db.database import Base, engine
from app.api.heart_prediction import router as heart_router

# Set Windows event loop policy for Playwright compatibility
if os.name == 'nt':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# Create database tables at startup
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Demo Assist Backend",
    description="Backend APIs for Demo Assist Project (FastAPI + PostgreSQL + JWT)",
    version="1.0.0",
    contact={"name": "Narendra Babu", "email": "naren@example.com"},
    license_info={"name": "MIT License"},
)

# CORS setup
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(dummy_router)
app.include_router(heart_router)

