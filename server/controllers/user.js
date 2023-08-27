const Notifications = require("../models/notification");
const User = require("../models/user");
const uploadToCloudinary = require("../utils/fileUploader");
require("dotenv").config();

exports.getAllUsers = async (req , res) => {
    try {
        const allUsers = await User.find().populate("followers").populate("followings").exec();

        return res.status(200).json({
            success:true,
            message:"All users fetched",
            data:allUsers
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch user!"
        }); 
    };
};

exports.getUserDetails = async (req , res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.json({
                success:false,
                message:"Provide email!",
            });
        };

        const userDetails = await User.findOne({email:email},{
            posts:{
                $reverseArray:["$posts"]
            },
            userImage:true,
            userName:true,
            firstName:true,
            lastName:true,
            email:true,
            bio:true,
            like:true,
            comment:true,
            followers:true,
            followings:true,
            textStory:true,
            savedPosts:{
                $reverseArray:["$savedPosts"]
            },
            reels:{
                $reverseArray:["$reels"]
            }
        }).populate("posts").populate("savedPosts").populate("reels").populate("followers").populate("followings")
        .populate({
            path:"notification",
            populate:{
                path:"user",
                path:"post"
            }
        })
        .exec();

        if(!userDetails){
            return res.json({
                success:false,
                message:"User details not found!",
            });
        };

        return res.status(200).json({
            success:true,
            message:"User details fetched",
            data:userDetails,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch user!"
        }); 
    };
};

exports.updateUserDetails = async (req , res) => {
    try {
        const {firstName , lastName , bio} = req.body;
        const {id} = req.user;

        if(!id){
            return res.json({
                success:false,
                message:"id not found!",
            });
        };

        const updatedUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                firstName:firstName,
                lastName:lastName,
                bio:bio
            },
            {new:true}
        );
        if(!updatedUser){
            return res.json({
                success:false,
                message:"Cannot update user",
            });
        };

        const newUserdetails = await User.findById(id,{
            posts:{
                $reverseArray:["$posts"]
            },
            userImage:true,
            userName:true,
            firstName:true,
            lastName:true,
            email:true,
            bio:true,
            like:true,
            comment:true,
            followers:true,
            followings:true,
            textStory:true,
            savedPosts:{
                $reverseArray:["$savedPosts"]
            },
            reels:{
                $reverseArray:["$reels"]
            }
        }).populate("posts").populate("savedPosts").populate("reels").populate("followers").populate("followings").exec();
        if(!newUserdetails){
            return res.json({
                success:false,
                message:"NEW User details not found!",
            });
        };
        
        return res.status(200).json({
            success:true,
            message:"User updated",
            data:newUserdetails,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot update user!"
        }); 
    };
};

exports.updateUserPicture = async (req , res) => {
    try {
        const {id} = req.user;
        const profilePicture = req.files.userImage;

        const image = await uploadToCloudinary(
            profilePicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        ); 

        const updateUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                userImage:image.secure_url
            },
            {new:true}
        );
        if(!updateUser){
            return res.json({
                success:false,
                message:"Cannot update user",
            });
        };

        const newUserdetails = await User.findById(id,{
            posts:{
                $reverseArray:["$posts"]
            },
            userImage:true,
            userName:true,
            firstName:true,
            lastName:true,
            email:true,
            bio:true,
            like:true,
            comment:true,
            followers:true,
            followings:true,
            textStory:true,
            savedPosts:{
                $reverseArray:["$savedPosts"]
            },
            reels:{
                $reverseArray:["$reels"]
            }
        }).populate("posts").populate("savedPosts").populate("reels").populate("followers").populate("followings")
        .populate({
            path:"notification",
            populate:{
                path:"user",
                path:"post"
            }
        })
        .exec();

        if(!newUserdetails){
            return res.json({
                success:false,
                message:"NEW User details not found!",
            });
        };
        
        return res.status(200).json({
            success:true,
            message:"User updated",
            data:newUserdetails,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot update user!"
        }); 
    };
};

