const User = require('../models/user');
const Connection = require('../models/connections');

const validateRequest=async(req,res,next)=>{
try {
    const fromUserId = req.user._id;
    const  toUserId = req.params.toUserId;
    const status = req.params.status;
    const toUser = await User.findById(toUserId);

    if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).json({ Error: "Cannot send a connection to yourself!" });
      }
      if (!toUser) {
        return res.status(404).json({ Error: "User Not Found!" });
      }

      const validStatus = ["ignored", "interested"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ Error: "Invalid Status!" });
      }

      req.toUser = toUser;
      next();
} catch (err) {
   return res.status(400).json({Error : err.message});
}}

const existingConnection=async(req,res,next)=>{
    try {
        const fromUserId = req.user._id;
        const  toUserId = req.params.toUserId;

        const existingconnection = await Connection.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
          });
          if (existingconnection) {
            if (existingconnection.status === "ignored" && existingconnection.toUserId.toString() === fromUserId.toString()) {
                return res.status(400).json({ Error: "Connection Declined!!" });
            }

            if (existingconnection.fromUserId.toString() === fromUserId.toString()) {
                return res.status(400).json({ Error: "Connection request already exists!"});
            }

            if (["pending","interested","matched","accepted"].includes(existingConnection.status)) {
              return res.status(400).json({ 
                error: "A connection already exists between both users" 
              });
            }

        }
          next();
    } catch (err) {
        return res.status(400).json({Error : err.message});
    }}

const pendingStatus=async(req,res,next)=>{
        try {
            const fromUserId = req.user._id;
            const  toUserId = req.params.toUserId;
            const status = req.params.status;
            
            const reverseConnection = await Connection.findOne({
                fromUserId: toUserId,
                toUserId: fromUserId,
                status: "interested",
              });
        
              if (reverseConnection && status === "interested") {
                await Connection.findOneAndUpdate(
                  { fromUserId, toUserId },
                  { $set: { status: "pending" } }, 
                  { upsert: true, new: true }
                );
        
                await Connection.findOneAndUpdate(
                  { fromUserId: toUserId, toUserId: fromUserId },
                  { $set: { status: "pending" } }
                );
                req.isPending = true;
              }
              next();
        } catch (err) {
           return res.status(400).json({Error : err.message});
        }}

        module.exports = {validateRequest,existingConnection,pendingStatus};