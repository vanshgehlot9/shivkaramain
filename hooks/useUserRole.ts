import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      
      try {
        if (user) {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'user');
          } else {
            // Default to user role if not specified
            setUserRole('user');
          }
        } else {
          setUserRole(null);
          // Redirect to login page if needed
          // window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setError("Failed to fetch user permissions");
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, []);
  
  return { userRole, isLoading, error };
};
