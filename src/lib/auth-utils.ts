import { adminApp } from "@/lib/firebase-admin-config";

export type UserRole = 'admin' | 'faculty' | 'student';

/**
 * Sets the role for a user via Custom Claims.
 * This must be called from a secure server-side context (API route or Server Action).
 */
export async function setUserRole(uid: string, role: UserRole) {
    if (!adminApp) throw new Error("Firebase Admin not initialized");

    try {
        const claims = {
            role,
            admin: role === 'admin' // Maintain backward compatibility for existing isAdmin() checks
        };

        await adminApp.auth().setCustomUserClaims(uid, claims);
        return { success: true };
    } catch (error) {
        console.error("Error setting user role:", error);
        return { success: false, error };
    }
}

/**
 * Verifies if the current user has the required role.
 * Useful for Server Actions or API Routes.
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
    if (!adminApp) return null;

    try {
        const userRecord = await adminApp.auth().getUser(uid);
        const role = userRecord.customClaims?.role as UserRole;

        // Fallback for existing admins who might created before this system
        if (!role && userRecord.customClaims?.admin === true) {
            return 'admin';
        }

        return role || 'student'; // Default to student
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
}

/**
 * Server-side check for Faculty access
 */
export async function isFaculty(uid: string): Promise<boolean> {
    const role = await getUserRole(uid);
    return role === 'faculty' || role === 'admin';
}

/**
 * Server-side check for Admin access
 */
export async function isAdmin(uid: string): Promise<boolean> {
    const role = await getUserRole(uid);
    return role === 'admin';
}
