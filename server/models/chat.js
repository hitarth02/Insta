const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    chatName:{
        type:String,
        trim:true
    },
    isGroupChat:{
        type:Boolean,
        default:false,
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    groupLogo:{
        type:String
    },

},{timestamps:true});

module.exports = mongoose.model("Chat",chatSchema);