import User from "../models/userSchema.js";
import express from "express";

const donorRouter = express.Router();

donorRouter.get("/searchNearby", async (req, res) => {
  const { bloodGroup, latitude, longitude, distance } = req.query;
  console.log(
    "searching for donors with blood group",
    bloodGroup,
    "in radius of",
    distance,
    "km"
  );

  if (!bloodGroup || !latitude || !longitude || !distance) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const nearbyUsers = await User.find({
      bloodGroup: bloodGroup,
      "location.latitude": {
        $gte: parseFloat(latitude) - parseFloat(distance) / 111,
        $lte: parseFloat(latitude) + parseFloat(distance) / 111,
      },
      "location.longitude": {
        $gte:
          parseFloat(longitude) -
          parseFloat(distance) /
            (111 * Math.cos(parseFloat(latitude) * (Math.PI / 180))),
        $lte:
          parseFloat(longitude) +
          parseFloat(distance) /
            (111 * Math.cos(parseFloat(latitude) * (Math.PI / 180))),
      },
    });
    console.log("nearby users", nearbyUsers);
    res.status(200).json(nearbyUsers);
  } catch (error) {
    console.error("Error fetching nearby users:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching nearby users" });
  }
});

export default donorRouter;
