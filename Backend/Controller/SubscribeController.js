const express=require("express");
const mongoose=require("mongoose");
const Subscribe = require("../Model/Subscribe");

const router=express.Router();


//Subscribe Channel
//URL http://localhost:5000/subscription/subscribe
router.post("/subscribe", async (req,res)=>{
    try{
        const subscribe=new Subscribe(req.body);
        await subscribe.save();
        return res.status(200).send({message:"Subscribed Successfully"});
    }catch(err){
        return res.status(400).send({message:"Error while subscribing"});
    }
});

router.get('/count/:id', async (req, res) => {
  try {
    const channelId = req.params.id;
    // Find all subscriptions where subscribedChannel array includes channelId
    const subs = await Subscribe.find({ subscribedChannel: channelId });
    return res.status(200).json({ count: subs.length });
  } catch (err) {
    console.error('Error fetching subscription count', err);
    return res.status(500).json({ error: 'Error fetching subscription count' });
  }
});


//UN-Subscribe Channel
//URL http://localhost:5000/subscription/unsubscribe/id
router.put("/unsubscribe/:id", async (req, res) => {
    try {
        const channelIdToUnsubscribe = req.params.id; 
        const userId = req.body.user_id;
        if (!channelIdToUnsubscribe) {
            return res.status(400).send({ error: "Incorrect Channel ID" });
        }
        if (!userId) {
            return res.status(400).send({ error: "User ID is required" });
        }
        const subscription = await Subscribe.findOne({ user_id: userId });
        if (!subscription) {
            return res.status(404).send({ error: "Subscription not found" });
        }
        subscription.subscribedChannel = subscription.subscribedChannel.filter(
            (id) => id.toString() !== channelIdToUnsubscribe
        );
        await subscription.save();
        return res.status(200).send({ message: "Unsubscribed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ message: "Error while unsubscribing" });
    }
});


module.exports=router;