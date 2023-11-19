import mongoose from "mongoose";

const { Schema } = mongoose;

const WaitlistSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    realIp: {
      type: String,
      
    },
  },
  { timestamps: true }
);

//If the Post collection does not exist create a new one.
export default mongoose.models.Waitlist || mongoose.model("Waitlist", WaitlistSchema);
