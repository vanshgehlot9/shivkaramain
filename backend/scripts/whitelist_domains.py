#!/usr/bin/env python3
"""
scripts/whitelist_domains.py — Whitelist Cloudinary domain for Meta WhatsApp Business

Resolves: Images from res.cloudinary.com not rendering in WhatsApp Flow iframes.

Usage:
    python scripts/whitelist_domains.py

Requires:
  - ACCESS_TOKEN in .env
  - WABA_ID (WhatsApp Business Account ID) — add to .env if not present
"""
import json
import os
import sys

import httpx
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
WABA_ID = os.getenv("WABA_ID")  # Your WhatsApp Business Account ID
GRAPH_API_VERSION = "v20.0"

DOMAINS_TO_WHITELIST = [
    "https://res.cloudinary.com",
]


def main():
    if not ACCESS_TOKEN:
        print("ERROR: ACCESS_TOKEN must be set in .env")
        sys.exit(1)

    if not WABA_ID:
        print("ERROR: WABA_ID (WhatsApp Business Account ID) not set in .env")
        print("Find it in: Meta Business Suite → Settings → Business Info")
        sys.exit(1)

    print(f"Whitelisting domains for WABA: {WABA_ID}")
    print(f"Domains: {DOMAINS_TO_WHITELIST}")

    url = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{WABA_ID}/whitelisted_domains"
    payload = {"whitelisted_domains": DOMAINS_TO_WHITELIST}

    with httpx.Client(timeout=30) as client:
        resp = client.post(
            url,
            headers={
                "Authorization": f"Bearer {ACCESS_TOKEN}",
                "Content-Type": "application/json",
            },
            json=payload,
        )

    print(f"\nStatus: {resp.status_code}")
    result = resp.json()
    print(json.dumps(result, indent=2))

    if resp.status_code == 200 and result.get("success"):
        print("\n✅ Cloudinary domain whitelisted successfully!")
        print("WhatsApp Flow images from res.cloudinary.com will now render correctly.")
    else:
        print("\n❌ Whitelisting failed. Check the error above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
