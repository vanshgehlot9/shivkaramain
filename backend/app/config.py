"""
app/config.py — Centralised settings loaded from .env
"""
from __future__ import annotations

import json
import os
from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── WhatsApp Cloud API ────────────────────────────────────────────────────
    access_token: str
    phone_number_id: str
    verify_token: str = "12345"

    # ── WhatsApp Flow ─────────────────────────────────────────────────────────
    whatsapp_flow_id: str
    whatsapp_flow_mode: str = "published"
    whatsapp_flow_main_menu_id: str = "main_menu"
    whatsapp_flow_internship_id: str = "internship"
    whatsapp_flow_course_id: str = "course"
    flow_private_key_path: str = "keys/private.pem"
    flow_private_key_passphrase: str = ""

    # ── Firebase ──────────────────────────────────────────────────────────────
    firebase_service_account_path: str = ""
    firebase_service_account_json: str = ""
    tenant_id: str = "tenant_xxx"
    
    # ── Notifications ─────────────────────────────────────────────────────────
    owner_phone_number: str = ""



    # ── App ───────────────────────────────────────────────────────────────────
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    log_level: str = "INFO"
    available_cities: str = "Jodhpur,Jaipur,Mumbai,Delhi,Goa,Udaipur"
    
    # ── Auth ──────────────────────────────────────────────────────────────────
    secret_key: str = "dev-secret-key-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 43200

    # ── Derived helpers ───────────────────────────────────────────────────────
    @property
    def cities_list(self) -> List[str]:
        return [c.strip() for c in self.available_cities.split(",") if c.strip()]

    @property
    def firebase_credentials(self) -> dict | None:
        """Return parsed service account dict from path or inline JSON."""
        if self.firebase_service_account_path and os.path.exists(
            self.firebase_service_account_path
        ):
            with open(self.firebase_service_account_path) as f:
                return json.load(f)
        if self.firebase_service_account_json:
            return json.loads(self.firebase_service_account_json)
        return None

    @property
    def private_key_bytes(self) -> bytes:
        with open(self.flow_private_key_path, "rb") as f:
            return f.read()

    @property
    def private_key_passphrase_bytes(self) -> bytes | None:
        if self.flow_private_key_passphrase:
            return self.flow_private_key_passphrase.encode()
        return None


@lru_cache
def get_settings() -> Settings:
    return Settings()
