const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");
const uploadToCloudinary = require("../utils/fileUploader");

exports.accessChat = async (req , res) => {
    try {
        const {userId} = req.body;
        const {id} = req.user;

        if(!userId){
            return res.json({
                success:false,
                message:"please provide userId"
            });
        };

        const isChat = await Chat.find({
            isGroupChat:false,
            $and:[
                { users: { $elemMatch: { $eq: userId}}},
                { users: { $elemMatch: { $eq: id}}}
            ]
        }).populate("users")
        .populate({
            path:"latestMessage",
            populate:{
                path:"sender"
            }
        }).exec();

        if(isChat.length>0){
            return res.status(200).json({
                success:true,
                message:"Chat accessed",
                data:isChat
            });
        }else{
            const createChat = await Chat.create({
                isGroupChat:false,
                users:[id , userId],
                chatName:"sender"
            });

            const findChat = await Chat.find({_id:createChat._id}).populate("users");

            return res.status(200).json({
                success:true,
                message:"Chat created",
                data:findChat
            });
        };

    } catch (error) {
        console.log(error);
      return res.status(500).json({
        success:false,
        message:"Access chat controller issue"
      });
    };
};

exports.fetchChats = async (req , res) => {
    try {
        const {id} = req.user;
        if(!id){
            return res.json({
                success:false,
                message:"please provide userId"
            });
        };

        const findUser = await Chat.find({
            users:{ $elemMatch: {$eq: id}}
        }).populate("users")
        .populate("groupAdmin")
        .populate({
            path:"latestMessage",
            populate:{
                path:"sender"
            }
        }).sort({updatedAt: -1}).exec();

        return res.status(200).json({
            success:true,
            message:"Fetched all chats",
            data:findUser
        });

    } catch (error) {
        console.log(error);
      return res.status(500).json({
        success:false,
        message:"fetch chat controller issue"
      });
    };
};

exports.createGroupChat = async (req , res) => {
    try {
        const {users , name} = req.body;
        const {id} = req.user;

        if(!users || !name){
            return res.json({
                success:false,
                message:"please provide all details"
            });
        };

        const allUsers = JSON.parse(users);

        if(allUsers.length < 2){
            return res.json({
                success:false,
                message:"More than 2 users needed to create group"
            });
        };

        allUsers.push(id);

        const createGroup = await Chat.create({
            isGroupChat:true,
            users:allUsers,
            chatName:name,
            groupAdmin:id,
            groupLogo:"https://api.dicebear.com/6.x/initials/svg?backgroundType=gradientLinear"
        });

        const fullGroupDetails = await Chat.findById(createGroup._id).populate("users").populate("groupAdmin").populate({
            path:"latestMessage",
            populate:{
                path:"sender"
            }
        }).exec();

        return res.status(200).json({
            success:true,
            message:"group chat created",
            data:fullGroupDetails
        });

    } catch (error) {
        console.log(error);
      return res.status(500).json({
        success:false,
        message:"Cannot create group"
      });
    };
};

exports.renameGroup = async(req , res) => {
    try {
        const {name , chatId} = req.body;
        if(!chatId || !name){
            return res.json({
                success:false,
                message:"please provide all details"
            });
        };

        const rename = await Chat.findByIdAndUpdate(
            {_id:chatId},
            {
                chatName:name
            },
            {new:true}
        ).populate("users").populate("groupAdmin").populate({
            path:"latestMessage",
            populate:{
                path:"sender"
            }
        }).exec();

        return res.status(200).json({
            success:true,
            message:"group chat renamed",
            data:rename
        });

    } catch (error) {
        console.log(error);
      return res.status(500).json({
        success:false,
        message:"Cannot create group"
      });
    };
};

exports.addToGroup = async (req , res) => {
    try {
        const {userId , chatId} = req.body;
        if(!chatId || !chatId){
            return res.json({
                success:false,
                message:"please provide all details"
            });
        };

        const addUser = await Chat.findByIdAndUpdate(
            {_id:chatId},
            {
                $push:{ users: userId}
            },
            {new:true}
        ).populate("users").populate("groupAdmin").populate({
            path:"latestMessage",
            populate:{
                path:"sender"
            }
        }).exec();
        
        if(!addUser){
            return res.json({
                success:false,
                message:"Group not found"
            });
        };

        return res.status(200).json({
            success:true,
            message:"user added to group",
            data:addUser
        });

    } catch (error) {
        console.log(error);
      return res.status(500).json({
        success:false,
        message:"Cannot create group"
      });
    };
};

