#!/bin/bash

echo "🔥 Opening Firebase Console..."
echo ""
echo "Follow these steps:"
echo "1. Select your project"
echo "2. Click the gear icon ⚙️  → Project settings"
echo "3. Go to 'Service accounts' tab"
echo "4. Click 'Generate new private key'"
echo "5. Save the file as 'service-account.json' in your project directory"
echo ""

# Try to get the project ID from .env.local
if [ -f ".env.local" ]; then
  PROJECT_ID=$(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
  
  if [ ! -z "$PROJECT_ID" ]; then
    echo "📋 Your Firebase Project ID: $PROJECT_ID"
    echo ""
    # Open directly to the service accounts page
    open "https://console.firebase.google.com/project/$PROJECT_ID/settings/serviceaccounts/adminsdk"
  else
    # Open to Firebase Console home
    open "https://console.firebase.google.com/"
  fi
else
  open "https://console.firebase.google.com/"
fi

echo "✅ Browser opened. After downloading the key, run:"
echo "   ./setup-firebase-admin.sh"
echo ""
