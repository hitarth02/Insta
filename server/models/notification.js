const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
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
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 5*60*60,
    },
});

module.exports = mongoose.model("notificationSchema",notificationSchema);