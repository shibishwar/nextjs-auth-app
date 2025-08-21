"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { login, user } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await login(email, password);

            if (result.success) {
                // AuthContext will handle the redirect via useEffect
                console.log("Login successful!");
            } else {
                setError(result.error || "Login failed");
            }
        } catch (error) {
            setError("An unexpected error occurred");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render login form if user is already authenticated
    if (user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                    <CardContent className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                        <span className="ml-2 text-white">Redirecting...</span>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                <CardHeader className="text-center px-6 pt-8 pb-6">
                    <CardTitle className="text-3xl font-bold text-white drop-shadow">
                        Login
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-3">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-300"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-300"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                minLength={6}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                        <p className="text-sm font-medium text-white mb-2">
                            Demo Accounts:
                        </p>
                        <div className="text-xs text-gray-300">
                            <div>
                                <strong className="text-emerald-400">
                                    Admin:
                                </strong>{" "}
                                admin@example.com / admin123
                            </div>
                            <div>
                                <strong className="text-cyan-400">User:</strong>{" "}
                                test@example.com / password123
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                    <div className="mt-2 text-center">
                        <Link
                            href="/"
                            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
                        >
                            Back to home
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
