const express = require("express");
const router = express.Router();

const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
    deleteGroup,
    updateGroupPicture, 
    //*SEND MESSAGES
    sendMessage,
    allMessages
} = require("../controllers/chat");

const {
    auth
} = require("../middleware/auth");

router.post("/accessChat",auth,accessChat);
router.get("/fetchChats",auth,fetchChats);
router.post("/createGroupChat",auth,createGroupChat);
router.put("/renameGroup",auth,renameGroup);
router.put("/addToGroup",auth,addToGroup);
router.put("/removeFromGroup",auth,removeFromGroup);
router.put("/updateGroupPicture",auth,updateGroupPicture);
router.delete("/deleteGroup",auth,deleteGroup);
//*SEND MESSAGE
router.post("/sendMessage",auth,sendMessage);
router.post("/allMessages",auth,allMessages);
module.exports = router;