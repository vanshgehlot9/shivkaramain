#!/bin/bash

echo "🔥 Firebase Admin Setup Script"
echo "================================"
echo ""

# Check if service account file exists
if [ ! -f "service-account.json" ]; then
  echo "❌ service-account.json not found!"
  echo ""
  echo "📋 To get your service account key:"
  echo "   1. Go to https://console.firebase.google.com/"
  echo "   2. Select your project"
  echo "   3. Click the gear icon ⚙️ > Project settings"
  echo "   4. Go to 'Service accounts' tab"
  echo "   5. Click 'Generate new private key'"
  echo "   6. Save the file as 'service-account.json' in this directory"
  echo ""
  exit 1
fi

echo "✅ Found service-account.json"
echo ""

# Encode the service account to base64
echo "🔐 Encoding service account to base64..."
ENCODED=$(base64 -i service-account.json | tr -d '\n')

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "📝 Creating .env.local file..."
  touch .env.local
fi

# Remove old FIREBASE_ADMIN_CREDENTIALS if exists
if grep -q "FIREBASE_ADMIN_CREDENTIALS=" .env.local; then
  echo "🔄 Updating existing FIREBASE_ADMIN_CREDENTIALS..."
  # For macOS sed
  sed -i '' '/FIREBASE_ADMIN_CREDENTIALS=/d' .env.local
else
  echo "➕ Adding FIREBASE_ADMIN_CREDENTIALS..."
fi

# Add the new credentials
echo "FIREBASE_ADMIN_CREDENTIALS=$ENCODED" >> .env.local

echo ""
echo "✅ Firebase Admin credentials configured successfully!"
echo ""
echo "🔒 Security reminder:"
echo "   - service-account.json is already in .gitignore"
echo "   - .env.local is already in .gitignore"
echo "   - Never commit these files to version control!"
echo ""
echo "🚀 Next steps:"
echo "   1. Restart your development server: npm run dev"
echo "   2. Your Firebase Admin SDK should now work correctly"
echo ""
