import sys
import os
from dotenv import load_dotenv

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.whatsapp import send_flow_cta_message

def main():
    load_dotenv()
    
    phone_number = input("Enter your phone number (with country code, e.g., 91XXXXXXXXXX): ").strip()
    if not phone_number:
        print("Phone number is required.")
        return
        
    print(f"Sending test WhatsApp Flow to {phone_number}...")
    try:
        send_flow_cta_message(phone_number, "Tester")
        print("✅ Test message sent! Check your WhatsApp.")
    except Exception as e:
        print(f"❌ Failed to send message: {e}")

if __name__ == "__main__":
    main()
