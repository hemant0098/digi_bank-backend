const express = require("express");
const router = express.Router();
const { createAccount, getAccount } = require("../controllers/accountController");
const auth = require("../middleWare/authMiddleWare");

//protected route
router.post("/create", auth, createAccount)
router.get("/view", auth, getAccount);


module.exports = router;