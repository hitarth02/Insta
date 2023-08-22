const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongooseConnect = require("./config/mongooseConnect");
const fileUpload = require("express-fileupload");
const {cloudinaryConnect} = require("./config/cloudinaryConnect");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/Auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const chatRoutes = require("./routes/chat");

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"*",
        credentials:true,
    })
);
app.use(
    fileUpload({
       useTempFiles: true,
       tempFileDir: "/tmp",
    })
);

PORT = process.env.PORT || 5000;
mongooseConnect();
cloudinaryConnect();

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/post",postRoutes);
app.use("/api/v1/chat",chatRoutes);

const server = app.listen(PORT,()=>{
    console.log(`Your server is running at PORT: ${PORT}`);
});

app.get("/",(req , res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running..."
    });
});

const io = require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    },
});

io.on("connection",(socket)=>{
    console.log("Connected to Socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("joinChat",(room)=>{
        socket.join(room);
        console.log("User joined room", room);
    });

    socket.on("typing",(room)=>{
        socket.in(room).emit("typing");
    });

    socket.on("stopTyping",(room)=>{
        socket.in(room).emit("stopTyping");
    });

    socket.on("newMessage",(newMessageRecived)=>{
        let chat = newMessageRecived.chat;
        if(!chat) return console.log("chat.user is not defined");

        chat.users.forEach(user => {
            if(user._id == newMessageRecived.sender._id) return;
            console.log(user._id,user.firstName);
            socket.in(user._id).emit("messageRecived",newMessageRecived);
        });
    })
});