"""
app/core/socket.py — Real-time Socket.IO communication module for Shivkara Digital
"""
from __future__ import annotations

import logging
import socketio

logger = logging.getLogger(__name__)

# Initialize Socket.IO AsyncServer
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")

@sio.event
async def connect(sid, environ):
    logger.info("Socket client connected: %s", sid)
    await sio.emit("connection_ack", {"status": "connected", "sid": sid}, to=sid)

@sio.event
async def disconnect(sid):
    logger.info("Socket client disconnected: %s", sid)


# ─── Shivkara Digital Broadcasting functions ────────────────────────────────

async def broadcast_new_lead(data: dict) -> None:
    """Broadcasts a new lead/deployment inquiry to the admin dashboard."""
    logger.info("Broadcasting 'new_lead' event: %s", data.get("id"))
    await sio.emit("new_lead", data)


async def broadcast_new_internship_application(data: dict) -> None:
    """Broadcasts a new internship application to the admin dashboard."""
    logger.info("Broadcasting 'new_internship_application' event: %s", data.get("id"))
    await sio.emit("new_internship_application", data)


async def broadcast_new_course_booking(data: dict) -> None:
    """Broadcasts a new course booking to the admin dashboard."""
    logger.info("Broadcasting 'new_course_booking' event: %s", data.get("id"))
    await sio.emit("new_course_booking", data)


async def broadcast_certificate_sent(data: dict) -> None:
    """Broadcasts when a certificate has been sent via WhatsApp."""
    logger.info("Broadcasting 'certificate_sent' event: %s", data.get("certificate_id"))
    await sio.emit("certificate_sent", data)
