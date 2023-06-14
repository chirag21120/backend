const  mongoose = require("mongoose");

const dotenv = require('dotenv')
dotenv.config();

const mongoURI = process.env.MONGODB_URI ;
const connectToMongo = ()=>{mongoose.connect(mongoURI,{
    useNewUrlParser : true
}).then(()=>{console.log("Connected to dataBase");})
.catch(e=>{console.log(e);})}

module.exports = connectToMongo;