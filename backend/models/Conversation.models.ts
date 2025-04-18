import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interface for Conversation
interface IConversation extends Document {
  name: string;
  picture?: string;
  isGroup: boolean;
  users: mongoose.Schema.Types.ObjectId[];
  latestMessage?: mongoose.Schema.Types.ObjectId;
  admin?: mongoose.Schema.Types.ObjectId;
}

const conversationSchema = new Schema<IConversation>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    picture: { type: String },
    isGroup: { type: Boolean, required: true, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Correctly type the model
const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
