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

export default function AdminPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    // Show loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                    <CardContent className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                        <span className="ml-2 text-white">Loading...</span>
                    </CardContent>
                </Card>
            </main>
        );
    }

    // Show access denied
    if (user && user.role !== "admin") {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                    <CardHeader className="text-center px-6 pt-8 pb-6">
                        <CardTitle className="text-3xl font-bold text-red-400 drop-shadow">
                            Access Denied
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-3">
                            You don't have permission to access this page
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-8">
                        <Link href="/" className="block w-full">
                            <Button className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer">
                                Go Home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        );
    }

    // Show login required
    if (!user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                    <CardHeader className="text-center px-6 pt-8 pb-6">
                        <CardTitle className="text-3xl font-bold text-white drop-shadow">
                            Please Login
                        </CardTitle>
                        <CardDescription className="text-gray-300 mt-3">
                            You need to login to access the admin dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-8">
                        <div className="flex flex-col gap-4">
                            <Link href="/login" className="block w-full">
                                <Button className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/" className="block w-full">
                                <Button className="w-full py-4 bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 hover:from-gray-600 hover:via-slate-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer">
                                    Go Home
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    // Main admin dashboard
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white drop-shadow">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-300 mt-1 text-lg">
                            Welcome, {user.name}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/">
                            <Button className="px-6 py-3 bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 hover:from-gray-600 hover:via-slate-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer">
                                Home
                            </Button>
                        </Link>
                        <Button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 hover:from-red-600 hover:via-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card className="shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                        <CardHeader className="px-6 pt-6 pb-4">
                            <CardTitle className="text-white font-bold">
                                Users
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                                Manage user accounts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <p className="text-3xl font-bold text-cyan-400">
                                1
                            </p>
                            <p className="text-sm text-gray-400">Total users</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                        <CardHeader className="px-6 pt-6 pb-4">
                            <CardTitle className="text-white font-bold">
                                Active Sessions
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                                Current active user sessions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <p className="text-3xl font-bold text-emerald-400">
                                1
                            </p>
                            <p className="text-sm text-gray-400">Active now</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                        <CardHeader className="px-6 pt-6 pb-4">
                            <CardTitle className="text-white font-bold">
                                System Status
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                                Overall system health
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <p className="text-3xl font-bold text-emerald-400">
                                Healthy
                            </p>
                            <p className="text-sm text-gray-400">
                                All systems operational
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* User Information Card */}
                <Card className="shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg mb-8">
                    <CardHeader className="px-6 pt-6 pb-4">
                        <CardTitle className="text-white font-bold">
                            User Information
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Your current session details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="font-semibold text-white">Name</p>
                                <p className="text-gray-300">{user.name}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="font-semibold text-white">
                                    Email
                                </p>
                                <p className="text-gray-300">{user.email}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="font-semibold text-white">Role</p>
                                <p className="text-emerald-400 capitalize font-medium">
                                    {user.role}
                                </p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="font-semibold text-white">
                                    User ID
                                </p>
                                <p className="text-gray-300 font-mono text-xs">
                                    {user.id}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                    <CardHeader className="px-6 pt-6 pb-4">
                        <CardTitle className="text-white font-bold">
                            Quick Actions
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Button className="h-auto p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex flex-col items-start text-left">
                                <span className="font-semibold text-white">
                                    View All Users
                                </span>
                                <span className="text-sm text-gray-400">
                                    Manage user accounts and permissions
                                </span>
                            </Button>
                            <Button className="h-auto p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex flex-col items-start text-left">
                                <span className="font-semibold text-white">
                                    System Logs
                                </span>
                                <span className="text-sm text-gray-400">
                                    View application logs and errors
                                </span>
                            </Button>
                            <Button className="h-auto p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex flex-col items-start text-left">
                                <span className="font-semibold text-white">
                                    Settings
                                </span>
                                <span className="text-sm text-gray-400">
                                    Configure application settings
                                </span>
                            </Button>
                            <Button className="h-auto p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex flex-col items-start text-left">
                                <span className="font-semibold text-white">
                                    Security
                                </span>
                                <span className="text-sm text-gray-400">
                                    Manage security policies
                                </span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
