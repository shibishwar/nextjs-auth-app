"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.refresh();
    };

    // Show loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                    <CardContent className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                        <span className="ml-2 text-white">Loading...</span>
                    </CardContent>
                </Card>
            </main>
        );
    }

    // Show authenticated user content
    if (user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                    <CardHeader className="text-center px-6 pt-8 pb-6">
                        <CardTitle className="text-3xl font-bold text-white drop-shadow">
                            Welcome back!
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-3">
                            Hello, {user.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-8">
                        <div className="flex flex-col gap-6">
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                                <p className="text-sm text-gray-300 mb-2">
                                    <strong className="text-white">
                                        Email:
                                    </strong>{" "}
                                    {user.email}
                                </p>
                                <p className="text-sm text-gray-300">
                                    <strong className="text-white">
                                        Role:
                                    </strong>{" "}
                                    {user.role}
                                </p>
                            </div>

                            {user.role === "admin" && (
                                <Link href="/admin" className="block w-full">
                                    <Button className="w-full py-4 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 hover:from-purple-600 hover:via-violet-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer">
                                        Go to Admin Dashboard
                                    </Button>
                                </Link>
                            )}

                            <Button
                                onClick={handleLogout}
                                className="w-full py-4 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 hover:from-red-600 hover:via-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    // Show guest content
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                <CardHeader className="text-center px-6 pt-8 pb-6">
                    <CardTitle className="text-3xl font-bold text-white drop-shadow">
                        Welcome to AuthApp
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-3">
                        A secure authentication system built with Next.js
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-6 pb-8">
                    <div className="flex flex-col items-center gap-6">
                        <Link href="/login" className="block w-full">
                            <Button
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
                                size="lg"
                            >
                                Login
                            </Button>
                        </Link>

                        <div className="text-center text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                Create new account
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
