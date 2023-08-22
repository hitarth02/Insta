const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req , res , next) => {
    try {
        const token = req.body.token || req.cookies.Token || req.header("Authorization").replace("Bearer ","") ;
        if(!token){
            return res.status(401).json(
                {
                    success:false,
                    message:"Token not found!",
                }
            );
        };
        try {
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload;

        } catch (error) {
            console.log(error);
            return res.status(401).json(
                {
                    success:false,
                    message:"couldn't verify token!",
                    error:error.message
                }
            )
        };
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json(
            {
                success:false,
                message:"Authorization failed!",
                error:error.message,
            }
        )
    };
};