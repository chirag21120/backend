const express = require('express');
const User = require('../models/User');
const router = express.Router();

//Ceerate a user using Post "/api/auth/". Doesn't require auth
router.post('/',(req,res)=>{
    console.log(req.body);
    const user = User(req.body);
    user.save()
    res.send("hello");
})

module.exports = router