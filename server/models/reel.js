const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reel:{
        type:String,
        required:true
    },
    caption:{
        type:String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    savedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

module.exports = mongoose.model("Reel", reelSchema);