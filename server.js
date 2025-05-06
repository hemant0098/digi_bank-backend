const express = require("express");
const app = express();
const db = require("./db.js")
const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require('./routes/transactionRoutes');
const cors = require('cors');


const corsOptions = {
    // origin: ['https://digi-bank-frontend.vercel.app', 'https://digi-bank-frontend-git-main-hemant-devgans-projects.vercel.app'], // Allow only frontend to access
    origin: ['https://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
    credentials: true,  // Allow credentials (cookies, Authorization tokens)
};
app.options(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db();

app.get("/", (req, res) => {
    res.send("Welcome to the node tutorial")
});

app.use("/api/account", accountRoutes);

app.use('/api/transactions', transactionRoutes);

app.use("/api/user", userRoutes);
app.listen(5000, '0.0.0.0', () => {
    console.log("listening on port 5000")
})
