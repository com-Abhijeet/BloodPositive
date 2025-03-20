import Request from "../models/requestSchema.js";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const requestRouter = express.Router();

requestRouter.post("/create", async (req, res) => {
  try {
    const { request } = req.body;
    if (
      !request.requestor ||
      !request.requestedTo ||
      !request.status ||
      !request.requiredBloodGroup
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let requestId = uuidv4();
    let requestIdExists = await Request.findOne({ requestId });
    while (requestIdExists) {
      requestId = uuidv4();
      requestIdExists = await Request.findOne({ requestId });
    }

    const newRequest = new Request({ ...request, requestId });
    await newRequest.save();
    res.status(200).json({
      message: "Requested created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

requestRouter.get("/getUserSentRequests/:requestorId", async (req, res) => {
  try {
    const { requestorId } = req.params;
    if (!requestorId) {
      return res.status(400).json({ message: "user Id required" });
    }
    const requests = await Request.find({ requestor: requestorId })
      .populate(
        "requestor",
        "name phoneNumber adhaarNumber address city pincode state plusCode bloodGroup"
      )
      .populate(
        "requestedTo",
        "name phoneNumber adhaarNumber address city pincode state plusCode bloodGroup"
      )
      .sort({ createdAt: -1 }); // Sort by createdAt date in descending order
    if (requests.length === 0) {
      return res.status(404).json({ message: "No requests found" });
    }
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

requestRouter.get("/getUserRecievedRequest/:requestedTo", async (req, res) => {
  try {
    const { requestedTo } = req.params;
    if (!requestedTo) {
      return res.status(400).json({ message: "user Id required" });
    }
    const requests = await Request.find({ requestedTo })
      .populate(
        "requestor",
        "name phoneNumber adhaarNumber address city pincode state plusCode bloodGroup"
      )
      .populate(
        "requestedTo",
        "name phoneNumber adhaarNumber address city pincode state plusCode bloodGroup"
      )
      .sort({ createdAt: -1 }); // Sort by createdAt date in descending order
    if (requests.length === 0) {
      return res.status(404).json({ message: "No requests found" });
    }
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

requestRouter.put("/update/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const updateData = req.body;
    console.log(
      "update request recieved for ",
      requestId,
      "with data",
      updateData
    );

    const updatedRequest = await Request.findOneAndUpdate(
      { requestId },
      updateData,
      {
        new: true,
      }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

requestRouter.delete("/delete/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;

    const deletedRequest = await Request.findOneAndDelete({ requestId });

    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

export default requestRouter;
