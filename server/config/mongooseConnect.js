const mongoose = require("mongoose");
require("dotenv").config();

const mongooseConnect = () => {
    try {
        mongoose.connect(process.env.DATABASE_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        }).then(()=>{
            console.log("Successfully connected to database...");
        }).catch((error)=>{
            console.log("Cannot connect to database!!!");
            console.log(error);
            process.exit(1);
        });
    } catch (error) {
        console.log(error);
    };
};

module.exports = mongooseConnect;