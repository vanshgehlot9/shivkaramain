"""
app/flows/crypto.py — RSA+AES-GCM encryption/decryption for WhatsApp Flows
Data API version 3.0

Decrypt request:
  1. Base64-decode encrypted_aes_key → RSA-OAEP-SHA256 decrypt → raw AES-256 key
  2. Base64-decode initial_vector + encrypted_flow_data
  3. AES-GCM decrypt (last 16 bytes of ciphertext are the auth tag) → JSON bytes

Encrypt response:
  1. Invert all bits of original IV  (iv_byte ^ 0xFF)
  2. AES-GCM encrypt response JSON with same AES key + inverted IV
  3. Base64-encode (ciphertext + tag) → return as plain text
"""
from __future__ import annotations

import json
import logging
from base64 import b64decode, b64encode

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding as asym_padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

logger = logging.getLogger(__name__)


class FlowCrypto:
    def __init__(self, private_key_pem: bytes, passphrase: bytes | None = None):
        self._private_key = serialization.load_pem_private_key(
            private_key_pem,
            password=passphrase,
        )

    # ─── Public API ──────────────────────────────────────────────────────────

    def decrypt_request(self, body: dict) -> dict:
        """
        Decrypt an incoming WhatsApp Flows request body.

        Expected body keys:
          encrypted_aes_key  – base64-encoded RSA-encrypted AES key
          encrypted_flow_data – base64-encoded AES-GCM ciphertext + tag
          initial_vector      – base64-encoded 12-byte IV

        Returns the decrypted payload as a Python dict plus the raw aes_key
        and iv bytes (needed later for encrypting the response).
        """
        encrypted_aes_key = b64decode(body["encrypted_aes_key"])
        encrypted_flow_data = b64decode(body["encrypted_flow_data"])
        iv = b64decode(body["initial_vector"])

        # Step 1: RSA-OAEP-SHA256 decrypt the AES key
        aes_key = self._private_key.decrypt(
            encrypted_aes_key,
            asym_padding.OAEP(
                mgf=asym_padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None,
            ),
        )

        # Step 2: AES-GCM decrypt (cryptography lib expects tag appended)
        aesgcm = AESGCM(aes_key)
        decrypted_bytes = aesgcm.decrypt(iv, encrypted_flow_data, None)

        payload = json.loads(decrypted_bytes.decode("utf-8"))
        logger.debug("Decrypted Flow payload: %s", payload)

        # Stash crypto material on the payload for use in encrypt_response
        payload["_aes_key"] = aes_key
        payload["_iv"] = iv
        return payload

    @staticmethod
    def encrypt_response(response_dict: dict, aes_key: bytes, iv: bytes) -> str:
        """
        Encrypt the response dict and return a base64 string (plain text body).

        The response IV is the bitwise inverse of the request IV.
        """
        inverted_iv = bytes([b ^ 0xFF for b in iv])
        response_bytes = json.dumps(response_dict, ensure_ascii=False).encode("utf-8")

        aesgcm = AESGCM(aes_key)
        encrypted = aesgcm.encrypt(inverted_iv, response_bytes, None)  # tag appended

        return b64encode(encrypted).decode("utf-8")
