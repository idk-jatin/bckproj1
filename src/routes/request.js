const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Connection = require("../models/connections");
const { validateRequest, existingConnection, matchStatus } = require("../middlewares/connectmid");

requestRouter.post("/request/send/:status/:toUserId",
  userAuth,validateRequest,existingConnection,matchStatus,async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
    
      if (req.isMatch) {
        return res.status(200).json({ message: "Its a match!"});
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
      res.status(400).json({ Error: err.message });
    }
  }
);

module.exports = requestRouter;