const express = require("express");
const { check } = require("express-validator");
const { registerUser, getUserById, userLogin } = require("../controllers/userController")
const auth = require("../middleware/authMiddleWare")

const router = express.Router();

//post route for user registeration
router.post("/register",
    [
        check("name", "name is required").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password must be atleast 6 characters").isLength({ min: 6 }),
    ],
    registerUser
);

//login route 
router.post("/login", userLogin);

//get route for get user data
router.get("/:id", auth, getUserById)



module.exports = router;