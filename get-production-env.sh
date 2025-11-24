#!/bin/bash

# Script to display environment variables needed for production deployment
# This helps you copy the correct values to your hosting platform

echo "=================================================="
echo "🚀 Production Environment Variables"
echo "=================================================="
echo ""
echo "Copy these environment variables to your production hosting platform"
echo "(Vercel, Netlify, AWS, etc.)"
echo ""
echo "=================================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "   Please make sure you're in the project root directory."
    exit 1
fi

echo "📋 FIREBASE ADMIN CREDENTIALS:"
echo "---------------------------------------------------"

# Extract Firebase Admin Credentials
FIREBASE_ADMIN_CREDS=$(grep "^FIREBASE_ADMIN_CREDENTIALS=" .env.local | cut -d '=' -f2-)
if [ -n "$FIREBASE_ADMIN_CREDS" ]; then
    echo "FIREBASE_ADMIN_CREDENTIALS=$FIREBASE_ADMIN_CREDS"
else
    echo "⚠️  FIREBASE_ADMIN_CREDENTIALS not found in .env.local"
fi

echo ""
echo "📋 FIREBASE PROJECT CONFIGURATION:"
echo "---------------------------------------------------"

# Extract Firebase Project ID
FIREBASE_PROJECT_ID=$(grep "^FIREBASE_PROJECT_ID=" .env.local | cut -d '=' -f2-)
if [ -n "$FIREBASE_PROJECT_ID" ]; then
    echo "FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID"
else
    echo "⚠️  FIREBASE_PROJECT_ID not found"
fi

# Extract Firebase Database URL
FIREBASE_DB_URL=$(grep "^FIREBASE_DATABASE_URL=" .env.local | cut -d '=' -f2-)
if [ -n "$FIREBASE_DB_URL" ]; then
    echo "FIREBASE_DATABASE_URL=$FIREBASE_DB_URL"
else
    echo "⚠️  FIREBASE_DATABASE_URL not found"
fi

echo ""
echo "📋 CLIENT-SIDE FIREBASE CONFIGURATION:"
echo "---------------------------------------------------"

# Extract all NEXT_PUBLIC variables
grep "^NEXT_PUBLIC_FIREBASE" .env.local || echo "⚠️  No NEXT_PUBLIC_FIREBASE variables found"

echo ""
echo "=================================================="
echo "✅ Next Steps:"
echo "=================================================="
echo ""
echo "1. Copy the variables above"
echo "2. Go to your hosting platform's dashboard"
echo "3. Navigate to Environment Variables settings"
echo "4. Add each variable with its value"
echo "5. Redeploy your application"
echo ""
echo "For detailed instructions, see: PRODUCTION_DEPLOYMENT_FIX.md"
echo ""
echo "=================================================="
echo "🔍 To verify after deployment:"
echo "=================================================="
echo ""
echo "curl https://www.shivkaradigital.com/api/admin/health"
echo ""
echo "You should see: \"status\": \"healthy\""
echo ""
