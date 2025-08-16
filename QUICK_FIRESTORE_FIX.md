# 🔥 TEMPORARY FIRESTORE RULES FOR DEVELOPMENT TESTING

## ⚠️ IMPORTANT: Use these rules ONLY for development/testing!

Copy these rules to your Firebase Console:

### Option 1: Allow All Access (For Testing Only)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Option 2: Allow Authenticated Users Only
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Option 3: Specific Collection Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Expenses collection
    match /expenses/{expenseId} {
      allow read, write: if true;
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if true;
    }
    
    // Invoices collection
    match /invoices/{invoiceId} {
      allow read, write: if true;
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if true;
    }
    
    // Allow all other documents
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 🚀 How to Deploy These Rules:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Click "Firestore Database"** in the left sidebar
4. **Click "Rules"** tab
5. **Replace all existing rules** with Option 1 above
6. **Click "Publish"**
7. **Test your admin dashboard**

## 🧪 Test After Deployment:

1. Open http://localhost:3001/admin
2. Try adding expenses, orders, or invoices
3. Should work without any permission errors

## 🔒 For Production Later:

Replace with proper role-based rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check user role
    function hasRole(role) {
      return request.auth != null && 
             resource.data.role == role ||
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // Expenses: Admin, Owner, Finance only
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && 
        (hasRole('admin') || hasRole('owner') || hasRole('finance'));
    }
    
    // Orders: Admin, Owner only
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (hasRole('admin') || hasRole('owner'));
    }
    
    // Invoices: Admin, Owner, Finance only
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && 
        (hasRole('admin') || hasRole('owner') || hasRole('finance'));
    }
  }
}
```

## ⚡ Quick Fix Right Now:

**Use Option 1 (Allow All) for immediate testing - this will fix the permission error instantly!**
