import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interface for Message
interface IMessage extends Document {
  sender: mongoose.Schema.Types.ObjectId;
  message: string;
  conversation: mongoose.Schema.Types.ObjectId;
  files: string[]; // Assuming file URLs or paths are stored as strings
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose schema with TypeScript
const messageSchema = new Schema<IMessage>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, trim: true, required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    files: { type: [String], default: [] }, // Ensuring files is an array of strings
  },
  {
    timestamps: true, // Mongoose will automatically add `createdAt` and `updatedAt`
  }
);

// Create and export the model
const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
