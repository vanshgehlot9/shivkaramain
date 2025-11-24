const fs = require('fs');
const path = require('path');

console.log('\n🔥 Firebase Admin Credentials Checker\n');
console.log('=====================================\n');

// Check for service account file
const serviceAccountPath = path.join(__dirname, 'service-account.json');
const envPath = path.join(__dirname, '.env.local');

let hasServiceAccount = false;
let hasEnvCredentials = false;

// Check service account file
if (fs.existsSync(serviceAccountPath)) {
    try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        if (serviceAccount.type === 'service_account' && serviceAccount.project_id && serviceAccount.private_key) {
            console.log('✅ Valid service-account.json found');
            console.log(`   Project ID: ${serviceAccount.project_id}`);
            console.log(`   Client Email: ${serviceAccount.client_email}`);
            hasServiceAccount = true;
        } else {
            console.log('❌ service-account.json exists but appears invalid');
        }
    } catch (error) {
        console.log('❌ service-account.json exists but cannot be parsed:', error.message);
    }
} else {
    console.log('❌ service-account.json not found');
}

console.log('');

// Check .env.local
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');

    if (envContent.includes('FIREBASE_ADMIN_CREDENTIALS=')) {
        console.log('✅ FIREBASE_ADMIN_CREDENTIALS found in .env.local');
        hasEnvCredentials = true;

        // Try to decode and validate
        try {
            const match = envContent.match(/FIREBASE_ADMIN_CREDENTIALS=(.+)/);
            if (match && match[1]) {
                const decoded = Buffer.from(match[1].trim(), 'base64').toString();
                const serviceAccount = JSON.parse(decoded);
                console.log(`   Project ID: ${serviceAccount.project_id}`);
                console.log(`   Client Email: ${serviceAccount.client_email}`);
            }
        } catch (error) {
            console.log('   ⚠️  Warning: Could not decode/parse credentials');
            hasEnvCredentials = false;
        }
    } else if (envContent.includes('FIREBASE_SERVICE_ACCOUNT_KEY=')) {
        console.log('✅ FIREBASE_SERVICE_ACCOUNT_KEY found in .env.local');
        hasEnvCredentials = true;
    } else {
        console.log('❌ No Firebase Admin credentials in .env.local');
    }
} else {
    console.log('❌ .env.local not found');
}

console.log('\n=====================================\n');

// Provide guidance
if (hasServiceAccount && !hasEnvCredentials) {
    console.log('📋 Next step: Run the setup script to configure .env.local');
    console.log('   ./setup-firebase-admin.sh\n');
} else if (!hasServiceAccount && !hasEnvCredentials) {
    console.log('📋 Next steps:');
    console.log('   1. Download your service account key from Firebase Console');
    console.log('   2. Save it as service-account.json in this directory');
    console.log('   3. Run: ./setup-firebase-admin.sh\n');
    console.log('   See FIREBASE_ADMIN_SETUP.md for detailed instructions\n');
} else if (hasEnvCredentials) {
    console.log('✅ Firebase Admin is configured!');
    console.log('   Restart your dev server if you haven\'t already:\n');
    console.log('   npm run dev\n');
}
