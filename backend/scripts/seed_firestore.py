#!/usr/bin/env python3
"""
scripts/seed_firestore.py — Seed test hotels into Firestore

Usage:
    python scripts/seed_firestore.py

Seeds 6 realistic hotels across Jodhpur, Jaipur, and Mumbai.
All hotels use the Cloudinary cloud name from your .env.
"""
import json
import os
import sys

from dotenv import load_dotenv

load_dotenv()

# ── Inline Firebase init ───────────────────────────────────────────────────────
import firebase_admin
from firebase_admin import credentials, firestore

SA_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "keys/firebase_service_account.json")
SA_JSON = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "")

if SA_JSON:
    cred = credentials.Certificate(json.loads(SA_JSON))
elif os.path.exists(SA_PATH):
    cred = credentials.Certificate(SA_PATH)
else:
    print(f"ERROR: Firebase credentials not found at {SA_PATH}")
    sys.exit(1)

firebase_admin.initialize_app(cred)
db = firestore.client()

TENANT_ID = os.getenv("TENANT_ID", "tenant_xxx")
CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "dtb20vpvg")
BASE_IMG = f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/v1"

HOTELS = [
    {
        "name": "Radisson Hotel Jodhpur",
        "city": "Jodhpur",
        "city_lower": "jodhpur",
        "state": "Rajasthan",
        "description": "Experience royal hospitality at the heart of the Blue City. The Radisson Jodhpur blends Rajasthani heritage with modern luxury, featuring stunning views of the Mehrangarh Fort.",
        "amenities": "Swimming Pool, Spa, WiFi, Rooftop Restaurant, Airport Shuttle, Room Service",
        "price_per_night": 5135,
        "rating": 5,
        "available": True,
        "image": f"{BASE_IMG}/hotels/radisson_jodhpur.jpg",
        "images": [],
        "tenant_id": TENANT_ID,
    },
    {
        "name": "Ajit Bhawan Palace",
        "city": "Jodhpur",
        "city_lower": "jodhpur",
        "state": "Rajasthan",
        "description": "India's first heritage hotel, Ajit Bhawan is a royal palace transformed into a luxury resort. Wander through tented cottages, lush gardens, and authentic Rajasthani decor.",
        "amenities": "Heritage Pool, Camel Safari, WiFi, Spa, Multi-cuisine Restaurant, Cultural Shows",
        "price_per_night": 7800,
        "rating": 5,
        "available": True,
        "image": f"{BASE_IMG}/hotels/ajit_bhawan.jpg",
        "images": [],
        "tenant_id": TENANT_ID,
    },
    {
        "name": "Fairmont Jaipur",
        "city": "Jaipur",
        "city_lower": "jaipur",
        "state": "Rajasthan",
        "description": "The Fairmont Jaipur is an architectural masterpiece inspired by Rajput and Mughal styles. Enjoy opulent rooms, world-class dining, and a sprawling pool in the Pink City.",
        "amenities": "3 Pools, Willow Stream Spa, 5 Restaurants, WiFi, Business Centre, Kids Club",
        "price_per_night": 11200,
        "rating": 5,
        "available": True,
        "image": f"{BASE_IMG}/hotels/fairmont_jaipur.jpg",
        "images": [],
        "tenant_id": TENANT_ID,
    },
    {
        "name": "Samode Haveli",
        "city": "Jaipur",
        "city_lower": "jaipur",
        "state": "Rajasthan",
        "description": "A 200-year-old haveli nestled in the walled city of Jaipur. Hand-painted frescoes, courtyards, and rooftop dining create an unforgettable Rajasthani experience.",
        "amenities": "Courtyard Pool, Spa, WiFi, Heritage Restaurant, Rooftop Terrace, Library",
        "price_per_night": 8900,
        "rating": 4,
        "available": True,
        "image": f"{BASE_IMG}/hotels/samode_haveli.jpg",
        "images": [],
        "tenant_id": TENANT_ID,
    },
    {
        "name": "The Taj Mahal Palace Mumbai",
        "city": "Mumbai",
        "city_lower": "mumbai",
        "state": "Maharashtra",
        "description": "A symbol of India's grand heritage overlooking the Gateway of India and the Arabian Sea. The Taj Mahal Palace Mumbai combines Moorish, Oriental, and Florentine architecture.",
        "amenities": "Sea View, Multiple Pools, 10+ Restaurants, Jiva Spa, WiFi, Butler Service",
        "price_per_night": 22000,
        "rating": 5,
        "available": True,
        "image": f"{BASE_IMG}/hotels/taj_mahal_mumbai.jpg",
        "images": [],
        "tenant_id": TENANT_ID,
    },
    {
        "name": "ITC Grand Central Mumbai",
        "city": "Mumbai",
        "city_lower": "mumbai",
        "state": "Maharashtra",
        "description": "Set in the heart of Parel, ITC Grand Central is a towering luxury hotel offering world-class amenities, award-winning dining, and seamless access to Mumbai's business district.",
        "amenities": "Rooftop Pool, Kaya Kalp Spa, WiFi, 4 Restaurants, Business Centre, Fitness Centre",
        "price_per_night": 12500,
        "rating": 5,
        "available": True,
        "image": f"{BASE_IMG}/hotels/itc_grand_central.jpg",
        "images": [],
        "tenant_id": TENANT_ID,
    },
]


def main():
    collection = db.collection("hotels")
    print(f"Seeding {len(HOTELS)} hotels into Firestore (tenant_id={TENANT_ID})...")

    for hotel in HOTELS:
        doc_ref = collection.add(hotel)
        print(f"  ✅ Added: {hotel['name']} [{doc_ref[1].id}]")

    print(f"\n✅ Done! {len(HOTELS)} hotels seeded successfully.")
    print("Run your app and test the flow.")


if __name__ == "__main__":
    main()
