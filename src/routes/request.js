const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const Connection = require("../models/connections");
const { validateRequest, existingConnection, pendingStatus } = require("../middlewares/connectmid");


requestRouter.post("/request/send/:status/:toUserId",
  userAuth,validateRequest,existingConnection,pendingStatus,async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
    
      if (req.isPending) {
        return res.status(200).json({ message: "Yay both are Interested! Something's Cooking ;)"});
      }
      await Connection.findOneAndUpdate(
        { fromUserId, toUserId },
        {
          $setOnInsert: { fromUserId, toUserId },
          $set: { status },
        },
        { upsert: true, new: true }
      );
      res.status(200).json({
        message: "Request sent successfully!",
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const validStatus = ["accepted", "rejected"];
      if (!validStatus.includes(status)) {
          return res.status(400).json({ error: "Not a valid status!!" });
      }
      const connectionRequest = await Connection.findById(requestId);

      if (!connectionRequest) {
        return res.status(404).json({ error: "Connection request not found!!" });
      }
      
      if (connectionRequest.toUserId.toString() !== loggedInUser._id.toString()) {
        return res.status(403).json({ error: "Cannot review own requests" });
      }
      
      if (connectionRequest.status !== "pending") {
        return res.status(400).json({ error: `This request has already been ${connectionRequest.status}!!` });
      }

      connectionRequest.status = status;
      await connectionRequest.save();


      const myConnection = await Connection.findOne({
        fromUserId: connectionRequest.toUserId,
        toUserId: connectionRequest.fromUserId,
      });
          
      if (status === "rejected") {
        if (myConnection) {
          myConnection.status = "rejected";
          await myConnection.save();
        }
        return res.json({ message: "Connection rejected!", data: connectionRequest });
      }

      if (status === "accepted") {
        if (myConnection.status === "accepted") {
          connectionRequest.status = "matched";
          myConnection.status = "matched";
          await connectionRequest.save();
          await myConnection.save();
          return res.json({ message: "Connection matched!", data: connectionRequest });
        }
      }
      res.json({ Message: "Request Processed Successfully!!", connectionRequest });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
module.exports = requestRouter;