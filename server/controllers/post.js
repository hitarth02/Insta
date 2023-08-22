const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Reel = require("../models/reel");
const Notification = require("../models/notification");
const uploadToCloudinary = require("../utils/fileUploader");
require("dotenv").config();

exports.getAllPosts = async (req , res) => {
    try {
        const allPosts = (await Post.find().populate("user").populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec()).reverse();
        
        return res.status(200).json({
            success:true,
            message:"fetched all posts",
            data:allPosts,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch all post !"
        }); 
    };
};

exports.getSinglePost = async (req , res) => {
    try {
        const {postId} = req.body;
        
        const post = await Post.findById(postId).populate("user").populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec();
        
        return res.status(200).json({
            success:true,
            message:"fetched post",
            data:post,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch post !"
        }); 
    };
};

exports.createPost = async (req , res) => {
    try {
        const {id} = req.user;
        const post = req.files.post;
        const {caption} = req.body;

        if(!post){
            return res.json({
                success:false,
                message:"provide all details!"
            });
        };

        const uploadPost = await uploadToCloudinary(
            post,
            process.env.FOLDER_NAME,
            1270,
            1270
        );
        if(!uploadPost){
            return res.json({
                success:false,
                message:"Cannot post to cloudinary!"
            });
        };

        const newPost = await Post.create({
            user: id,
            image: uploadPost.secure_url,
            caption: caption,
        });

        const updateUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $push:{
                    posts:newPost._id
                }
            },
            {new:true}
        );
        if(!updateUser){
            return res.json({
                success:false,
                message:"Cannot update user!"
            });
        };

        return res.status(200).json({
            success:true,
            message:"posted",
            data: newPost,
            user: updateUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot post !"
        }); 
    };
};

exports.likePost = async (req , res) => {
    try {
        const {id} = req.user;
        const {postId} = req.body;

        if(!id || !postId){
            return res.json({
                success:false,
                message:"provide all details"
            });
        };

        const user = await User.findById(id);
        const likePost = await Post.findByIdAndUpdate(
            {_id:postId},
            {
                $push:{
                    likes:id
                }
            },
            {new:true}
        ).populate("user").populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec();

        const notification = await Notification.create({
            user: likePost.user._id,
            notification: `${user.userName} liked your post`,
            post:likePost._id
        });

        const currUser = await User.findByIdAndUpdate(
            {_id:likePost.user._id},
            {
                $push:{
                    notification:notification._id
                }
            }
        );


        const updateUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $push:{
                    like:postId,
                }
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Liked",
            data:updateUser,
            like:likePost,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot Like !"
        }); 
    };
};

exports.unLikePost = async (req , res) => {
    try {
        const {id} = req.user;
        const {postId} = req.body;
        
        if(!id || !postId){
            return res.json({
                success:false,
                message:"provide all details"
            });
        };

        const unLikePost = await Post.findByIdAndUpdate(
            {_id:postId},
            {
                $pull:{
                    likes:id
                }
            },
            {new:true}
        ).populate("user").populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec();

        const updateUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $pull:{
                    like:postId
                }
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Un Liked",
            data:updateUser,
            unLike:unLikePost,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot Unlike !"
        }); 
    };
};

exports.savePost = async (req , res) => {
    try {
        const {id} = req.user;
        const {postId} = req.body;

        if(!id || !postId){
            return res.json({
                success:false,
                message:"provide all details"
            });
        };

        const savePost = await Post.findByIdAndUpdate(
            {_id:postId},
            {
                $push:{
                    savedBy:id
                }
            },
            {new:true}
        ).populate("user").populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec();

        const updateUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $push:{
                    savedPosts:postId
                }
            },
            {new:true}
        );
        
        return res.status(200).json({
            success:true,
            message:"Post saved!",
            post: savePost,
            data:updateUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot save !"
        }); 
    };
};

