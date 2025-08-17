import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "@/lib/jwt";

export async function POST(request: NextRequest) {
    try {
        // Connect to database
        await connectToDatabase();

        // Get refresh token from cookie
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: "Refresh token not found" },
                { status: 401 }
            );
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return NextResponse.json(
                { error: "Invalid refresh token" },
                { status: 401 }
            );
        }

        // Find user and check if refresh token exists in database
        const user = await User.findById(decoded.userId);
        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return NextResponse.json(
                { error: "Invalid refresh token" },
                { status: 401 }
            );
        }

        // Generate new tokens
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const newAccessToken = generateAccessToken(tokenPayload);
        const newRefreshToken = generateRefreshToken(tokenPayload);

        // Replace old refresh token with new one
        const tokenIndex = user.refreshTokens.indexOf(refreshToken);
        user.refreshTokens[tokenIndex] = newRefreshToken;
        await user.save();

        // Create response with new access token
        const response = NextResponse.json(
            {
                success: true,
                message: "Tokens refreshed successfully",
                accessToken: newAccessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        );

        // Update refresh token cookie
        response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        console.log(`Tokens refreshed for user: ${user.email}`);

        return response;
    } catch (error) {
        console.error("Refresh token error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
