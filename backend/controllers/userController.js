import express from "express";
import User from "../models/userSchema.js";
import { generateToken } from "../utils/tokenUtils.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { user } = req.body;
    console.log("Request Recieved for register user", user);
    if (!user.phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    const existingUser = await User.findOne({ phoneNumber: user.phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User(user);
    await newUser.save();
    const token = generateToken(newUser);
    console.log(newUser);
    res
      .status(200)
      .json({ message: "User created successfully", user: newUser, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return res.status(400).json({ message: "Invalid phone number" });
    }
    const token = generateToken(user);
    console.log("User Logged in ");
    return res.status(200).json({ message: "login Successful", user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default userRouter;
