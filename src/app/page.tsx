import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Home() {
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
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
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
