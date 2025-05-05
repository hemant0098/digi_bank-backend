const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require('../models/userSchema'); // Make sure to import User model

const authMiddleWare = async (req, res, next) => {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, Authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.SKEY);  // Ensure you use your secret key here
        
        // Fetch user data from the database using the decoded ID
        const user = await User.findById(decoded.id); // Assuming `decoded.id` contains the user ID
        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        req.user = user;  // Set the entire user object, not just the id
        next();  // Proceed to the next middleware/route handler
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ msg: "Token is not valid" });
    }
};

module.exports = authMiddleWare;
