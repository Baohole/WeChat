import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interface for FriendRequest
interface IFriendRequest extends Document {
  sender: mongoose.Schema.Types.ObjectId;
  recipient: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

// Define Mongoose schema with TypeScript
const requestSchema = new Schema<IFriendRequest>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create and export the model
const FriendRequest: Model<IFriendRequest> = mongoose.model<IFriendRequest>("FriendRequest", requestSchema);

export default FriendRequest;
