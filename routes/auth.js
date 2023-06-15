const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
//Ceerate a user using Post "/api/auth/". Doesn't require auth
router.post('/createuser',[
    //validators, used to check the input
    body('name',"Enter a valid name").isLength({min:3}),
    body('email',"Enter a valid email").isEmail(),
    body('password',"password must be atleast 8 characters").isLength({min:8})
], async (req,res)=>{
    const errors = validationResult(req);
    //agar errors hai toh return
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(404).json({error: "User with this email already exists"})
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    //creating the user if email unique
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
    })
    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    
    res.json({authtoken});
}
catch(error){
    console.log(error.message);
    res.status(500).send("Some error occured!")
}
})

module.exports = router