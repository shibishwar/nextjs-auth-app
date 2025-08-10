import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// TypeScript interface for User document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    refreshTokens: string[]; // Array to store valid refresh tokens
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema definition
const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
            maxlength: [50, "Name must be less than 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        refreshTokens: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    try {
        // Hash password with cost of 12
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Prevent re-compilation during development
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
