const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();

//Ceerate a user using Post "/api/auth/". Doesn't require auth
router.post('/',[
    body('name',"Enter a valid name").isLength({min:3}),
    body('email',"Enter a valid email").isEmail(),
    body('password',"password must be atleast 8 characters").isLength({min:8})
],(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(user=>res.json(user))
    .catch(err=>{console.log(err)
    res.json({error:"please Enter correct value"})})
    // res.send("hello");
})

module.exports = router