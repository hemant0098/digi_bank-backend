const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require("../models/userSchema");

const registerUser = async (req, res) => {
    //check for validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    //user registeration
    const { name, email, password } = req.body;
    try {
        //check if user already register
        let user = await User.findOne({ email });
        if (user) {
            console.log(`user already exists: ${user}`);
            return res.status(400).json({ msg: "User already exists" });
        }
        
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user
        user = new User({
            name,
            email,
            password: hashedPassword,
        });

        //save user
        await user.save();

        //generate JWT token after registration
        const payload = {
            id: user._id
        };
        const token = jwt.sign(payload, process.env.SKEY, { expiresIn: "24h" });

        //return token and user info
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

        res.status(200).json({ msg: "User created successfull" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error")
    }

}

//fetch users
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ msg: "User not found" })
        }
        res.status(200).json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
}

//user login
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    // console.log('Login request received:', req.body);

    try {
        //check if user exists
        const user = await User.findOne({ email });
        // console.log('User found:', user);
        if (!user) {
            // console.log('User not found for email:', email);
            return res.status(400).json({ msg: "User not found" })
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log('Password match:', isMatch);
        if (!isMatch) {
           return res.status(400).json({ msg: "Invalid Credentials" })
        }

        //generate JWT token
        const payload = {
                id: user._id
        };

        const token = jwt.sign(payload, process.env.SKEY, { expiresIn: "24h" });
        console.log('your token is', token)

        //return token and user info(without password)
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }catch(err){
        console.log(err.message);
        res.status(500).json({msg:"Server error"})
    }
}

module.exports = {
    registerUser,
    getUserById,
    userLogin
};