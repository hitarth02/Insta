const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    currUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    notification:{
        type:String,
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    isLike:{
        type:Boolean
    },
    isPost:{
        type:Boolean
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 5*60*60,
    },
});

module.exports = mongoose.model("notificationSchema",notificationSchema);