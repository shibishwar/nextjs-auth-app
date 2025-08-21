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

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { signup, user } = useAuth();
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

        // Client-side validation
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long!");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signup(name.trim(), email.trim(), password);

            if (result.success) {
                // AuthContext will handle the redirect via useEffect
                console.log("Signup successful!");
            } else {
                setError(result.error || "Signup failed");
            }
        } catch (error) {
            setError("An unexpected error occurred");
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render signup form if user is already authenticated
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
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-3">
                        Sign up to get started with your account
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
                                htmlFor="name"
                                className="text-sm font-medium text-gray-300"
                            >
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isLoading}
                                minLength={2}
                                maxLength={50}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
                            />
                        </div>
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
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                minLength={6}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
                            />
                            <p className="text-xs text-gray-500">
                                Must be at least 6 characters long
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-gray-300"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Creating Account..."
                                : "Create Account"}
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                    <div className="mt-3 text-center">
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
