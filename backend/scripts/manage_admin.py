#!/usr/bin/env python3
import sys
import os

# Align python path to project root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.repositories.firestore import _get_db
from app.core.security import get_password_hash

def print_banner():
    print("=" * 60)
    print("        AETHER HOSPITALITY PLATFORM - ADMIN ACCOUNT MANAGER       ")
    print("=" * 60)

def list_users(db):
    print("\n--- Current Active Accounts in Firestore ---")
    users = list(db.collection("users").stream())
    if not users:
        print("No accounts found in 'users' collection.")
        return
    for i, u in enumerate(users, 1):
        data = u.to_dict()
        role = data.get("role", "user")
        hotel = data.get("hotel_id", "Platform-wide")
        print(f"{i}. Email: {u.id:<30} | Role: {role:<12} | Hotel ID: {hotel}")

def main():
    print_banner()
    db = _get_db()
    
    while True:
        list_users(db)
        print("\nWhat would you like to do?")
        print("1. Reset/Change an existing account's password")
        print("2. Create a brand new admin/owner account")
        print("3. Exit")
        
        choice = input("\nEnter choice (1-3): ").strip()
        
        if choice == "3":
            print("\nExiting. Have a great day!")
            break
            
        elif choice == "1":
            email = input("\nEnter the email address of the account to reset: ").strip().lower()
            user_ref = db.collection("users").document(email)
            if not user_ref.get().exists:
                print(f"Error: Account with email '{email}' does not exist.")
                continue
                
            new_password = input("Enter new password: ").strip()
            if len(new_password) < 4:
                print("Error: Password must be at least 4 characters long.")
                continue
                
            hashed = get_password_hash(new_password)
            user_ref.update({"hashed_password": hashed})
            print(f"\nSuccess! Password for '{email}' has been updated to: {new_password}")
            
        elif choice == "2":
            email = input("\nEnter email for the new account: ").strip().lower()
            if not email or "@" not in email:
                print("Error: Invalid email address format.")
                continue
                
            user_ref = db.collection("users").document(email)
            if user_ref.get().exists:
                print(f"Error: Account with email '{email}' already exists.")
                continue
                
            password = input("Enter password: ").strip()
            if len(password) < 4:
                print("Error: Password must be at least 4 characters long.")
                continue
                
            print("\nSelect Role:")
            print("1. superadmin (Full platform control)")
            print("2. hotel_owner (Hotel dashboard control)")
            role_choice = input("Enter choice (1-2): ").strip()
            role = "superadmin" if role_choice == "1" else "hotel_owner"
            
            hotel_id = ""
            if role == "hotel_owner":
                hotel_id = input("Enter Hotel ID (leave blank for platform-wide): ").strip()
                
            hashed = get_password_hash(password)
            payload = {
                "email": email,
                "role": role,
                "tenant_id": "platform",
                "hashed_password": hashed
            }
            if hotel_id:
                payload["hotel_id"] = hotel_id
                
            user_ref.set(payload)
            print(f"\nSuccess! New account created:")
            print(f"  Email:    {email}")
            print(f"  Password: {password}")
            print(f"  Role:     {role}")
            
        else:
            print("Invalid choice. Please choose 1, 2, or 3.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nAborted. Exiting.")
