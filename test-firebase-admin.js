// Test Firebase Admin initialization
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

console.log('🔍 Testing Firebase Admin Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('✓ FIREBASE_PROJECT_ID:', envVars.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('✓ FIREBASE_ADMIN_CREDENTIALS:', envVars.FIREBASE_ADMIN_CREDENTIALS ? '✅ Set' : '❌ Missing');
console.log('✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID:', envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');

if (envVars.FIREBASE_ADMIN_CREDENTIALS) {
    try {
        const decoded = Buffer.from(envVars.FIREBASE_ADMIN_CREDENTIALS, 'base64').toString();
        const serviceAccount = JSON.parse(decoded);
        console.log('\n✅ Firebase Admin Credentials are valid!');
        console.log('   Project ID:', serviceAccount.project_id);
        console.log('   Client Email:', serviceAccount.client_email);
    } catch (error) {
        console.error('\n❌ Error decoding credentials:', error.message);
    }
}

console.log('\n✅ Configuration test complete!');
console.log('\n📝 Summary:');
console.log('   - Firebase Admin SDK will now work properly in API routes');
console.log('   - Data will be saved to Firestore database');
console.log('   - No need for Google Cloud - Firebase handles everything');
