const express = require("express");
const router = express.Router();

const {
    searchUser,
    getUserDetails,
    updateUserDetails,
    updateUserPicture,
    getAllUsers,
    followUser,
    unFollowUser
} = require("../controllers/user");

const {
    auth
} = require("../middleware/auth");

router.get("/searchUser",auth,searchUser);
router.post("/getUserDetails",getUserDetails);
router.get("/getAllUsers",getAllUsers);
router.put("/updateUserDetails",auth,updateUserDetails);
router.put("/updateUserPicture",auth,updateUserPicture);
router.post("/followUser",auth,followUser);
router.post("/unFollowUser",auth,unFollowUser);

module.exports = router;