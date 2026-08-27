"""
scripts/test_approval_msg.py — Live test script to send check-in greeting and interactive buttons
"""
import os
import sys

# Add project root to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

from app.services import whatsapp as wa_svc

def send_test_greeting():
    # The last active user phone number from the session logs
    test_phone = "919521699090"
    guest_name = "Vansh Gehlot"
    hotel_name = "Jee Ri Haveli"
    final_room_name = "Standard Room (Room 101)"
    digital_key_placeholder = f"🔑 *Digital Key: SECURE_KEY_8473*"
    
    print(f"Sending check-in approval greeting text message to {test_phone}...")
    
    # 1. Send the text greeting message
    wa_svc.send_text_message(
        test_phone,
        f"🎉 *Check-in Approved! Welcome to {hotel_name}!* 🏨\n\n"
        f"Hi {guest_name}, your Aadhaar identity has been verified by our team. "
        f"Your check-in is complete, and your room (*{final_room_name}*) is ready for you! 🛎️\n\n"
        f"🔑 *Your Room Digital Key is Active:*\n"
        f"👉 `{digital_key_placeholder}`\n\n"
        f"_Simply tap this key on your room door sensor or present this code at reception to unlock._\n\n"
        f"Have a spectacular stay! 💖"
    )
    
    print(f"Sending interactive quick-action services buttons to {test_phone}...")
    
    # 2. Send the interactive buttons message
    buttons = [
        {"id": "menu", "title": "🍽️ Order Food"},
        {"id": "room service", "title": "🛎️ Room Service"}
    ]
    wa_svc.send_interactive_buttons_message(
        to=test_phone,
        body_text=f"How can we help you get settled, {guest_name}? Choose an option below to explore our menus and in-room services!",
        buttons=buttons,
        header_text="🏨 Lobby Services Menu",
        footer_text="Select a service to start instantly"
    )
    
    print("✨ Successfully completed sending both check-in approval testing messages!")

if __name__ == "__main__":
    send_test_greeting()
