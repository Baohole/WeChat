import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// Define TypeScript interface for Message
interface IOtp extends Document {
  email: string;  // Use string instead of String
  otp: string;    // Use string instead of String
  expireAt: {
    type: Date;
    expires: 180; // Expiration time in seconds
  };

  correctOTP(candidateOTP: string, userOTP: string): Promise<boolean>;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },  // Use string type for schema
  otp: { type: String, required: true },    // Use string type for schema
  expireAt: {
    type: Date,
    expires: 180, // Expire after 180 seconds
    required: true,
  }
});

otpSchema.pre<IOtp>("save", async function (next): Promise<void> {
  // Hash the OTP before saving
  this.otp = await bcrypt.hash(this.otp.toString(), 14);
  next();
});

otpSchema.methods.correctOTP = function (
  candidateOTP: string,
  userOTP: string
): Promise<boolean> {
  // Compare the candidate OTP with the stored OTP
  return bcrypt.compare(candidateOTP, userOTP);
};

const Otp = mongoose.model<IOtp>('Otp', otpSchema, 'Otp');
export default Otp;
