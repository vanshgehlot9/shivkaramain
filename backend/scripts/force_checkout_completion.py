"""
scripts/force_checkout_completion.py — Force complete checkout payment loop for active booking
"""
import os
import sys

# Add project root to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

from app.repositories.firestore import _get_db
from app.webhooks.razorpay_webhook import _handle_payment_paid

def force_complete():
    test_phone = "919521699090"
    db = _get_db()
    
    print("🔍 Searching for active booking with checkout awaiting_payment status...")
    bookings = db.collection("bookings")\
        .where("guest_phone", "==", test_phone)\
        .where("checkout_state", "==", "awaiting_payment")\
        .stream()
        
    found = False
    for b_doc in bookings:
        b_data = b_doc.to_dict()
        b_id = b_data.get("booking_id")
        print(f"✅ Found Booking {b_id} awaiting payment! Simulating payment success...")
        
        import asyncio
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
        loop.run_until_complete(asyncio.sleep(0.5)) # Give it a brief pause
        _handle_payment_paid(b_id, "pay_SqThytrZGd8Ccw")
        found = True
        print(f"✨ Smart Checkout successfully triggered and completed for Booking {b_id}!")
        break
        
    if not found:
        print("❌ No bookings found in 'awaiting_payment' state. Let's look for any active checked-in booking to complete instead.")
        active_b = db.collection("bookings")\
            .where("guest_phone", "==", test_phone)\
            .where("status", "==", "checked-in")\
            .stream()
        for b_doc in active_b:
            b_data = b_doc.to_dict()
            b_id = b_data.get("booking_id")
            # Force it to awaiting_payment state
            db.collection("bookings").document(b_id).update({
                "checkout_state": "awaiting_payment"
            })
            print(f"🔄 Reset Booking {b_id} state to awaiting_payment. Now completing...")
            _handle_payment_paid(b_id, "pay_SqThytrZGd8Ccw")
            found = True
            break
            
    if not found:
        print("❌ No bookings found at all for the number!")

if __name__ == "__main__":
    force_complete()