exports.followUser = async (req , res) => {
    try {
        const {id} = req.user;
        const {otherUserId} = req.body;
        if(!id || !otherUserId){
            return res.json({
                success:false,
                message:"cannot get id of users!"
            }); 
        };

        const updateLoggenInUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $push:{
                    followings:otherUserId
                }
            },
            {new:true}
        );

        const updatedUser = await User.findById(id,{
            posts:{
                $reverseArray:["$posts"]
            },
            userImage:true,
            userName:true,
            firstName:true,
            lastName:true,
            email:true,
            bio:true,
            like:true,
            comment:true,
            followers:true,
            followings:true,
            textStory:true,
            savedPosts:{
                $reverseArray:["$savedPosts"]
            },
            reels:{
                $reverseArray:["$reels"]
            }
        }).populate("posts").populate("savedPosts").populate("reels").populate("followers").populate("followings")
        .populate({
            path:"notification",
            populate:{
                path:"user",
                path:"post"
            }
        })
        .exec();

        const updateOtherUser = await User.findByIdAndUpdate(
            {_id:otherUserId},
            {
                $push:{
                    followers:id
                }
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Followed",
            currentUser: updatedUser,
            otherUser: updateOtherUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot follow user!"
        }); 
    };
};

exports.unFollowUser = async (req , res) => {
    try {
        const {id} = req.user;
        const {otherUserId} = req.body;
        if(!id || !otherUserId){
            return res.json({
                success:false,
                message:"cannot get id of users!"
            }); 
        };

        const updateLoggenInUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $pull:{
                    followings:otherUserId
                }
            },
            {new:true}
        );

        const updatedUser = await User.findById(id,{
            posts:{
                $reverseArray:["$posts"]
            },
            userImage:true,
            userName:true,
            firstName:true,
            lastName:true,
            email:true,
            bio:true,
            like:true,
            comment:true,
            followers:true,
            followings:true,
            textStory:true,
            savedPosts:{
                $reverseArray:["$savedPosts"]
            },
            reels:{
                $reverseArray:["$reels"]
            }
        }).populate("posts").populate("savedPosts").populate("reels").populate("followers").populate("followings")
        .populate({
            path:"notification",
            populate:{
                path:"user",
                path:"post"
            }
        })
        .exec();

        const updateOtherUser = await User.findByIdAndUpdate(
            {_id:otherUserId},
            {
                $pull:{
                    followers:id
                }
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Followed",
            currentUser: updatedUser,
            otherUser: updateOtherUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot follow user!"
        }); 
    };
};


//*******MESSENGER CONTROLLER*******//

exports.searchUser = async (req , res) => {
    try {
        const {id} = req.user;

        const keyword = req.query.search ? {
            $or:[
                {
                    firstName:{$regex: req.query.search, $options:"i"}
                },
                {
                    lastName:{$regex: req.query.search, $options:"i"}
                },
                {
                    email:{$regex: req.query.search, $options:"i"}
                },
            ]
        } :{};

        const users = await User.find(keyword);

        return res.status(200).json({
            success:true,
            message:"search results!",
            data:users,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot search users!"
        }); 
    };
};

//FETCH NOTIFICATIONS

exports.fetchNotifications = async (req , res) => {
    try {
        const {id} = req.user;

        const allNotifications = await Notifications.find({
            user:{ $eq: id}
        }).sort({createdAt:-1}).populate("currUser").populate("user").populate({
            path:"post",
            populate:{
                path:"comments",
                populate:{
                    path:"user"
                }
            }
        }).populate({
            path:"post",
            populate:{
                path:"user",
            }
        }).exec();
        if(!allNotifications){
            return res.json({
                success:false,
                message:"problem fetching notification for user"
            });
        };

        return res.status(200).json({
            success:true,
            message:"fetch notfications",
            data:allNotifications
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch notifications !"
        }); 
    };
};