"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type UserRole = "user" | "editor" | null;

export function useUserRole() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || "user");
          } else {
            // User document doesn't exist in Firestore yet
            setUserRole("user");
          }
        } catch (error) {
          console.error("Error getting user role:", error);
          setUserRole("user"); // Default to user role on error
        }
      } else {
        setUserRole(null);
        setUserId(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { userRole, isLoading, userId };
}
