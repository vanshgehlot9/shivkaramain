import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase (assuming backend/.env provides path or it's run in backend context)
import os
import json

cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "../shivkara-digitals-firebase-adminsdk-fbsvc-5b82eb06e7.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

leads_ref = db.collection("leads")
# We want to delete leads that came from the website internship form
# or have domain/timeline fields which indicates they are internships, not generic leads.
query = leads_ref.where("source", "==", "website_internship_2026").stream()

count = 0
for doc in query:
    print(f"Deleting duplicate internship lead: {doc.id} ({doc.to_dict().get('name')})")
    doc.reference.delete()
    count += 1

print(f"Deleted {count} records successfully.")
