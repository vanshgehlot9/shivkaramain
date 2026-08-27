"""
app/flows/router.py — FastAPI router for the WhatsApp Flows endpoint
"""
from __future__ import annotations

import json
import logging

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import PlainTextResponse

from app.config import get_settings
from app.flows.crypto import FlowCrypto
from app.flows.engine import route
from app.flows.schemas import FlowRequest

logger = logging.getLogger(__name__)

router = APIRouter()

_crypto: FlowCrypto | None = None


def _get_crypto() -> FlowCrypto:
    global _crypto
    if _crypto is None:
        s = get_settings()
        _crypto = FlowCrypto(
            private_key_pem=s.private_key_bytes,
            passphrase=s.private_key_passphrase_bytes,
        )
    return _crypto


# ─── Health check ─────────────────────────────────────────────────────────────

@router.get("/health")
async def health():
    return {"status": "ok", "service": "shivkara-digital-bot"}


# ─── WhatsApp Flow endpoint ───────────────────────────────────────────────────

@router.post("/webhook/flow")
async def flow_webhook(request: Request):
    """
    Primary endpoint for WhatsApp Flows data_exchange.

    Meta sends an encrypted JSON body. We:
      1. Decrypt the request
      2. Route to the correct screen handler
      3. Encrypt the response
      4. Return plain-text base64 ciphertext
    """
    raw_body = await request.body()

    # ── Parse encrypted body ──────────────────────────────────────────────────
    try:
        body = json.loads(raw_body)
    except Exception:
        logger.error("Failed to parse request body as JSON")
        raise HTTPException(status_code=400, detail="Invalid JSON")

    # ── Handle unencrypted health-check ping from Meta ────────────────────────
    if body.get("action") == "ping" and "encrypted_aes_key" not in body:
        logger.info("Received unencrypted ping")
        return {"data": {"status": "active"}}

    # ── Decrypt ───────────────────────────────────────────────────────────────
    try:
        crypto = _get_crypto()
        decrypted = crypto.decrypt_request(body)
    except Exception as exc:
        logger.exception("Decryption failed: %s", exc)
        # HTTP 421 signals WhatsApp to re-fetch the public key and retry
        return Response(status_code=421, content="Decryption failed")

    # Extract crypto material before passing payload to engine
    aes_key: bytes = decrypted.pop("_aes_key")
    iv: bytes = decrypted.pop("_iv")

    # ── Build FlowRequest ─────────────────────────────────────────────────────
    try:
        flow_request = FlowRequest(
            version=str(decrypted.get("version", "3.0")),
            action=decrypted.get("action", ""),
            screen=decrypted.get("screen"),
            data=decrypted.get("data", {}),
            flow_token=decrypted.get("flow_token"),
        )
    except Exception as exc:
        logger.exception("FlowRequest parse error: %s", exc)
        raise HTTPException(status_code=422, detail=str(exc))

    # ── Route to engine ───────────────────────────────────────────────────────
    try:
        response_dict = await route(flow_request, flow_token=decrypted.get("flow_token", ""))
    except Exception as exc:
        logger.exception("Engine error: %s", exc)
        # Return a generic error screen rather than crashing
        response_dict = {
            "screen": "CITY_SELECT",
            "data": {
                "error_message": "Something went wrong. Please try again.",
                "city_options": [
                    {"id": c.lower(), "title": c}
                    for c in get_settings().cities_list
                ],
            },
        }

    # ── Encrypt response ──────────────────────────────────────────────────────
    try:
        encrypted_response = FlowCrypto.encrypt_response(response_dict, aes_key, iv)
    except Exception as exc:
        logger.exception("Response encryption failed: %s", exc)
        return Response(status_code=500, content="Encryption error")

    logger.info("Responding to screen=%s with screen=%s",
                flow_request.screen, response_dict.get("screen"))

    return PlainTextResponse(content=encrypted_response)
