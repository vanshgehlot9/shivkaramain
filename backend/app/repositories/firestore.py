"""
app/repositories/firestore.py — Firestore data access layer
"""
from __future__ import annotations

import logging
from functools import lru_cache
from typing import Any

import firebase_admin
from firebase_admin import credentials, firestore

from app.config import get_settings

logger = logging.getLogger(__name__)

_db: Any = None  # google.cloud.firestore.Client


def init_firestore() -> None:
    """Initialise Firebase Admin SDK. Safe to call multiple times."""
    global _db
    if firebase_admin._DEFAULT_APP_NAME in firebase_admin._apps:
        _db = firestore.client()
        return

    settings = get_settings()
    cred_dict = settings.firebase_credentials
    if cred_dict is None:
        raise RuntimeError(
            "No Firebase credentials found. "
            "Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in .env"
        )

    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)
    _db = firestore.client()
    logger.info("Firestore initialised successfully.")


def _get_db():
    global _db
    if _db is None:
        init_firestore()
    return _db
