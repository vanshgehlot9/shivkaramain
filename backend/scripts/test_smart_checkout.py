"""
scripts/test_smart_checkout.py — Rich checkout and review integration tester
"""
import os
import sys
import uuid
from datetime import datetime, timezone

# Add project root to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

from app.repositories.firestore import _get_db
from app.services.checkout_service import trigger_guest_checkout

def run_test():
    test_phone = "919521699090"
    db = _get_db()
    
    print("🧹 Cleaning up old active bookings/sessions for test number...")
    old_bookings = db.collection("bookings")\
        .where("guest_phone", "==", test_phone)\
        .where("status", "==", "checked-in")\
        .stream()
    for ob in old_bookings:
        db.collection("bookings").document(ob.id).update({"status": "cancelled"})
        
    db.collection("checkin_sessions").document(test_phone).delete()
    
    print("🏨 Creating a rich checkout mock booking document...")
    booking_id = f"BK_{uuid.uuid4().hex[:6].upper()}"
    mock_booking = {
        "booking_id": booking_id,
        "guest_name": "Vansh Gehlot",
        "guest_phone": test_phone,
        "guest_email": "vanshgehlot@gmail.com",
        "hotel_id": "hotel_BK01",
        "hotel_name": "Jee Ri Haveli",
        "allocated_room_id": "101",
        "allocated_room_name": "Standard Room",
        "status": "checked-in",
        "payment_status": "unpaid",
        "total_amount_inr": 2500,
        "check_in_date": "2026-05-17",
        "check_out_date": "2026-05-18",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    db.collection("bookings").document(booking_id).set(mock_booking)
    
    print("🍛 Attaching dynanmic food/room service bills charged to room...")
    order_id = f"ORD_{booking_id[-4:]}_test"
    mock_order = {
        "id": order_id,
        "booking_id": booking_id,
        "hotel_id": "hotel_BK01",
        "guest_name": "Vansh Gehlot",
        "room_number": "Standard Room",
        "items": ["Paneer Tikka x1", "Butter Naan x2", "Mango Lassi x1"],
        "total_price": 450,
        "payment_method": "charge_to_room",
        "payment_status": "pending",
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db.collection("food_orders").document(order_id).set(mock_order)
    
    print(f"🚀 Triggering Smart Checkout for booking {booking_id}...")
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    loop.run_until_complete(trigger_guest_checkout(test_phone, mock_booking))
    print("✨ Live Checkout process launched successfully! Please check your WhatsApp!")

if __name__ == "__main__":
    run_test()
