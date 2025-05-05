import mongoose, { Schema, Document, Model, Types } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Define TypeScript interface for User model
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  avatar?: string;
  email: string;
  activityStatus?: string;
  onlineStatus: "online" | "offline";
  password: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordResetLastSent?: Date;
  verified: boolean;
  otp?: string;
  otp_expiry_time?: Date;
  otp_last_sent_time?: Date;
  otp_verify_attempts?: number;
  friends: Types.ObjectId[];
  socialsConnected?: ("google" | "github" | "linkedin")[];
  createdAt?: Date;
  updatedAt?: Date;
  token: string;

  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  correctOTP(candidateOTP: string, userOTP: string): Promise<boolean>;
  changedPasswordAfter(JWTTimeStamp: number): boolean;
  createPasswordResetToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: [true, "First Name is required"] },
    lastName: { type: String, required: [true, "Last Name is required"] },
    avatar: { type: String },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    activityStatus: {
      type: String,
      default: "Hey There! I ❤️ Using WeChat 😸",
    },
    onlineStatus: {
      type: String,
      default: "offline",
      enum: ["online", "offline"],
    },
    token: String,

    // Passwords schema
    password: { type: String, required: [true, "Password is required"] },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    passwordResetLastSent: { type: Date },

    verified: { type: Boolean, default: false },

    // OTP schema
    otp: { type: String },
    otp_expiry_time: { type: Date },
    otp_last_sent_time: { type: Date },
    otp_verify_attempts: { type: Number },

    // Users friends
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Socials Added
    socialsConnected: {
      type: [String],
      enum: ["google", "github", "linkedin"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next): Promise<void> {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 14);
    this.passwordChangedAt = new Date(Date.now() - 1000); // Ensure JWT tokens before this are invalid
  }

  if (this.isModified("otp") && this.otp) {
    this.otp = await bcrypt.hash(this.otp.toString(), 14);
  }

  if (this.isNew && this.friends.length === 0) {
    this.friends.push(this._id as Types.ObjectId);
  }

  next();
});

// Compare password method
userSchema.methods.correctPassword = function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

// Compare OTP method
userSchema.methods.correctOTP = function (
  candidateOTP: string,
  userOTP: string
): Promise<boolean> {
  return bcrypt.compare(candidateOTP, userOTP);
};

// Check if the password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp: number): boolean {
  if (this.passwordChangedAt instanceof Date) {
    const changedTimeStamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

// Generate a password reset token
userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  return resetToken;
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