exports.removeFromGroup = async (req , res) => {
    try {
        const {userId , chatId} = req.body;
        if(!chatId || !chatId){
            return res.json({
                success:false,
                message:"please provide all details"
            });
        };

        const removeUser = await Chat.findByIdAndUpdate(
            {_id:chatId},
            {
                $pull:{ users: userId}
            },
            {new:true}
        ).populate("users").populate("groupAdmin").populate({
            path:"latestMessage",
            populate:{
                path:"sender"
            }
        }).exec();

        if(!removeUser){
            return res.json({
                success:false,
                message:"Group not found"
            });
        };

        return res.status(200).json({
            success:true,
            message:"user removed from group",
            data:removeUser
        });
        
    } catch (error) {
        console.log(error);
      return res.status(500).json({
        success:false,
        message:"Cannot create group"
      });
    };
};

exports.deleteGroup = async (req , res) => {
    try {
        const {chatId} = req.body;
        if(!chatId){
            return res.json({
                success:false,
                message:"please provide all details"
            });
        };

        const deleteGroup = await Chat.findByIdAndDelete(chatId);
        const deleteMessages = await Message.deleteMany({
            chat:chatId
        });
        
        const {id} = req.user;
        if(!id){
            return res.json({
                success:false,
                message:"please provide userId"
            });
        };

        const findUser = await Chat.find({
            users:{ $elemMatch: {$eq: id}}
        }).populate("users")
        .populate("groupAdmin")
        .populate({
            path:"latestMessage",
            populate:{
                path:"sender"
            }
        }).exec();

        return res.status(200).json({
            success:true,
            message:"user removed from group",
            data:findUser
        });
        
    } catch (error) {
        console.log(error);
      return res.status(500).json({
        success:false,
        message:"Cannot create group"
      });
    };
};

exports.updateGroupPicture = async (req , res) => {
    try {
        const {chatId} = req.body;
        const groupImg = req.files.groupImg;

        const image = await uploadToCloudinary(
            groupImg,
            process.env.FOLDER_NAME,
            1000,
            1000
        ); 

        const updateGroup = await Chat.findByIdAndUpdate(
            {_id:chatId},
            {
                groupLogo:image.secure_url
            },
            {new:true}
        ).populate("users")
        .populate("groupAdmin")
        .populate({
            path:"latestMessage",
            populate:{
                path:"sender"
            }
        }).sort({updatedAt: -1}).exec();

        if(!updateGroup){
            return res.json({
                success:false,
                message:"Cannot update group logo",
            });
        };

        const {id} = req.user;

        if(!id){
            return res.json({
                success:false,
                message:"please provide userId"
            });
        };

        const findUser = await Chat.find({
            users:{ $elemMatch: {$eq: id}}
        }).populate("users")
        .populate("groupAdmin")
        .populate({
            path:"latestMessage",
            populate:{
                path:"sender"
            }
        }).sort({updatedAt: -1}).exec();

        return res.status(200).json({
            success:true,
            message:"Fetched all chats",
            data:findUser,
            updateGroup:updateGroup
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot update user!"
        }); 
    };
};

exports.sendMessage = async (req , res) => {
    try {
        const {message , chatId} = req.body;
        const {id} = req.user;
        
        if(!id || !message || !chatId){
            return res.json({
                success:false,
                message:"please provide all details"
            });
        };

        const newMessage = await Message.create({
            sender:id,
            content:message,
            chat:chatId
        });

        const fullMessage = await Message.findById(newMessage._id).populate("sender").populate({
            path:"chat",
            populate:{
                path:"users"
            }
        }).exec();

        await Chat.findByIdAndUpdate(
            {_id:chatId},
            {
                latestMessage:newMessage._id
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Message sent",
            data:fullMessage,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot update user!"
        }); 
    };
};

exports.allMessages = async (req , res) => {
    try {
        const {chatId} = req.body;
         if(!chatId){
            return res.json({
                success:false,
                message:"please provide all details"
            });
        };

        const messages = await Message.find({
            chat:chatId
        }).populate("sender").populate("chat").exec();

        return res.status(200).json({
            success:true,
            message:"All messages fetched!",
            data:messages
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot update user!"
        }); 
    };
};