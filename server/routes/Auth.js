const express = require("express");
const router = express.Router();

const {
    signupToken,
    signup,
    login
} = require("../controllers/Authentication");

router.post("/signupToken",signupToken);
router.post("/signup",signup);
router.post("/login",login);

module.exports = router;