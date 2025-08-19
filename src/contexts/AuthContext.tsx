"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

// User interface
export interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

// Authentication context interface
interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;
    signup: (
        name: string,
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Auth provider component
interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state on app load
    useEffect(() => {
        initializeAuth();
    }, []);

    // Initialize authentication (check for existing session)
    const initializeAuth = async () => {
        try {
            // Try to refresh token on app load
            const success = await refreshToken();
            if (!success) {
                // If refresh fails, user is not authenticated
                setUser(null);
                setAccessToken(null);
            }
        } catch (error) {
            console.error("Auth initialization error:", error);
            setUser(null);
            setAccessToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Set user and token in state
                setUser(data.user);
                setAccessToken(data.accessToken);

                console.log("Login successful:", data.user.email);
                return { success: true };
            } else {
                return { success: false, error: data.error || "Login failed" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: "Network error. Please try again.",
            };
        }
    };

    // Signup function
    const signup = async (name: string, email: string, password: string) => {
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Set user and token in state
                setUser(data.user);
                setAccessToken(data.accessToken);

                console.log("Signup successful:", data.user.email);
                return { success: true };
            } else {
                return { success: false, error: data.error || "Signup failed" };
            }
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: "Network error. Please try again.",
            };
        }
    };

    // Refresh token function
    const refreshToken = async (): Promise<boolean> => {
        try {
            const response = await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include", // Include cookies
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setUser(data.user);
                setAccessToken(data.accessToken);
                console.log("Token refreshed for:", data.user.email);
                return true;
            } else {
                // Refresh failed - user needs to login again
                setUser(null);
                setAccessToken(null);
                return false;
            }
        } catch (error) {
            console.error("Token refresh error:", error);
            setUser(null);
            setAccessToken(null);
            return false;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            console.log("User logged out");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Always clear local state, even if API call fails
            setUser(null);
            setAccessToken(null);
        }
    };

    // Auto-refresh token setup
    useEffect(() => {
        if (!accessToken) return;

        // Set up automatic token refresh (refresh 1 minute before expiry)
        // Access tokens last 15 minutes, so refresh after 14 minutes
        const refreshInterval = setInterval(() => {
            refreshToken();
        }, 14 * 60 * 1000); // 14 minutes

        return () => clearInterval(refreshInterval);
    }, [accessToken]);

    const value: AuthContextType = {
        user,
        accessToken,
        isLoading,
        login,
        signup,
        logout,
        refreshToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
