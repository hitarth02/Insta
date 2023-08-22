const mongoose = require("mongoose");
const post = require("../models/post");
const comment = require("../models/comment");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    bio:{
        type:String
    },
    userName:{
        type:String
    },
    password:{
        type:String,
        required:true,
    },
    userImage:{
        type:String,
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    reels:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reel"
    }],
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    followings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    savedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    notification:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"notificationSchema"
    }]
});

module.exports = mongoose.model("User", userSchema);