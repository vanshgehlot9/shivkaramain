"""
app/services/whatsapp.py — Meta WhatsApp Cloud API messaging helpers
"""
from __future__ import annotations

import logging

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)

_API_VERSION = "v21.0"


def _base_url() -> str:
    s = get_settings()
    return f"https://graph.facebook.com/{_API_VERSION}/{s.phone_number_id}/messages"


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {get_settings().access_token}",
        "Content-Type": "application/json",
    }


def send_text_message(to: str, body: str) -> None:
    """Send a plain text WhatsApp message."""
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": body},
    }
    _post(payload)

def send_image_message(to: str, image_url: str, caption: str = "") -> dict:
    """Send an image via WhatsApp using a public URL."""
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "image",
        "image": {
            "link": image_url,
        }
    }
    if caption:
        payload["image"]["caption"] = caption
    return _post(payload)


def send_document_message(to: str, document_url: str, filename: str = "document.pdf", caption: str = "") -> dict:
    """Send a document/PDF via WhatsApp using a public URL."""
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "document",
        "document": {
            "link": document_url,
            "filename": filename,
        }
    }
    if caption:
        payload["document"]["caption"] = caption
    return _post(payload)



def send_flow_cta_message(to: str, profile_name: str = "Guest") -> dict:
    """
    Sends the Shivkara Digital Main Menu.
    - If WHATSAPP_FLOW_MAIN_MENU_ID is configured, sends a WhatsApp Flow.
    - Otherwise, falls back to a simple 3-button interactive menu.
    """
    import base64
    import json

    settings = get_settings()
    flow_id = settings.whatsapp_flow_main_menu_id

    # ── Fallback: no Flow ID set — send simple interactive button menu ──────────
    if not flow_id or flow_id.strip() in ("", "main_menu"):
        logger.info("No WhatsApp Flow ID configured — sending button menu to %s", to)
        buttons = [
            {"id": "btn_internship", "title": "Internships 🎓"},
            {"id": "btn_courses", "title": "Courses 📚"},
            {"id": "btn_contact", "title": "Contact Us 📩"},
        ]
        body_text = (
            f"Welcome to *Shivkara Digital*! 🚀✨\n\n"
            f"Hi {profile_name}, how can we help you today?\n"
            f"Tap below to explore our services."
        )
        return send_interactive_buttons_message(
            to,
            body_text,
            buttons,
            header_text="Shivkara Digital 🚀",
            footer_text="Powered by Shivkara Digital"
        )

    # ── Flow message ─────────────────────────────────────────────────────────────
    logger.info("Sending Shivkara Digital Main Menu Flow to %s", to)
    state = {"p": to, "n": profile_name[:30]}
    encoded_state = base64.urlsafe_b64encode(json.dumps(state).encode()).decode().rstrip("=")
    flow_token = f"sd_{encoded_state}"

    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "interactive",
        "interactive": {
            "type": "flow",
            "header": {"type": "text", "text": "Shivkara Digital 🚀"},
            "body": {
                "text": f"Welcome to *Shivkara Digital*! ✨\n\nHi {profile_name}, how can we help you today? Tap below to explore our services."
            },
            "footer": {"text": "Powered by Shivkara Digital"},
            "action": {
                "name": "flow",
                "parameters": {
                    "flow_message_version": "3",
                    "flow_token": flow_token,
                    "flow_id": flow_id,
                    "flow_cta": "Open Menu 🌐",
                    "mode": settings.whatsapp_flow_mode,
                    "flow_action": "navigate",
                    "flow_action_payload": {"screen": "MAIN_MENU"}
                }
            }
        }
    }
    return _post(payload)



def send_location_message(to: str, latitude: float, longitude: float, name: str, address: str) -> dict:
    """
    Sends a native WhatsApp Interactive Map / Location pin card.
    """
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "location",
        "location": {
            "latitude": str(latitude),
            "longitude": str(longitude),
            "name": name,
            "address": address
        }
    }
    return _post(payload)


def send_interactive_buttons_message(to: str, body_text: str, buttons: list[dict], header_text: str = "", footer_text: str = "") -> dict:
    """
    Send a native WhatsApp Interactive message containing up to 3 quick-reply buttons.
    Each button in the buttons list should have: {"id": "btn_id", "title": "Button Title"}
    """
    action_buttons = []
    for btn in buttons[:3]:  # Meta strictly caps buttons at 3
        action_buttons.append({
            "type": "reply",
            "reply": {
                "id": btn["id"],
                "title": btn["title"][:20]  # Title limit is 20 chars
            }
        })
    
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {"text": body_text},
            "action": {"buttons": action_buttons}
        }
    }
    
    if header_text:
        payload["interactive"]["header"] = {"type": "text", "text": header_text[:60]}
    if footer_text:
        payload["interactive"]["footer"] = {"text": footer_text[:60]}
        
    return _post(payload)


def send_interactive_list_message(
    to: str, 
    body_text: str, 
    button_label: str, 
    sections: list[dict], 
    header_text: str = "", 
    footer_text: str = ""
) -> dict:
    """
    Send a native WhatsApp Interactive List message with options grouped in sections.
    Each section is: {"title": "Section Title", "rows": [{"id": "row_id", "title": "Row Title", "description": "Optional Desc"}]}
    """
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "body": {"text": body_text},
            "action": {
                "button": button_label[:20],
                "sections": sections
            }
        }
    }
    
    if header_text:
        payload["interactive"]["header"] = {"type": "text", "text": header_text[:60]}
    if footer_text:
        payload["interactive"]["footer"] = {"text": footer_text[:60]}
        
    return _post(payload)





# ─── Internal ─────────────────────────────────────────────────────────────────

def _post(payload: dict) -> dict:
    with httpx.Client(timeout=10) as client:
        resp = client.post(_base_url(), headers=_headers(), json=payload)
    if resp.status_code not in (200, 201):
        logger.error(
            "WhatsApp API error: status=%s body=%s", resp.status_code, resp.text
        )
        resp.raise_for_status()
    data = resp.json()
    logger.debug("WhatsApp API response: %s", data)
    return data


def download_whatsapp_media(media_id: str) -> bytes:
    """Download raw media bytes from Meta Graph API using media_id."""
    s = get_settings()
    headers = {
        "Authorization": f"Bearer {s.access_token}"
    }
    
    # Step 1: Get media URL
    url_endpoint = f"https://graph.facebook.com/{_API_VERSION}/{media_id}"
    logger.info("Retrieving WhatsApp media URL from endpoint: %s", url_endpoint)
    
    with httpx.Client() as client:
        resp = client.get(url_endpoint, headers=headers)
        if resp.status_code != 200:
            logger.error("Failed to retrieve media URL. Status: %s Body: %s", resp.status_code, resp.text)
            raise RuntimeError(f"Failed to get media details for ID {media_id}")
            
        media_info = resp.json()
        download_url = media_info.get("url")
        if not download_url:
            raise RuntimeError("Media details response missing download URL")
            
        logger.info("Downloading raw media bytes from Lookaside URL: %s", download_url)
        
        # Step 2: Download raw bytes using authorization
        dl_resp = client.get(download_url, headers=headers)
        if dl_resp.status_code != 200:
            logger.error("Failed to download media bytes. Status: %s", dl_resp.status_code)
            raise RuntimeError("Failed to download media bytes from Meta servers")
            
        return dl_resp.content



