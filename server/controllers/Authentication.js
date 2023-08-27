const User = require("../models/user");
const OTP = require("../models/OTP");
const bcryptjs = require("bcryptjs");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

exports.signupToken = async (req , res) => {
    try {
        const {email} = req.body;

        if(!email){
            return res.json({
                success:false,
                message:"Email not found"
            });
        };

        const userExists = await User.findOne({email:email});
        if(userExists){
            return res.json({
                success:false,
                message:"User already exists!"
            });
        };

        var otp = otpGenerator.generate(4 , {
            digits:true,
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false,
        });

        let otpExists = await OTP.findOne({otp: otp});
        while(otpExists){
            otp = otpGenerator.generate(6 , {
                digits:true,
                lowerCaseAlphabets:false,
                upperCaseAlphabets:false,
                specialChars:false,
            });
            otpExists = await OTP.findOne({otp: otp});
        };

        const createOtp = await OTP.create({
            email:email,
            otp:otp,
        });

        return res.status(200).json({
            success:true,
            message:"Otp created successfully!",
            data:createOtp,
        });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Signup controller issue"
      });
    };
};

exports.signup = async (req , res) => {
    try {
        const {firstName , lastName , email , userName , password ,otp} = req.body;

        if(!firstName || !lastName || !email || !password || !otp ){
            return res.json({
                success:false,
                message:"Fill all the details!"
            });
        };

        const userExists = await User.findOne({email:email});
        if(userExists){
            return res.json({
                success:false,
                message:"User already exists!"
            });
        };

        const recentOtp = await OTP.find({email:email}).sort({createdAt:-1}).limit(1);
        console.log("recent otp is :" ,  recentOtp);

        //*validate OTP
        if(recentOtp.length == 0){
            return res.status(400).json(
                {
                    success:false,
                    message:"OTP NOT FOUND",
                }
            );
        }else if(otp !== recentOtp[0].otp){
                return res.status(400).json(
                    {
                        success:false,
                        message:"OTP NOT MATCH",
                    }
                );
        };

        const hashedPassword = await bcryptjs.hash(password,10);

        const createUser = await User.create({
            firstName:firstName,
            lastName:lastName,
            email:email,
            userName:userName,
            password:hashedPassword,
            userImage:`https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(200).json({
            success:true,
            message:"Signup successfull!",
            data:createUser,
        });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Signup controller issue"
      });  
    };
};


exports.login = async (req , res) => {
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.json({
                success:false,
                message:"Email or password not found"
            });
        };

        let user = await User.findOne({email:email},{
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
            password:true,
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
        .exec();;

        if(!user){
            return res.json({
                success:false,
                message:"user not found"
            });
        };

        if(await bcryptjs.compare(password , user.password)){
            const payload = {
                id:user._id,
                email:user.email,
            };
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn:"20d",
            });

            user = user.toObject();
            user.token = token;
    
            return res.cookie("Token" , token , {
                expires: new Date(Date.now() + 7*24*60*60*1000),
                httpOnly:true,
            }).status(200).json({
                success:true,
                message:"Logged in",
                data:token,
                user:user,
            });
        }else{
            return res.json({
                success:"false",
                message:"Invalid password!",
            });
        };

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Login controller issue"
      });
    };
};