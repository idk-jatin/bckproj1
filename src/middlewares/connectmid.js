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
    res.status(400).json({Error : err.message});
}}

const existingConnection=async(req,res,next)=>{
    try {
        const fromUserId = req.user._id;
        const  toUserId = req.params.toUserId;

        const existingConnection = await Connection.findOne({
            fromUserId,
            toUserId,
            status: { $in: ["interested", "matched"] },
          });
          
          if (existingConnection) {
            return res.status(400).json({ Error: "Connection request already exist!" });
          }
          next();
    } catch (err) {
        res.status(400).json({Error : err.message});
    }}

const matchStatus=async(req,res,next)=>{
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
                  { $set: { status: "matched" } }, 
                  { upsert: true, new: true }
                );
        
                await Connection.findOneAndUpdate(
                  { fromUserId: toUserId, toUserId: fromUserId },
                  { $set: { status: "matched" } }
                );
                req.isMatch = true;
              }
              next();
        } catch (err) {
            res.status(400).json({Error : err.message});
        }}

        module.exports = {validateRequest,existingConnection,matchStatus};