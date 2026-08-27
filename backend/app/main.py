"""
app/main.py — FastAPI application entry point

Shivkara Digital — WhatsApp Bot & Website Backend
Supports: Lead Generation · Internships · Courses
"""
from __future__ import annotations

import logging
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.flows.router import router as flow_router
from app.repositories.firestore import init_firestore
from app.webhooks.whatsapp_webhook import router as whatsapp_router
from app.api.admin import router as admin_router
from app.api.auth import router as auth_router

# ── Logging ───────────────────────────────────────────────────────────────────
settings = get_settings()
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Shivkara Digital — WhatsApp Bot & Website Backend",
    version="1.0.0",
    description="WhatsApp Flow backend for Lead Gen, Internships & Courses.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000", "http://127.0.0.1:8000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(flow_router)
app.include_router(whatsapp_router)
app.include_router(admin_router)
app.include_router(auth_router)


from fastapi.staticfiles import StaticFiles

# ── Static Files ──────────────────────────────────────────────────────────────
app.mount("/static", StaticFiles(directory="app/static"), name="static")

from app.core.scheduler import start_background_scheduler
import asyncio

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    logger.info("Starting Shivkara Digital Bot v1.0")
    try:
        init_firestore()
        logger.info("Firestore connected successfully")
        
        # Start background tasks
        asyncio.create_task(start_background_scheduler())
    except Exception as exc:
        logger.error("Firestore init failed: %s", exc)


@app.get("/")
async def root():
    return {
        "name": "Shivkara Digital — WhatsApp Bot",
        "version": "1.0.0",
        "status": "running",
        "services": ["lead_gen", "internships", "courses"],
    }


# ── Socket.IO Wrap ────────────────────────────────────────────────────────────
import socketio
from app.core.socket import sio

# Wrap our FastAPI app with Socket.IO so they run on the same port
app = socketio.ASGIApp(sio, other_asgi_app=app)
