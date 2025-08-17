import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
    try {
        await connectToDatabase();

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            email: process.env.ADMIN_EMAIL,
        });

        if (existingAdmin) {
            return NextResponse.json(
                { message: "Admin user already exists" },
                { status: 200 }
            );
        }

        // Create admin user
        const adminUser = new User({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: "admin",
        });

        await adminUser.save();

        return NextResponse.json(
            {
                success: true,
                message: "Admin user created successfully",
                admin: {
                    email: process.env.ADMIN_EMAIL,
                    role: "admin",
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create admin error:", error);
        return NextResponse.json(
            { error: "Failed to create admin user" },
            { status: 500 }
        );
    }
}
