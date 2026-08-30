"""
app/webhooks/whatsapp_webhook.py — Callback router for WhatsApp Cloud API

Handles: Lead Gen · Internships · Courses · Certificate Delivery
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, Request, Query, Response, HTTPException

from app.config import get_settings
from app.services import whatsapp as wa_svc

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/webhook/whatsapp", tags=["webhooks"])


@router.get("")
async def verify_webhook(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge"),
):
    """Standard WhatsApp webhook verification endpoint."""
    settings = get_settings()
    if hub_mode == "subscribe" and hub_verify_token == settings.verify_token:
        logger.info("WhatsApp Webhook Verification Successful.")
        return Response(content=hub_challenge, media_type="text/plain")

    logger.warning("Verification failed: Token mismatch.")
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("")
async def handle_incoming_whatsapp_event(request: Request):
    """Main ingress for all user-initiated messages and events."""
    try:
        body = await request.json()
        logger.debug("Received WhatsApp event: %s", body)

        # ── Parse envelope ─────────────────────────────────────────────────────
        entry = body.get("entry", [])[0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})

        messages = value.get("messages", [])
        if not messages:
            # Status callback (delivered, read) — track & ignore
            statuses = value.get("statuses", [])
            if statuses:
                stat = statuses[0]
                status_id = stat.get("id")
                status_val = stat.get("status")
                if status_val == "failed":
                    logger.error("WhatsApp delivery FAILED: %s | Errors: %s", status_id, stat.get("errors"))
                else:
                    logger.info("Delivery callback: id=%s status=%s", status_id, status_val)
            return {"status": "ignored"}

        msg = messages[0]
        wa_id = msg.get("from")   # sender's phone number
        msg_type = msg.get("type")

        if not wa_id:
            return {"status": "no_sender"}

        logger.info("Incoming message from %s: type=%s", wa_id, msg_type)

        # ── Track last message time for 24hr window detection ───────────────
        db = _get_db_safe()
        if db:
            from datetime import datetime, timezone
            db.collection("whatsapp_conversations").document(wa_id).set({
                "last_message_at": datetime.now(timezone.utc).isoformat(),
                "wa_id": wa_id,
            }, merge=True)

        # ── Interactive messages ────────────────────────────────────────────────
        reply_id = ""
        text_body = ""

        if msg_type == "text":
            text_body = msg.get("text", {}).get("body", "")

        elif msg_type == "interactive":
            interactive = msg.get("interactive", {})
            int_type = interactive.get("type")

            if int_type == "nfm_reply":
                # Flow completion callback — ignore to prevent loops
                logger.info("Ignoring Flow completion nfm_reply")
                return {"status": "flow_completion_ignored"}

            elif int_type == "list_reply":
                list_reply = interactive.get("list_reply", {})
                reply_id = list_reply.get("id", "")
                logger.info("List reply: id=%s", reply_id)

            elif int_type == "button_reply":
                button_reply = interactive.get("button_reply", {})
                reply_id = button_reply.get("id", "")
                text_body = button_reply.get("title", "")
                logger.info("Button click: id=%s title=%s", reply_id, text_body)

                # ── Resolve profile name ────────────────────────────────────────
                profile_name = "Guest"
                contacts = value.get("contacts", [])
                if contacts and "profile" in contacts[0] and "name" in contacts[0]["profile"]:
                    profile_name = contacts[0]["profile"]["name"]

                # ── Handle Fallback Buttons ─────────────────────────────────────
                if reply_id in ["btn_internship", "btn_courses", "btn_contact"]:
                    logger.info("Fallback button clicked: %s", reply_id)
                    
                    category = {
                        "btn_internship": "Internship",
                        "btn_courses": "Course",
                        "btn_contact": "General Inquiry"
                    }.get(reply_id)
                    
                    # 0. Save context to Firestore so we remember it when they reply
                    db = _get_db_safe()
                    if db:
                        db.collection("whatsapp_sessions").document(wa_id).set({
                            "context": category,
                            "updated_at": __import__("datetime").datetime.utcnow().isoformat()
                        })
                    
                    # 1. Reply to user asking them to type their details
                    user_msg = (
                        f"Thank you for your interest in our {category}! 🚀\n\n"
                        f"Since we are currently upgrading our automated forms, please reply to this message with your:\n"
                        f"- Name\n"
                        f"- Email\n"
                        f"- What you are looking for\n\n"
                        f"Our team will get back to you immediately! ✨"
                    )
                    wa_svc.send_text_message(to=wa_id, body=user_msg)
                    
                    # 2. Notify Owner that someone showed interest
                    from app.config import get_settings
                    owner_phone = get_settings().owner_phone_number
                    if owner_phone:
                        owner_msg = (
                            f"🔔 *Interest Alert!*\n\n"
                            f"👤 Name: {profile_name}\n"
                            f"📱 Phone: {wa_id}\n"
                            f"🎯 Interested in: {category}\n\n"
                            f"_They have been asked to reply with their details._"
                        )
                        try:
                            wa_svc.send_text_message(to=owner_phone, body=owner_msg)
                        except Exception as e:
                            logger.error("Failed to notify owner: %s", e)
                            
                    return {"status": "fallback_button_handled"}

        # ── Handle Form-like Text Replies ───────────────────────────────────────
        if msg_type == "text" and text_body:
            # Simple heuristic: if they provide an email, line breaks, or a longer message
            if "@" in text_body or "\n" in text_body or len(text_body.split()) >= 3:
                logger.info("Detected form-like text reply from %s", wa_id)
                
                profile_name = "Guest"
                contacts = value.get("contacts", [])
                if contacts and "profile" in contacts[0] and "name" in contacts[0]["profile"]:
                    profile_name = contacts[0]["profile"]["name"]
                
                # 0. Get user context from Firestore
                context = "General Inquiry"
                db = _get_db_safe()
                if db:
                    session_doc = db.collection("whatsapp_sessions").document(wa_id).get()
                    if session_doc.exists:
                        context = session_doc.to_dict().get("context", "General Inquiry")
                
                # 1. Save to the correct Firestore collection so admin panel sees it
                from datetime import datetime, timezone
                timestamp = datetime.now(timezone.utc).isoformat()
                
                if db:
                    if context == "Internship":
                        record_id = f"WA_APP_{int(datetime.now().timestamp())}"
                        record = {
                            "id": record_id,
                            "name": profile_name,
                            "email": "",
                            "phone": wa_id,
                            "domain": "Via WhatsApp",
                            "timeline": "",
                            "collegeOrCompany": "",
                            "city": "",
                            "message": text_body,
                            "status": "pending",
                            "source": "whatsapp_bot",
                            "createdAt": timestamp,
                        }
                        # Parse email from text if present
                        import re
                        emails = re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', text_body)
                        if emails:
                            record["email"] = emails[0]
                        db.collection("internship_applications").document(record_id).set(record)
                        logger.info("Saved WhatsApp internship application: %s", record_id)
                        
                        # Notify Admin Dashboard via Socket.io
                        from app.core.socket import broadcast_new_internship_application
                        await broadcast_new_internship_application(record)
                        
                    elif context == "Course":
                        record_id = f"WA_CBK_{int(datetime.now().timestamp())}"
                        record = {
                            "id": record_id,
                            "name": profile_name,
                            "email": "",
                            "phone": wa_id,
                            "message": text_body,
                            "status": "pending",
                            "source": "whatsapp_bot",
                            "createdAt": timestamp,
                        }
                        import re
                        emails = re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', text_body)
                        if emails:
                            record["email"] = emails[0]
                        db.collection("course_bookings").document(record_id).set(record)
                        logger.info("Saved WhatsApp course booking: %s", record_id)
                        
                        # Notify Admin Dashboard via Socket.io
                        from app.core.socket import broadcast_new_course_booking
                        await broadcast_new_course_booking(record)
                        
                    else:
                        # General Inquiry / Contact Us → save as lead
                        record_id = f"WA_LEAD_{int(datetime.now().timestamp())}"
                        record = {
                            "id": record_id,
                            "name": profile_name,
                            "email": "",
                            "phone": wa_id,
                            "company": "",
                            "message": text_body,
                            "status": "new",
                            "source": "whatsapp_bot",
                            "createdAt": timestamp,
                        }
                        import re
                        emails = re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', text_body)
                        if emails:
                            record["email"] = emails[0]
                        db.collection("leads").document(record_id).set(record)
                        logger.info("Saved WhatsApp lead: %s", record_id)
                        
                        # Notify Admin Dashboard via Socket.io
                        from app.core.socket import broadcast_new_lead
                        await broadcast_new_lead(record)
                
                # 2. Reply to user
                user_msg = "Thank you! ✅ We have received your details. Our team will review them and get back to you shortly."
                wa_svc.send_text_message(to=wa_id, body=user_msg)
                
                # 3. Notify Owner
                from app.config import get_settings
                owner_phone = get_settings().owner_phone_number
                if owner_phone:
                    owner_msg = (
                        f"📝 *New {context} Lead (WhatsApp)*\n\n"
                        f"👤 User: {profile_name}\n"
                        f"📱 Phone: {wa_id}\n\n"
                        f"📄 *Details provided:*\n"
                        f"{text_body}"
                    )
                    try:
                        wa_svc.send_text_message(to=owner_phone, body=owner_msg)
                    except Exception as e:
                        logger.error("Failed to notify owner: %s", e)
                        
                # 4. Clear the context so they can start over later
                if db:
                    db.collection("whatsapp_sessions").document(wa_id).delete()
                        
                return {"status": "form_reply_handled"}

        # ── Fallback — show main services CTA ─────────────────────────────────
        if msg_type in ["text", "button", "interactive"]:
            logger.info("Sending main CTA to %s", wa_id)
            profile_name = "Guest"
            contacts = value.get("contacts", [])
            if contacts and "profile" in contacts[0] and "name" in contacts[0]["profile"]:
                profile_name = contacts[0]["profile"]["name"]
                logger.info("Profile: %s", profile_name)

            # Check if this user is registered as staff (kept as example, could be removed if unused)
            db = _get_db_safe()
            is_staff = False
            if db:
                # Find if any staff has this mobile number
                staff_query = db.collection("staff_users").where("mobile", "==", wa_id).limit(1).get()
                if staff_query:
                    is_staff = True
                    staff_data = staff_query[0].to_dict()
                    staff_name = staff_data.get("name", profile_name)
                    role = staff_data.get("role", "Admin")

            if is_staff:
                wa_svc.send_text_message(
                    to=wa_id, 
                    body=f"🟢 *{role} System Online*\n\nHi {staff_name},\nYou are registered as an admin for Shivkara Digital."
                )
            else:
                wa_svc.send_flow_cta_message(to=wa_id, profile_name=profile_name)

        return {"status": "processed"}

    except Exception as exc:
        logger.error("Webhook processing error: %s", exc, exc_info=True)
        # Always return 200 to Meta so they don't retry-spam
        return {"status": "error", "detail": str(exc)}


def _get_db_safe():
    """Lazily get Firestore client without crashing on init failure."""
    try:
        from app.repositories.firestore import _get_db
        return _get_db()
    except Exception:
        return None