exports.unSavePost = async (req , res) => {
    try {
        const {id} = req.user;
        const {postId} = req.body;

        if(!id || !postId){
            return res.json({
                success:false,
                message:"provide all details"
            });
        };

        const unSavePost = await Post.findByIdAndUpdate(
            {_id:postId},
            {
                $pull:{
                    savedBy:id
                }
            },
            {new:true}
        ).populate("user").populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec();

        const updateUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $pull:{
                    savedPosts:postId
                }
            },
            {new:true}
        );
        
        return res.status(200).json({
            success:true,
            message:"Post unSaved!",
            post: unSavePost,
            data:updateUser
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot unsave !"
        }); 
    };
};

exports.addComment = async(req , res) => {
    try {
        const {id} = req.user;
        const {postId , comment} = req.body;

        if(!id || !postId || !comment){
            return res.json({
                success:false,
                message:"provide all details"
            });
        };

        const newComment = await Comment.create({
            user:id,
            post:postId,
            comment:comment
        });

        const updatePost = await Post.findByIdAndUpdate(
            {_id:postId},
            {
                $push:{
                    comments:newComment._id
                }
            },
            {new:true}
        ).populate("user").populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec();

        const updateUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $push:{
                    comment:newComment._id
                }
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Comment added!",
            post: updatePost,
            data:updateUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot unsave !"
        }); 
    };
};

exports.removeComment = async(req , res) => {
    try {
        const {id} = req.user;
        const {postId , commentId} = req.body;
        
        if(!id || !postId || !commentId){
            return res.json({
                success:false,
                message:"provide all details"
            });
        };

        const deleteComment = await Comment.findByIdAndDelete(commentId);

        const updatePost = await Post.findByIdAndUpdate(
            {_id:postId},
            {
                $pull:{
                    comments:commentId
                }
            },
            {new:true}
        ).populate("user").populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec();

        const updateUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $pull:{
                    comment:commentId
                }
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Comment deleted!",
            post: updatePost,
            data:updateUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot delete comment !"
        }); 
    };
};

exports.deletePost = async(req , res) => {
    try {
        const {id} = req.user;
        const {postId} = req.body;
        
        if(!id || !postId){
            return res.json({
                success:false,
                message:"provide all details"
            });
        };

        const deletePost = await Post.findByIdAndDelete(postId);

        const deleteComments = await Comment.deleteMany({post:postId});


        const updateUser = await User.findByIdAndUpdate(
            {_id:id},
            {
                $pull:{
                    posts:postId
                }
            },
            {new:true}
        );
        
        const newUser = await User.findById(id,{
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
            savedPosts:{
                $reverseArray:["$savedPosts"]
            }
        }).populate("posts").populate("followers").populate("followings").populate("savedPosts").exec();

        return res.status(200).json({
            success:true,
            message:"post deleted!",
            data:newUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot delete post !"
        }); 
    };
};

exports.createReel = async (req , res) => {
    try {
        const {id} = req.user;
        const {caption} = req.body;
        const reel = req.files.reel;

        if(!id || !reel){
            return res.json({
                success:false,
                message:"provide all details"
            });
        };

        const uploadReelToCloud = await uploadToCloudinary(reel , process.env.FOLDER_NAME , 1920 , 1080);
        console.log(uploadReelToCloud)
        if(!uploadReelToCloud){
            return res.json({
                success:false,
                message:"cannot upload reel"
            });
        };

        const createReel = await Reel.create({
            user: id,
            reel: uploadReelToCloud.secure_url,
            caption: caption
        });

        const updateUser = await User.findByIdAndUpdate(
                {_id:id},
                {
                    $push:{
                        reels:createReel._id
                    }
                },
                {new:true}
            );

        const newUser = await User.findById(id,{
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
            savedPosts:{
                $reverseArray:["$savedPosts"]
            },
            reels:{
                $reverseArray:["$reels"]
            }
        }).populate("posts")
        .populate("followers")
        .populate("followings")
        .populate("savedPosts")
        .populate("reels")
        .exec();

        return res.status(200).json({
            success:true,
            message:"post deleted!",
            user:newUser,
            reel:createReel
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot delete post !"
        }); 
    };
};

exports.getAllReels = async (req , res) => {
    try {
        const allReels = (await Reel.find().populate("user").populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).exec()).reverse();
        
        return res.status(200).json({
            success:true,
            message:"fetched all reels",
            data:allReels,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch all reels !"
        }); 
    };
};