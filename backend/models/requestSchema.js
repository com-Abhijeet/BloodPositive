import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
    },
    requestor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    requestedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "dontated",
        "expired",
        "cancelled",
      ],
    },
    requiredBloodGroup: String,
    requiredUntil: Date,
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
