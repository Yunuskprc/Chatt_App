const express = require('express');
const router = express.Router();
const jwtToken = require('../middleware/JWT');
const userProfileRouter = require('./users/userProfileRouter');
const createUserChatRouter = require('./users/userChatRouter');

module.exports = (io) => {
    const userChatRouter = createUserChatRouter(io); 

    // profile information operation 
    router.use('/profile', userProfileRouter);

    //chat operation
    router.use('/chat', userChatRouter);

    return router;
};
