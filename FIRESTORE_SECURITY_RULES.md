# Firestore Security Rules for Shivkara Admin Dashboard

## Deploy these rules to your Firebase Console

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users with admin/owner/finance roles to access expenses
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null;
      // Future: Add role-based checking
      // allow read, write: if request.auth != null && 
      //   getUserRole(request.auth.uid) in ['admin', 'owner', 'finance'];
    }
    
    // Allow authenticated users with admin/owner roles to access orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
      // Future: Add role-based checking
      // allow read, write: if request.auth != null && 
      //   getUserRole(request.auth.uid) in ['admin', 'owner'];
    }
    
    // Allow authenticated users with admin/owner/finance roles to access invoices/billing
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null;
      // Future: Add role-based checking
      // allow read, write: if request.auth != null && 
      //   getUserRole(request.auth.uid) in ['admin', 'owner', 'finance'];
    }
    
    // Allow authenticated users to access analytics data (read-only for most)
    match /analytics/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      // Future: Add role-based checking
      // allow write: if request.auth != null && 
      //   getUserRole(request.auth.uid) in ['admin', 'owner'];
    }
    
    // Allow authenticated users to read/write leads
    match /leads/{leadId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read website content
    match /website/{docId} {
      allow read: if true; // Public read access for website content
      allow write: if request.auth != null;
      // Future: Add role-based checking for website editing
    }
    
    // Helper function to get user role (implement when user roles are properly set up)
    // function getUserRole(userId) {
    //   return get(/databases/$(database)/documents/users/$(userId)).data.role;
    // }
    
    // Catch-all rule for testing (REMOVE IN PRODUCTION)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## How to Deploy:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Navigate to Firestore Database** → **Rules**
4. **Replace the existing rules** with the rules above
5. **Click "Publish"**

## Important Notes:

- **Temporary Access**: Currently all authenticated users have full access to test the modules
- **Production Security**: Before going live, implement proper role-based access control
- **User Roles**: Set up user documents with role fields (admin, owner, finance, etc.)
- **Testing**: Test each module after deploying these rules

## Role-Based Access Setup (Future):

1. Create user documents in Firestore with this structure:
```javascript
// Document: /users/{userId}
{
  "email": "user@example.com",
  "role": "admin", // or "owner", "finance", "user"
  "permissions": ["expenses", "orders", "billing", "analytics"],
  "createdAt": timestamp,
  "lastLogin": timestamp
}
```

2. Update the security rules to use the commented role-based functions above

## Testing the Rules:

After deploying, test each module:
- ✅ Expenses Module
- ✅ Orders Module  
- ✅ Billing Module
- ✅ Analytics Module

All should work without permission errors.
