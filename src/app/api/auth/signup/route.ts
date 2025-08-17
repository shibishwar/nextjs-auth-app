import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
    try {
        // Connect to database
        await connectToDatabase();

        // Parse request body
        const { name, email, password } = await request.json();

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Create new user (password will be hashed automatically by the model)
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: "user", // Default role
        });

        const savedUser = await newUser.save();

        // Generate tokens
        const tokenPayload = {
            userId: savedUser._id.toString(),
            email: savedUser.email,
            role: savedUser.role,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Save refresh token to user's refreshTokens array
        savedUser.refreshTokens.push(refreshToken);
        await savedUser.save();

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                user: {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                    role: savedUser.role,
                },
                accessToken,
            },
            { status: 201 }
        );

        // Set refresh token as HTTP-only cookie
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true, // Cannot be accessed by JavaScript
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "strict", // CSRF protection
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: "/", // Available for all routes
        });

        return response;
    } catch (error) {
        console.error("Signup error:", error);

        // Handle mongoose validation errors
        if (error instanceof Error && error.name === "ValidationError") {
            return NextResponse.json(
                { error: "Invalid user data provided" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
