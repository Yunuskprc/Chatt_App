const express = require('express');
const router = express.Router();
const jwtToken = require('../middleware/JWT');
const { ROLE } = require('@prisma/client');
const userRepo = require('../repository/UserRepo');

router.post('/login', (req, res) => {
    const user_name = req.body.user_name;
    const password = req.body.password;
   return jwtToken.authtenticate(user_name,password,res)
});


router.post('/register', (req, res) => {
    const user_name = req.body.user_name;
    const password = req.body.password;
    const email = req.body.email;  
    
    userRepo.findUnique(user_name,email).then(user => {
        if (user == null) {
            userRepo.addUser(user_name,password,email).then(
                res.status(200).send("Registration Successful")
            ).catch(error=>{
                console.log(error)
            });
        }else{
            return res.status(400).send("Username or email has been used before")
        }

    }).catch(error => {
        console.error("User not found or an error occurred:", error);
        res.status(500).send({ message: "Something went wrong", error: error.message });
    })
});

module.exports = router;
