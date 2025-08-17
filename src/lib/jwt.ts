import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("JWT secrets must be defined in environment variables");
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: "user" | "admin";
}

/**
 * Generate access token (short-lived, 15 minutes)
 * Stored in memory on client-side for API requests
 */
export function generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m", // 15 minutes
        issuer: "nextjs-auth-app",
        audience: "nextjs-auth-app-users",
    });
}

/**
 * Generate refresh token (long-lived, 7 days)
 * Stored in secure HTTP-only cookie
 */
export function generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d", // 7 days
        issuer: "nextjs-auth-app",
        audience: "nextjs-auth-app-users",
    });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET, {
            issuer: "nextjs-auth-app",
            audience: "nextjs-auth-app-users",
        });
        return decoded as JWTPayload;
    } catch (error) {
        console.error("Access token verification failed:", error);
        return null;
    }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET, {
            issuer: "nextjs-auth-app",
            audience: "nextjs-auth-app-users",
        });
        return decoded as JWTPayload;
    } catch (error) {
        console.error("Refresh token verification failed:", error);
        return null;
    }
}
