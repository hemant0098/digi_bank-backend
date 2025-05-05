const Account = require('../models/accountSchema');
const User = require('../models/userSchema'); // To fetch user's name

function generateAccountNumber() {
    return Math.floor(10000000 + Math.random() * 90000000).toString(); // 8 digit random
}

exports.createAccount = async (req, res) => {
    try {
        // Ensure that req.user._id is present and valid
        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: 'User ID is missing in the request.' });
        }

        console.log('User in request:', req.user._id);

        const existingAccount = await Account.findOne({ user: req.user._id });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists' });
        }

        // Fetch the user's name from the User model
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userName = user.name || "Unknown"; // Default to "Unknown" if name is not found

        const newAccount = new Account({
            user: req.user._id,
            accountNumber: generateAccountNumber(),
            balance: 0,
            name: userName // Setting name here
        });

        await newAccount.save();

        res.status(201).json({ message: 'Account created successfully', account: newAccount });
    } catch (error) {
        console.error('Create Account Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAccount = async (req, res) => {
    try {
        const userId = req.user._id;      // set by your auth middleware
        const account = await Account.findOne({ user: userId });
        // console.log(userId);
        // console.log(account);

        if (!account) {
            return res.status(404).json({ msg: "Account not found" });
        }
        res.status(200).json({ account });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};