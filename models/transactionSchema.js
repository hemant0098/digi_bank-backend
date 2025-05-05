const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:true,
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min:[0,"Ammount cannot be negative"]
    },
    transactionType:{
        type:String,
        enum:["deposit","withdraw","transfer"],
        required:true
    },
    transactionDate:{
        type:Date,
        default:Date.now
    }
});

const Transaction = mongoose.model("Transaction",transactionSchema);
module.exports = Transaction;