#!/usr/bin/env python3
"""
scripts/upload_flow.py — Upload / update the Flow JSON to Meta via Graph API

Usage:
    python scripts/upload_flow.py

This script:
  1. Reads the Flow JSON from flow_json/hotel_booking_flow.json
  2. Uploads it to Meta using the Graph API
  3. Prints validation results
  4. Optionally publishes (set PUBLISH=true env var)
"""
import json
import os
import sys
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
FLOW_ID = os.getenv("WHATSAPP_FLOW_ID")
FLOW_JSON_PATH = Path(__file__).parent.parent / "flow_json" / "hotel_booking_flow.json"
GRAPH_API_VERSION = "v20.0"


def main():
    if not ACCESS_TOKEN or not FLOW_ID:
        print("ERROR: ACCESS_TOKEN and WHATSAPP_FLOW_ID must be set in .env")
        sys.exit(1)

    flow_json = FLOW_JSON_PATH.read_text(encoding="utf-8")

    print(f"Uploading Flow JSON to Flow ID: {FLOW_ID}")

    # ── Upload assets ──────────────────────────────────────────────────────────
    url = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{FLOW_ID}/assets"
    with httpx.Client(timeout=30) as client:
        resp = client.post(
            url,
            headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
            files={
                "file": (
                    "flow.json",
                    flow_json.encode("utf-8"),
                    "application/json",
                )
            },
            data={"name": "flow.json", "asset_type": "FLOW_JSON"},
        )

    print(f"Upload status: {resp.status_code}")
    result = resp.json()
    print(json.dumps(result, indent=2))

    if resp.status_code not in (200, 201):
        print("Upload FAILED")
        sys.exit(1)

    # ── Validate ───────────────────────────────────────────────────────────────
    validation_errors = result.get("validation_errors", [])
    if validation_errors:
        print(f"\n⚠️  {len(validation_errors)} validation error(s):")
        for err in validation_errors:
            print(f"  - {err}")
        sys.exit(1)
    else:
        print("\n✅ Flow JSON validated successfully — 0 errors")

    # ── Optional publish ───────────────────────────────────────────────────────
    if os.getenv("PUBLISH", "").lower() == "true":
        print("\nPublishing flow...")
        pub_url = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{FLOW_ID}/publish"
        with httpx.Client(timeout=30) as client:
            pub_resp = client.post(
                pub_url,
                headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
            )
        print(f"Publish status: {pub_resp.status_code}")
        print(json.dumps(pub_resp.json(), indent=2))
        if pub_resp.status_code == 200:
            print("✅ Flow published successfully!")
        else:
            print("❌ Publish failed")
    else:
        print("\nTo publish, run:  PUBLISH=true python scripts/upload_flow.py")


if __name__ == "__main__":
    main()
