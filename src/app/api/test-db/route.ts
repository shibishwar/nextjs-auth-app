import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
    try {
        // Test database connection
        await connectToDatabase();

        return NextResponse.json(
            {
                success: true,
                message: "Database connected successfully!",
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Database connection failed:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Database connection failed",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
