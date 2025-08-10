import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                <CardHeader className="text-center px-6 pt-8 pb-6">
                    <CardTitle className="text-4xl font-bold text-white drop-shadow">
                        Admin Dashboard
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-3 text-lg">
                        Welcome to the administrative panel
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-6 pb-8">
                    <div className="text-center space-y-6">
                        <div className="py-8">
                            <p className="text-gray-500 mt-2">
                                Administrative features will be implemented
                                here.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Link href="/" className="block w-full">
                                <Button className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300">
                                    Back to Home
                                </Button>
                            </Link>

                            <Button className="w-full py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm font-medium rounded-lg">
                                Logout
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
