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


@router.post("/send-whatsapp")
async def send_whatsapp_certificate(req: SendCertificateRequest):
    """
    Sends a certificate or student ID hosted on Cloudinary to the user's WhatsApp.
    """
    try:
        import re
        mobile = req.phone_number.strip()
        
        # Basic validation
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
                
        # Send text message and then the document or image
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
        
        return {"success": True, "message": "WhatsApp message sent successfully."}
        
    except Exception as e:
        logger.exception("Failed to send WhatsApp message")
        raise HTTPException(status_code=500, detail=str(e))
