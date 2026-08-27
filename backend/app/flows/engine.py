"""
app/flows/engine.py — Screen routing brain for Shivkara Digital WhatsApp Bot

All transitions use data_exchange. The engine:
  1. Inspects the incoming screen + action
  2. Validates submitted data
  3. Calls the appropriate service/repository
  4. Returns the NEXT screen name + its fully populated data dict
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from app.flows.schemas import (
    FlowRequest,
    MainMenuSelectionData,
    DeploymentFormData,
    InternshipSelectionData,
    InternshipApplicationData,
    CourseSelectionData,
    CourseBookingData,
)
from app.services import whatsapp as wa_svc

logger = logging.getLogger(__name__)


async def route(request: FlowRequest, flow_token: str = "") -> dict[str, Any]:
    """
    Main entry point. Dispatch to the correct screen handler.
    Returns a dict with {"screen": "...", "data": {...}}.
    """
    action = (request.action or "").lower()
    screen = (request.screen or "").upper()

    logger.info("Flow route → screen=%s action=%s", screen, action)

    # Ping — health check used by Meta
    if action == "ping":
        return _handle_ping()

    # INIT action fires when the flow is first opened
    if action == "init":
        return _handle_init(request)

    # data_exchange dispatching
    if action == "data_exchange":
        return await _dispatch_data_exchange(screen, request)

    # Fallback
    logger.warning("Unhandled action=%s screen=%s", action, screen)
    return _handle_ping()


# ─── Ping ─────────────────────────────────────────────────────────────────────

def _handle_ping() -> dict:
    return {
        "screen": "SUCCESS",
        "data": {
            "status": "active",
        }
    }


def _unpack_user_context(token: str | None) -> tuple[str, str]:
    """
    Extracts (phone, name) from the compacted URL-Safe flow_token payload.
    """
    import base64
    import json
    
    if not token:
        return "", ""
        
    try:
        # Assuming token is raw base64 or has a prefix
        prefix = ""
        for p in ["sd_main_", "sd_"]:
            if token.startswith(p):
                prefix = p
                break

        raw = token.replace(prefix, "") if prefix else token
        # Restore base64 padding
        padding = len(raw) % 4
        if padding:
            raw += "=" * (4 - padding)
        
        decoded = base64.urlsafe_b64decode(raw).decode()
        data = json.loads(decoded)
        return data.get("p", ""), data.get("n", "")
    except Exception as e:
        logger.debug("Failed to unpack token context: %s", e)
        return "", ""


# ─── Init (flow open) ─────────────────────────────────────────────────────────

def _handle_init(request: FlowRequest) -> dict:
    """Return initial screen on flow open."""
    # Always open the Main Menu for Shivkara Digital
    return {
        "screen": "MAIN_MENU",
        "data": {}
    }


# ─── data_exchange dispatcher ─────────────────────────────────────────────────

async def _dispatch_data_exchange(screen: str, request: FlowRequest) -> dict:
    handlers = {
        "MAIN_MENU": _handle_main_menu,
        "DEPLOYMENT_FORM": _handle_deployment_form,
        "INTERNSHIP_LIST": _handle_internship_list,
        "INTERNSHIP_FORM": _handle_internship_form,
        "COURSE_LIST": _handle_course_list,
        "COURSE_FORM": _handle_course_form,
    }
    handler = handlers.get(screen)
    if handler is None:
        logger.error("No handler for screen=%s", screen)
    try:
        if "error" in request.data:
            logger.error("Client sent flow error payload: %s", request.data["error"])
            return {"screen": screen, "data": request.data}
            
        return await handler(request)
    except Exception as e:
        logger.error("Error in handler for screen %s: %s", screen, e)
        return {"screen": screen, "data": request.data}


# ─── Screen Handlers ──────────────────────────────────────────────────────────

async def _handle_main_menu(request: FlowRequest) -> dict:
    """Handles selection from the main menu."""
    data = MainMenuSelectionData(**request.data)
    
    if data.selection == "deployment":
        return {
            "screen": "DEPLOYMENT_FORM",
            "data": {}
        }
        
    elif data.selection == "internships":
        from app.repositories.firestore import _get_db
        db = _get_db()
        
        # Load internships
        docs = db.collection("internships").where("status", "==", "active").stream()
        internship_options = []
        for doc in docs:
            i_data = doc.to_dict()
            internship_options.append({
                "id": doc.id,
                "title": i_data.get("title", "Internship"),
                "description": f"Duration: {i_data.get('duration', 'N/A')}"
            })
            
        if not internship_options:
            internship_options = [{"id": "none", "title": "No internships available", "description": "Check back later"}]
            
        return {
            "screen": "INTERNSHIP_LIST",
            "data": {
                "internships": internship_options
            }
        }
        
    elif data.selection == "courses":
        from app.repositories.firestore import _get_db
        db = _get_db()
        
        # Load courses
        docs = db.collection("courses").where("status", "==", "active").stream()
        course_options = []
        for doc in docs:
            c_data = doc.to_dict()
            course_options.append({
                "id": doc.id,
                "title": c_data.get("title", "Course"),
                "description": f"Price: ₹{c_data.get('price', 0)}"
            })
            
        if not course_options:
            course_options = [{"id": "none", "title": "No courses available", "description": "Check back later"}]
            
        return {
            "screen": "COURSE_LIST",
            "data": {
                "courses": course_options
            }
        }

    # Fallback
    return {"screen": "MAIN_MENU", "data": {}}


async def _handle_deployment_form(request: FlowRequest) -> dict:
    """Handles submission of the deployment lead form."""
    data = DeploymentFormData(**request.data)
    
    from app.repositories.firestore import _get_db
    db = _get_db()
    
    lead_id = f"LEAD_{int(datetime.now().timestamp())}"
    lead_doc = {
        "id": lead_id,
        "type": "deployment",
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "company": data.company,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    db.collection("leads").document(lead_id).set(lead_doc)
    
    # Notify Admin Dashboard via Socket.io
    from app.core.socket import broadcast_new_lead
    await broadcast_new_lead(lead_doc)
    
    # Notify Owner via WhatsApp
    from app.config import get_settings
    owner_phone = get_settings().owner_phone_number
    if owner_phone:
        msg = (
            f"🚀 *New Shivkara Digital Lead!*\n\n"
            f"👤 Name: {data.name}\n"
            f"📱 Phone: {data.phone}\n"
            f"✉️ Email: {data.email}\n"
            f"🏢 Company: {data.company}\n\n"
            f"_Submitted via WhatsApp_"
        )
        try:
            wa_svc.send_text_message(to=owner_phone, body=msg)
        except Exception as e:
            logger.error(f"Failed to notify owner: {e}")
    
    return {
        "screen": "SUCCESS",
        "data": {
            "status_message": f"Thank you {data.name}! Our deployment team will contact you shortly at {data.phone}."
        }
    }


async def _handle_internship_list(request: FlowRequest) -> dict:
    """Handles selection of an internship."""
    data = InternshipSelectionData(**request.data)
    
    if data.internship_id == "none":
        return {"screen": "SUCCESS", "data": {"status_message": "Please check back later for new internships."}}
        
    from app.repositories.firestore import _get_db
    db = _get_db()
    
    doc = db.collection("internships").document(data.internship_id).get()
    title = doc.to_dict().get("title", "Internship") if doc.exists else "Internship"
    
    return {
        "screen": "INTERNSHIP_FORM",
        "data": {
            "internship_id": data.internship_id,
            "internship_title": title
        }
    }


async def _handle_internship_form(request: FlowRequest) -> dict:
    """Handles submission of internship application."""
    data = InternshipApplicationData(**request.data)
    
    from app.repositories.firestore import _get_db
    db = _get_db()
    
    app_id = f"APP_{int(datetime.now().timestamp())}"
    app_doc = {
        "id": app_id,
        "internship_id": data.internship_id,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "resume_url": data.resume_url,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    db.collection("internship_applications").document(app_id).set(app_doc)
    
    # Notify Admin Dashboard via Socket.io
    from app.core.socket import broadcast_new_internship_application
    await broadcast_new_internship_application(app_doc)
    
    # Notify Owner via WhatsApp
    from app.config import get_settings
    owner_phone = get_settings().owner_phone_number
    if owner_phone:
        msg = (
            f"🎓 *New Internship Application!*\n\n"
            f"👤 Name: {data.name}\n"
            f"📱 Phone: {data.phone}\n"
            f"✉️ Email: {data.email}\n"
            f"💼 Internship ID: {data.internship_id}\n"
            f"📄 Resume: {data.resume_url}\n\n"
            f"_Submitted via WhatsApp_"
        )
        try:
            wa_svc.send_text_message(to=owner_phone, body=msg)
        except Exception as e:
            logger.error(f"Failed to notify owner: {e}")
    
    return {
        "screen": "SUCCESS",
        "data": {
            "status_message": f"Awesome {data.name}! We have received your application. We will review your resume and get back to you."
        }
    }


async def _handle_course_list(request: FlowRequest) -> dict:
    """Handles selection of a course."""
    data = CourseSelectionData(**request.data)
    
    if data.course_id == "none":
        return {"screen": "SUCCESS", "data": {"status_message": "Please check back later for new courses."}}
        
    from app.repositories.firestore import _get_db
    db = _get_db()
    
    doc = db.collection("courses").document(data.course_id).get()
    title = doc.to_dict().get("title", "Course") if doc.exists else "Course"
    
    return {
        "screen": "COURSE_FORM",
        "data": {
            "course_id": data.course_id,
            "course_title": title
        }
    }


async def _handle_course_form(request: FlowRequest) -> dict:
    """Handles submission of course booking."""
    data = CourseBookingData(**request.data)
    
    from app.repositories.firestore import _get_db
    db = _get_db()
    
    booking_id = f"CBK_{int(datetime.now().timestamp())}"
    booking_doc = {
        "id": booking_id,
        "course_id": data.course_id,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    db.collection("course_bookings").document(booking_id).set(booking_doc)
    
    # Notify Admin Dashboard via Socket.io
    from app.core.socket import broadcast_new_course_booking
    await broadcast_new_course_booking(booking_doc)
    
    # Notify Owner via WhatsApp
    from app.config import get_settings
    owner_phone = get_settings().owner_phone_number
    if owner_phone:
        msg = (
            f"📚 *New Course Booking!*\n\n"
            f"👤 Name: {data.name}\n"
            f"📱 Phone: {data.phone}\n"
            f"✉️ Email: {data.email}\n"
            f"📖 Course ID: {data.course_id}\n\n"
            f"_Submitted via WhatsApp_"
        )
        try:
            wa_svc.send_text_message(to=owner_phone, body=msg)
        except Exception as e:
            logger.error(f"Failed to notify owner: {e}")
    
    return {
        "screen": "SUCCESS",
        "data": {
            "status_message": f"Success {data.name}! You have booked the course. Our team will contact you for access details."
        }
    }
