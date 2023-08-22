const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 5*60,
    },
});

const sendVerificationEmail = async (email , otp) => {
    try {
        const sendingMail = await mailSender(email , "Signup Verification - Instagram", otp);
        console.log("Mail sent successfully - ", sendingMail);
    } catch (error) {
        console.log(error);
        console.log("Error occured while sending mail...");
    }
}
otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email , this.otp);
    next();
});

module.exports = mongoose.model("otpSchema",otpSchema);