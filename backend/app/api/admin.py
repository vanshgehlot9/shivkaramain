"""
app/api/admin.py — Admin API endpoints for Shivkara Digital
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

from app.services import whatsapp as wa_svc

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin"])


class SendCertificateRequest(BaseModel):
    phone_number: str
    certificate_url: str
    certificate_title: str = "Shivkara Digital Certificate"
    certificate_image_url: str = None
    recipient_name: str = ""


class SendIntroRequest(BaseModel):
    """Send a service introduction template to a new user."""
    phone_number: str
    recipient_name: str = ""


@router.post("/send-whatsapp")
async def send_whatsapp_certificate(req: SendCertificateRequest):
    """
    Sends a certificate to a user's WhatsApp.

    Smart delivery strategy:
      1. Check if user messaged us within the last 24 hours (free-form window).
         - YES → send free-form (always works, no template needed, avoids 131049).
         - NO  → send via template (only option outside 24hr window).
      2. If template fails, fall back to free-form as last resort.
    """
    try:
        import re
        from datetime import datetime, timezone, timedelta

        mobile = req.phone_number.strip()

        if not mobile:
            raise HTTPException(status_code=400, detail="Phone number is required")

        # Format the phone number (assuming India code if 10 digits)
        clean_mobile = re.sub(r'[\s\-\(\)]', '', mobile)
        if clean_mobile.startswith('+'):
            formatted_mobile = re.sub(r'\D', '', clean_mobile)
        else:
            formatted_mobile = re.sub(r'\D', '', clean_mobile)
            if len(formatted_mobile) == 10:
                formatted_mobile = "91" + formatted_mobile

        # ── Check if user is inside the 24hr free-form window ────────────────
        is_in_24hr_window = False
        try:
            from app.repositories.firestore import _get_db
            db = _get_db()
            conv_doc = db.collection("whatsapp_conversations").document(formatted_mobile).get()
            if conv_doc.exists:
                last_msg = conv_doc.to_dict().get("last_message_at", "")
                if last_msg:
                    last_msg_time = datetime.fromisoformat(last_msg)
                    hours_ago = (datetime.now(timezone.utc) - last_msg_time).total_seconds() / 3600
                    is_in_24hr_window = hours_ago < 23  # Use 23hrs for safety margin
                    logger.info(
                        "User %s last messaged %.1f hours ago — %s 24hr window",
                        formatted_mobile, hours_ago,
                        "INSIDE" if is_in_24hr_window else "OUTSIDE"
                    )
        except Exception as db_err:
            logger.warning("Could not check 24hr window: %s", db_err)

        # ── Strategy A: User is INSIDE 24hr window → send free-form directly ─
        #    This is the most reliable method. No template needed, no 131049 risk.
        if is_in_24hr_window:
            logger.info("Sending certificate to %s via FREE-FORM (inside 24hr window)", formatted_mobile)
            return _send_freeform_certificate(formatted_mobile, req)

        # ── Strategy B: User is OUTSIDE 24hr window → must use template ───────
        #    Template is the ONLY way to reach users outside the 24hr window.
        if req.certificate_image_url:
            logger.info("Sending certificate to %s via TEMPLATE (outside 24hr window)", formatted_mobile)
            try:
                wa_svc.send_template_message(
                    to=formatted_mobile,
                    template_name="certificate",
                    body_parameters=[req.certificate_title],
                    header_image_url=req.certificate_image_url,
                )
                return {"success": True, "message": "Certificate sent via template.", "method": "template"}
            except Exception as tmpl_err:
                logger.warning("Template send failed: %s — trying free-form as last resort", tmpl_err)

        # ── Last resort: try free-form anyway (will fail if outside 24hr) ─────
        logger.info("Attempting free-form as last resort for %s", formatted_mobile)
        return _send_freeform_certificate(formatted_mobile, req)

    except Exception as e:
        logger.exception("Failed to send WhatsApp message")
        raise HTTPException(status_code=500, detail=str(e))


def _send_freeform_certificate(formatted_mobile: str, req: SendCertificateRequest) -> dict:
    """Send certificate using free-form messages (text + image/document)."""
    text_body = (
        f"🎉 *Congratulations on your great achievement!* 🎉\n\n"
        f"We are thrilled to present you with your *{req.certificate_title}*.\n\n"
        f"⚠️ *Note:* Our website is currently undergoing maintenance, so we have not included a verification link at this time. If you require a verification link, please fill out our contact us form and include the comment 'link required'.\n\n"
        f"💬 For any assistance, just type *hii* in this chat.\n\n"
        f"🤝 *In Partnership With:*\n"
        f"• Aatomate (https://aatomate.com/)\n"
        f"• Awaraj (https://awaraj.com/)\n\n"
        f"Best Regards,\n*Shivkara Digital Team*"
    )

    wa_svc.send_text_message(to=formatted_mobile, body=text_body)

    if req.certificate_image_url:
        wa_svc.send_image_message(
            to=formatted_mobile,
            image_url=req.certificate_image_url,
            caption="Your Certificate"
        )
    else:
        wa_svc.send_document_message(
            to=formatted_mobile,
            document_url=req.certificate_url,
            filename=f"{req.certificate_title}.pdf",
            caption="Your Certificate"
        )

    return {"success": True, "message": "WhatsApp message sent (free-form).", "method": "free_form"}


@router.post("/send-intro")
async def send_service_introduction(req: SendIntroRequest):
    """
    Send a service introduction template to a new user who has never interacted.

    This uses a pre-approved template message, which is the ONLY way to
    message users outside the 24-hour conversation window.

    Requires a template named 'service_introduction' to be approved in
    Meta Business Manager.
    """
    try:
        import re
        mobile = req.phone_number.strip()

        if not mobile:
            raise HTTPException(status_code=400, detail="Phone number is required")

        clean_mobile = re.sub(r'[\s\-\(\)]', '', mobile)
        if clean_mobile.startswith('+'):
            formatted_mobile = re.sub(r'\D', '', clean_mobile)
        else:
            formatted_mobile = re.sub(r'\D', '', clean_mobile)
            if len(formatted_mobile) == 10:
                formatted_mobile = "91" + formatted_mobile

        name = req.recipient_name or "there"

        wa_svc.send_template_message(
            to=formatted_mobile,
            template_name="service_introduction",
            body_parameters=[name],
        )

        return {"success": True, "message": f"Introduction template sent to {formatted_mobile}"}

    except Exception as e:
        logger.exception("Failed to send intro template")
        raise HTTPException(status_code=500, detail=str(e))

