// Sample middleware.js for client websites
// Copy this file to your client's website root directory

import { NextResponse } from 'next/server';

const SUBSCRIPTION_API_URL = 'https://shivkaradigital.com/api/subscription/check';
const PAYMENT_REDIRECT_URL = 'https://shivkaradigital.com/payment';

// Configuration for this client site
const CLIENT_CONFIG = {
  domain: 'clientdomain.com', // Replace with actual client domain
  gracePeriod: 3, // Days of grace period after expiry
  allowedPaths: [
    '/maintenance',
    '/suspended',
    '/api/health',
    '/_next',
    '/favicon.ico',
    '/robots.txt'
  ], // Paths that bypass subscription check
  excludedPatterns: [
    /^\/api\/public/, // Public API endpoints
    /^\/images\//, // Static images
    /^\/css\//, // CSS files
    /^\/js\//, // JavaScript files
  ]
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip subscription check for allowed paths
  if (CLIENT_CONFIG.allowedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Skip subscription check for excluded patterns
  if (CLIENT_CONFIG.excludedPatterns.some(pattern => pattern.test(pathname))) {
    return NextResponse.next();
  }
  
  try {
    // Check subscription status
    const response = await fetch(`${SUBSCRIPTION_API_URL}?domain=${CLIENT_CONFIG.domain}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ClientSite-Middleware/1.0',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to check subscription status:', response.status);
      // On API failure, allow access to prevent site downtime
      return NextResponse.next();
    }
    
    const data = await response.json();
    
    if (data.isValid) {
      // Subscription is active, allow access
      return NextResponse.next();
    } else {
      // Subscription is not valid, redirect to payment page
      const redirectUrl = new URL(PAYMENT_REDIRECT_URL);
      redirectUrl.searchParams.set('domain', CLIENT_CONFIG.domain);
      redirectUrl.searchParams.set('reason', data.reason || 'expired');
      
      return NextResponse.redirect(redirectUrl);
    }
    
  } catch (error) {
    console.error('Subscription check error:', error);
    // On error, allow access to prevent site downtime
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Alternative version for client sites using different frameworks

// For Express.js sites:
/*
const express = require('express');
const axios = require('axios');

function subscriptionMiddleware(req, res, next) {
  const { path } = req;
  
  // Skip check for static files and allowed paths
  if (CLIENT_CONFIG.allowedPaths.some(allowedPath => path.startsWith(allowedPath))) {
    return next();
  }
  
  axios.get(`${SUBSCRIPTION_API_URL}?domain=${CLIENT_CONFIG.domain}`)
    .then(response => {
      if (response.data.isValid) {
        next();
      } else {
        res.redirect(`${PAYMENT_REDIRECT_URL}?domain=${CLIENT_CONFIG.domain}&reason=${response.data.reason}`);
      }
    })
    .catch(error => {
      console.error('Subscription check failed:', error);
      next(); // Allow access on error
    });
}

module.exports = subscriptionMiddleware;
*/

// For PHP sites:
/*
<?php
function checkSubscription() {
    $config = [
        'domain' => 'clientdomain.com',
        'subscriptionApiUrl' => 'https://shivkaradigital.com/api/subscription/check',
        'paymentRedirectUrl' => 'https://shivkaradigital.com/payment',
        'allowedPaths' => ['/maintenance', '/suspended', '/api/health'],
        'gracePeriod' => 3
    ];
    
    $currentPath = $_SERVER['REQUEST_URI'];
    
    // Skip check for allowed paths
    foreach ($config['allowedPaths'] as $allowedPath) {
        if (strpos($currentPath, $allowedPath) === 0) {
            return true;
        }
    }
    
    // Check subscription
    $url = $config['subscriptionApiUrl'] . '?domain=' . urlencode($config['domain']);
    $response = file_get_contents($url);
    
    if ($response === false) {
        // On API failure, allow access
        return true;
    }
    
    $data = json_decode($response, true);
    
    if ($data['isValid']) {
        return true;
    } else {
        // Redirect to payment page
        $redirectUrl = $config['paymentRedirectUrl'] . 
                      '?domain=' . urlencode($config['domain']) . 
                      '&reason=' . urlencode($data['reason'] ?? 'expired');
        
        header('Location: ' . $redirectUrl);
        exit();
    }
}

// Call this function at the beginning of your PHP pages
checkSubscription();
?>
*/
