# 🏨 WhatsApp Hotel Booking Bot v2.0

> **Production-ready WhatsApp Flow backend for hotel booking with dynamic Firestore data, Razorpay payments, and Cloudinary images.**

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

---

## 🛠️ Stack
- **FastAPI** ⚡ — Python backend
- **Firebase Firestore** 🔥 — Hotel & booking database
- **WhatsApp Flows API** 💬 — Flow JSON v7.3 / Data API v3.0
- **Razorpay** 💳 — Payment links
- **Cloudinary** 🖼️ — Hotel images
- **ngrok** 🚇 — Local HTTPS tunnel for testing

---

## 📁 Project Structure

```text
hotelbot/
├── app/
│   ├── main.py                  # 🚀 FastAPI entry point
│   ├── config.py                # ⚙️ Settings via pydantic-settings
│   ├── flows/
│   │   ├── crypto.py            # 🔐 RSA+AES-GCM encrypt/decrypt
│   │   ├── engine.py            # 🔀 Screen routing logic
│   │   ├── router.py            # 📍 /webhook/flow endpoint
│   │   └── schemas.py           # 📄 Pydantic payload models
│   ├── repositories/
│   │   ├── firestore.py         # 🗄️ Hotel queries
│   │   └── booking.py           # 💾 Booking persistence
│   ├── services/
│   │   ├── razorpay.py          # 💸 Payment link generation
│   │   ├── whatsapp.py          # ✉️ Cloud API messaging
│   │   └── cloudinary_svc.py   # 🌐 URL validation
│   └── webhooks/
│       └── razorpay_webhook.py  # 🎣 Payment event handler
├── flow_json/
│   └── hotel_booking_flow.json  # 📜 WhatsApp Flow JSON v7.3
├── scripts/
│   ├── upload_flow.py           # 📤 Upload Flow JSON to Meta
│   ├── whitelist_domains.py     # 🌍 Whitelist Cloudinary domain
│   └── seed_firestore.py        # 🌱 Seed test hotel data
├── keys/                        # 🔑 RSA private key + Firebase SA (git-ignored)
├── .env                         # 🔐 Your credentials
└── requirements.txt             # 📦 Python dependencies
```

---

## 🚀 Quick Start

### 1️⃣ Place credentials in `keys/`
```bash
# RSA private key (from Meta Flow editor → Keys tab)
cp /path/to/your/private.pem keys/private.pem

# Firebase service account JSON (from Firebase Console → Project Settings → Service Accounts)
cp /path/to/firebase_service_account.json keys/firebase_service_account.json
```

### 2️⃣ Update `.env`
```bash
# Edit .env and fill in any missing values:
# - FLOW_PRIVATE_KEY_PATH=keys/private.pem
# - FIREBASE_SERVICE_ACCOUNT_PATH=keys/firebase_service_account.json
# - TENANT_ID=your_tenant_id
# - RAZORPAY_CALLBACK_URL=https://YOUR_NGROK_URL/webhook/razorpay/callback
# - RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 3️⃣ Install dependencies
```bash
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4️⃣ Seed test hotels (first time only)
```bash
python scripts/seed_firestore.py
```

### 5️⃣ Start the server
```bash
uvicorn app.main:app --reload --port 8000
```

### 6️⃣ Expose locally with ngrok
```bash
ngrok http 8000
# Copy the HTTPS URL, e.g.: https://xxxx.ngrok-free.app
```

### 7️⃣ Update Meta Flow endpoint
In Meta Flow editor:
- **Endpoint URI**: `https://xxxx.ngrok-free.app/webhook/flow`
- Save and test

### 8️⃣ Upload Flow JSON
```bash
python scripts/upload_flow.py
```

### 9️⃣ Whitelist Cloudinary (one-time)
```bash
# Add WABA_ID to .env first (WhatsApp Business Account ID)
python scripts/whitelist_domains.py
```

### 🔟 Publish to production
```bash
PUBLISH=true python scripts/upload_flow.py
```

---

## 🏗️ Flow Architecture

```mermaid
flowchart LR
    A([🏙️ CITY_SELECT]) --> B([🏨 HOTEL_LIST])
    B --> C([🔍 HOTEL_DETAIL])
    C --> D([📅 DATE_SELECTION])
    D --> E([📝 GUEST_FORM])
    E --> F([💳 PAYMENT_METHOD])
    F --> G([🧾 BOOKING_SUMMARY])
    G --> H([✅ SUCCESS])
    
    style A fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style H fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
```

> **Note:** All transitions use `data_exchange` — your backend controls all data at every step.

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
|---|:---:|---|
| `/` | `GET` | Health check |
| `/health` | `GET` | Health check |
| `/webhook/flow` | `POST` | WhatsApp Flows `data_exchange` |
| `/webhook/razorpay` | `POST` | Razorpay payment events |
| `/webhook/razorpay/callback` | `GET` | Post-payment redirect page |

---

## 🔐 How Encryption Works

### 🔓 Request (decrypt):
1. **RSA-OAEP-SHA256** decrypt `encrypted_aes_key` → **AES-256 key**
2. **AES-GCM** decrypt `encrypted_flow_data` using `initial_vector`

### 🔒 Response (encrypt):
1. **Invert IV bits**: `inverted_iv = bytes([b ^ 0xFF for b in iv])`
2. **AES-GCM** encrypt JSON response with same AES key + inverted IV
3. **Return base64-encoded ciphertext** as plain text

---

## 🗄️ Firestore Schema

### `hotels` collection
```json
{
  "name": "Radisson Hotel Jodhpur",
  "city": "Jodhpur",
  "city_lower": "jodhpur",
  "state": "Rajasthan",
  "description": "...",
  "amenities": "Pool, Spa, WiFi",
  "price_per_night": 5135,
  "rating": 5,
  "available": true,
  "image": "https://res.cloudinary.com/...",
  "tenant_id": "tenant_xxx"
}
```

### `bookings` collection
```json
{
  "booking_id": "BK1A2B3C4D",
  "status": "pending|confirmed|failed",
  "payment_status": "unpaid|paid|expired|cancelled",
  "guest_name": "...",
  "guest_email": "...",
  "guest_phone": "...",
  "hotel_id": "...",
  "hotel_name": "...",
  "city": "...",
  "check_in_date": "2025-06-10",
  "check_out_date": "2025-06-13",
  "num_nights": 3,
  "num_guests": 2,
  "payment_method": "online|hotel",
  "total_amount_inr": 15405,
  "razorpay_payment_link_id": "...",
  "razorpay_payment_url": "..."
}
```

---

## 🛠️ Troubleshooting

| Issue | Fix |
|---|---|
| 🐛 `${data.xyz}` shows as raw text | Backend is not returning that field in the screen response |
| 🖼️ Images not rendering | Run `whitelist_domains.py`, use only `https://res.cloudinary.com/...` URLs |
| ⛔ HTTP 421 response | Private key mismatch — re-upload public key to Meta or check PEM file |
| ❌ Flow validation errors | Run `upload_flow.py` and fix listed errors |
| 💸 Payment link "amount blank" | Ensure `hotel_price_raw` is forwarded as `int` through all screens |
