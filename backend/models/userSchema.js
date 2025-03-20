import mongoose from "mongoose";

const subscription = new mongoose.Schema({
  subscriptionTier: String,
  subscriptionStatus: String,
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  searchCount: Number,
  callCount: Number,
  donationRequestCount: Number,
});

const userSchema = new mongoose.Schema({
  name: String,
  phoneNumber: Number,
  adhaarNumber: Number,
  address: String,
  city: String,
  pincode: String,
  state: String,
  plusCode: String,
  bloodGroup: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  subscription: [subscription],
});

const User = mongoose.model("Users", userSchema);

export default User;
