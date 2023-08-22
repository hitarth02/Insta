const express = require("express");
const router = express.Router();

const {
    createPost,
    getSinglePost,
    getAllPosts,
    likePost,
    unLikePost,
    savePost,
    unSavePost,
    addComment,
    removeComment,
    deletePost,
    createReel,
    getAllReels
} = require("../controllers/post");

const {
    auth
} = require("../middleware/auth");

router.post("/createPost",auth,createPost);
router.post("/getSinglePost",auth,getSinglePost);
router.get("/getAllPosts",getAllPosts);
router.post("/likePost",auth,likePost);
router.post("/unLikePost",auth,unLikePost);
router.put("/savePost",auth,savePost);
router.put("/unSavePost",auth,unSavePost);
router.post("/addComment",auth,addComment);
router.delete("/removeComment",auth,removeComment);
router.delete("/deletePost",auth,deletePost);

router.post("/createReel",auth,createReel);
router.get("/getAllReels",getAllReels);
module.exports = router;