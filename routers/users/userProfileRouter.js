const express = require('express');
const router = express.Router();
const jwtToken = require('../../middleware/JWT');
const { ROLE } = require('@prisma/client');
const userRepo = require('../../repository/UserRepo');
const upload = require('../../middleware/upload');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

// Finds all profile information of the logged in user
router.get('/getProfileInfo',jwtToken.authorizeRole, (req,res)=>{
    const token = req.headers['authorization'].split(" ")[1];
    const user_id = jwtToken.tokenClaim(token).user_id;

    userRepo.findUserProfileInfo(user_id).
    then(userProfile => {
        if(userProfile == null){
            const data = {
                phone_number:"",
                pP_full_url:"",
                description:"",
                birth_date_year:"",
                birth_date_mount:"",
                birth_date_day:"",
                mailVerify:"",
                user_id:""
            }
            res.status(200).send(data)
        }else{
            res.send(userProfile)     
        }
    }).
    catch(error => {
        console.log(error)
        res.status(404).send(error)
    });
})

// Create profile information of the registered in user
router.post('/addProfileInfo', upload.single('image') ,jwtToken.authorizeRole, async (req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        
        const token = req.headers['authorization'].split(" ")[1];
        const data = {
            user_id: jwtToken.tokenClaim(token).user_id,
            phone_number: req.body.phone_number,
            description: req.body.description,
            birth_date_year: parseInt(req.body.birth_date_year, 10),
            birth_date_mount: parseInt(req.body.birth_date_mount, 10),
            birth_date_day: parseInt(req.body.birth_date_day, 10),
            mail_verify: 0,
            pP_full_url: req.file.path
        };

        const message = await userRepo.saveUserProfileInfo(data);
        res.status(200).send(message);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
})

// Delete all profile information of the logged in user
router.delete('/deleteProfileInfo', jwtToken.authorizeRole, async (req, res) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        const user_id = jwtToken.tokenClaim(token).user_id;

        userRepo.findUserProfileInfo(user_id).then(userProfile => { 
            const imagePath = userProfile.pP_full_url;
            fs.unlinkSync(imagePath);

        })

        const result = await userRepo.deleteUserInfo(user_id);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Generates email verification code
router.post('/generateMailVerifyCode', jwtToken.authorizeRole, async (req, res) => {
    const token = req.headers['authorization'].split(" ")[1];
    const user_id = jwtToken.tokenClaim(token).user_id;
    const currentDate = new Date();

    try {
        const userProfile = await userRepo.findUserProfileInfo(user_id);

        if (userProfile.mail_verify == 1) {
            return res.status(200).send('user mail already verified');
        } else if (userProfile.mail_verify == 0) {
            const verifyCode = Math.floor(100000 + Math.random() * 900000);

            const endTime = new Date(currentDate);
            endTime.setMinutes(endTime.getMinutes() + 3);

            const array = {
                code: verifyCode,
                is_completed: 0,
                created_time: currentDate,
                end_time: endTime,
                user_id: user_id
            };

            const generatedCode = await userRepo.generateMailVerifyCode(array);            
            return res.status(200).send(generatedCode);
        } else {
            return res.status(400).send('user not found try again');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error');
    }
});

//Performs email verification
router.post('/verificationCode',jwtToken.authorizeRole, async(req,res)=>{
    const token = req.headers['authorization'].split(" ")[1];
    const user_id = jwtToken.tokenClaim(token).user_id;
    const currentDate = new Date();
    const verifyCode = req.body.verifyCode;

    userRepo.findMailVerifyCode(user_id).then(field => {
        if(currentDate > field.end_time){
            userRepo.deleteMailVerifyCode(user_id);
            res.status(400).send('verification code has expired');
        }else{
            if(verifyCode == field.code){
                userRepo.updateUserInfoMailVerify(user_id,1);
                userRepo.deleteMailVerifyCode(user_id);

                res.status(200).send('mail adress verified');
            }else{
                res.status(400).send('verification code is wrong')
            }
        }
    });
    
})

module.exports = router;