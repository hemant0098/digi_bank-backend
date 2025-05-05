const Account = require('../models/accountSchema');
const Transaction = require("../models/transactionSchema");
const { populate } = require('../models/userSchema');
const User = require("../models/userSchema");


const sendMoney = async (req, res) => {
  try {
    // 1) Pull only the fields you need
    const { recipientAccountNumber, amount } = req.body;
    const amt = Number(amount);               // ensure it’s a number
    const senderId = req.user._id;

    // 2) Fetch sender
    const senderAccount = await Account.findOne({ user: senderId });
    if (!senderAccount) {
      return res.status(404).json({ msg: "Sender account not found" });
    }

    // 3) Fetch recipient by its string number
    const recipientAccount = await Account.findOne({
      accountNumber: recipientAccountNumber
    });
    if (!recipientAccount || recipientAccount.user.toString() === senderAccount.user.toString()
    ) {
      return res.status(404).json({ msg: "Recipient account not found" });
    }

    // 4) Balance check
    if (senderAccount.balance < amt) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    // 5) Do the transfer
    senderAccount.balance -= amt;
    recipientAccount.balance += amt;
    await senderAccount.save();
    await recipientAccount.save();

    // 6) Record transaction
    const transaction = await Transaction.create({
      sender: senderAccount._id,
      receiver: recipientAccount._id,
      amount: amt,
      transactionType: "transfer",
      transactionDate: new Date()
    });

    return res.status(200).json({
      msg: "Transaction successful",
      transaction,
      senderBalance: senderAccount.balance,
      receiverBalance: recipientAccount.balance
    });

  } catch (err) {
    console.error("SendMoney Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const getTransaction = async (req, res) => {
  const userId = req.user._id;
  console.log(userId)
  try {
    //find user's account
    const userAccount = await Account.findOne({ user: userId });
    if (!userAccount) {
      return res.status(400).json({ msg: "User account not found" })
    }

    //find all transaction where user is sender or receiver
    const transactions = await Transaction.find({
      $or: [
        { sender: userAccount._id },
        { receiver: userAccount._id },

      ]
    })
      .populate({
        path: "sender",
        populate: {
          path: "user",
          model: "User",
          select: "name"
        }
      }
      )
      .populate({
        path: "receiver",
        populate: {
          path: "user",
          model: "User",
          select: "name"
        }
      }).sort({ transactionDate: -1 }); // latest transactions first

    const simpleTransactions = transactions.map(txn => ({
      senderName: txn.sender.user.name,
      receiverName: txn.receiver.user.name,
      amount: txn.amount,
      transactionType: txn.transactionType,
      transactionDate: txn.transactionDate.toISOString()
    }));

    return res.status(200).json({
      msg: "Transaction history fetched successfully",
      transactions: simpleTransactions,
      // transactions
    });
    

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Internal server error" })
  }
}

module.exports = { sendMoney, getTransaction }
