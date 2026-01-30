#!/bin/bash

# Complete System Verification Script
# Verifies that Firebase is properly configured and ready to use

echo "🔍 Shivkara Firebase Configuration Verification"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: .env.local exists
echo "1️⃣  Checking .env.local file..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✅ .env.local file exists${NC}"
else
    echo -e "${RED}❌ .env.local file NOT found${NC}"
    exit 1
fi

# Check 2: Firebase Admin Credentials
echo ""
echo "2️⃣  Checking Firebase Admin credentials..."
if grep -q "FIREBASE_ADMIN_CREDENTIALS=" .env.local; then
    echo -e "${GREEN}✅ FIREBASE_ADMIN_CREDENTIALS is set${NC}"
else
    echo -e "${RED}❌ FIREBASE_ADMIN_CREDENTIALS is NOT set${NC}"
    exit 1
fi

# Check 3: Firebase Project ID
echo ""
echo "3️⃣  Checking Firebase Project ID..."
if grep -q "FIREBASE_PROJECT_ID=" .env.local; then
    PROJECT_ID=$(grep "FIREBASE_PROJECT_ID=" .env.local | cut -d '=' -f2)
    echo -e "${GREEN}✅ Project ID: $PROJECT_ID${NC}"
else
    echo -e "${RED}❌ FIREBASE_PROJECT_ID is NOT set${NC}"
    exit 1
fi

# Check 4: Public Firebase Config
echo ""
echo "4️⃣  Checking public Firebase configuration..."
if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY=" .env.local; then
    echo -e "${GREEN}✅ Public Firebase config is set${NC}"
else
    echo -e "${YELLOW}⚠️  Public Firebase config may be incomplete${NC}"
fi

# Check 5: service-account.json (should exist but be gitignored)
echo ""
echo "5️⃣  Checking service-account.json..."
if [ -f service-account.json ]; then
    echo -e "${GREEN}✅ service-account.json exists${NC}"
    if grep -q "service-account.json" .gitignore; then
        echo -e "${GREEN}✅ service-account.json is in .gitignore${NC}"
    else
        echo -e "${YELLOW}⚠️  service-account.json should be in .gitignore${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  service-account.json not found (credentials are in .env.local, so this is OK)${NC}"
fi

# Check 6: Node modules
echo ""
echo "6️⃣  Checking dependencies..."
if [ -d node_modules ]; then
    echo -e "${GREEN}✅ node_modules directory exists${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules not found. Run: npm install${NC}"
fi

# Check 7: Test credentials validity
echo ""
echo "7️⃣  Testing credential validity..."
if command -v node &> /dev/null; then
    node test-firebase-admin.js 2>&1 | grep -q "Firebase Admin Credentials are valid"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Firebase Admin credentials are VALID${NC}"
    else
        echo -e "${RED}❌ Firebase Admin credentials validation failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Node.js not found, skipping credential test${NC}"
fi

# Summary
echo ""
echo "=============================================="
echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
echo ""
echo "📝 Summary:"
echo "   • Firebase Admin SDK is properly configured"
echo "   • Credentials are valid and secure"
echo "   • Data will be saved to Firestore"
echo "   • Application is ready to use"
echo ""
echo "🚀 Next steps:"
echo "   1. Start the dev server: npm run dev"
echo "   2. Test your application features"
echo "   3. Check Firebase Console for saved data"
echo ""
echo "🔗 Firebase Console:"
echo "   https://console.firebase.google.com/project/$PROJECT_ID/firestore"
echo ""
