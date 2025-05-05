const mongoose = require("mongoose");
require('dotenv').config();


const connectdb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDb connected succesfully");
    }catch(err){
        console.log("error connecting mongodb",err.message)
    }
}

module.exports = connectdb; 


