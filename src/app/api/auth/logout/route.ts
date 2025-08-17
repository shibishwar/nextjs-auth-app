import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { verifyRefreshToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
    try {
        // Connect to database
        await connectToDatabase();

        // Get refresh token from cookie
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (refreshToken) {
            // Verify and decode the refresh token to get user ID
            const decoded = verifyRefreshToken(refreshToken);

            if (decoded) {
                // Find user and remove the refresh token from database
                const user = await User.findById(decoded.userId);
                if (user) {
                    // Remove the specific refresh token from the array
                    user.refreshTokens = user.refreshTokens.filter(
                        (token) => token !== refreshToken
                    );
                    await user.save();
                    console.log(`User logged out: ${user.email}`);
                }
            }
        }

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: "Logged out successfully",
            },
            { status: 200 }
        );

        // Clear the refresh token cookie
        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0, // Expire immediately
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);

        // Even if there's an error, we should still clear the cookie
        const response = NextResponse.json(
            {
                success: true,
                message: "Logged out successfully",
            },
            { status: 200 }
        );

        // Clear the refresh token cookie
        response.cookies.set("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        return response;
    }
}
