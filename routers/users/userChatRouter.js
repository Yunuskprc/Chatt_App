const express = require('express');
const router = express.Router();
const jwtToken = require('../../middleware/JWT');
const { ROLE } = require('@prisma/client');
const userRepo = require('../../repository/UserRepo');
const chatRepo = require('../../repository/ChatRepo');
const path = require('path');

module.exports = (io) => {
    // this router add chat member
    router.post('/addChatMember', jwtToken.authorizeRole, async (req, res) => {
        try {
            const token = req.headers['authorization'].split(" ")[1];
            const user1_id = jwtToken.tokenClaim(token).user_id;

            const user = await chatRepo.findUserIdByPhoneNumber(req.body.phone_number);
            const user2_id = user.user_id;

            //check is made to see if users have registered each other before.
            const isUnique = await chatRepo.memberIsUnique(user1_id, user2_id);
            if (isUnique != null) {
                res.status(400).send('member is already registered');
                return;
            }

            const record_name = req.body.record_name;

            let { status: statusCode, chat_id: chatId } = await chatRepo.saveChatMember(user1_id, user2_id);
            
            //The registered user automatically saves the registered user with his/her phone number.
            const phone_number = await userRepo.findUserProfileInfo(user1_id);
            let { status: statusCodeRecord, savedRecord: savedRecord } = await chatRepo.savedRecordName(user1_id, user2_id, record_name, chatId);
            let { status: statusCodeRecordReverse, savedRecord: savedRecordReverse } = await chatRepo.savedRecordName(user2_id, user1_id, phone_number.phone_number, chatId);

            if (statusCode == 200 && statusCodeRecord == 200 && statusCodeRecordReverse == 200) {
                res.status(200).send('The person has been added to your member list');
            } else {
                res.status(400).send('The person could not be added to your member list');
            }
        } catch (error) {
            console.log(error);
            res.status(400).send('Error occurred');
        }
    });

    // this router deleted chat member
    router.delete('/deleteChatMember', jwtToken.authorizeRole, async (req, res) => {
        try {
            const token = req.headers['authorization'].split(" ")[1];
            const user1_id = jwtToken.tokenClaim(token).user_id;
            const user2_id = req.body.user2_id;
            const chat_id = req.body.chat_id;

            let statusCode = await chatRepo.deleteChatMember(user1_id, user2_id, chat_id);
            let statusCodeRecord = await chatRepo.deleteRecordName(user1_id, user2_id, chat_id);
            if (statusCode == 200 && statusCodeRecord == 200) {
                res.status(200).send('the contact has been deleted from your member list');
            } else {
                res.status(400).send('The contact could not be deleted from your member list');
            }
        } catch (error) {
            console.log(error);
            res.status(400).send('Error occurred');
        }
    });

    // this router finds all registered member
    router.get('/getAllChatsMember', jwtToken.authorizeRole, async (req, res) => {
        try {
            const token = req.headers['authorization'].split(" ")[1];
            const user1_id = jwtToken.tokenClaim(token).user_id;
            const users = await chatRepo.findChatMembers(user1_id);

            const data = [];
            for (const user of users) {
                const record = await chatRepo.findRecord(user1_id, user.user2_id, user.chat_id);
                const userInfo = await userRepo.findUserProfileInfo(user.user2_id);
                data.push({
                    user_id: user.user2_id,
                    chat_id: user.chat_id,
                    record_name: record.record_name,
                    phone_number: userInfo.phone_number,
                    pP_full_url: `/static/image/${path.basename(userInfo.pP_full_url)}`,
                    description: userInfo.description
                });
            }

            res.status(200).send(data);
        } catch (error) {
            console.log(error);
            res.status(400).send('Error occurred');
        }
    });

    // finds all messages between two chatting users
    router.get('/getAllMessages', jwtToken.authorizeRole, async (req, res) => {
        try {
            const token = req.headers['authorization'].split(" ")[1];
            const user1_id = jwtToken.tokenClaim(token).user_id;
            const user2_id = req.body.user2_id;

            const data = await chatRepo.findChatMessage(user1_id, user2_id);

            res.status(200).send(data);
        } catch (error) {
            console.log(error);
            res.status(400).send('message not found try again');
        }
    });

    // Allows users to send messages to each other
    router.post('/sendMessage', jwtToken.authorizeRole, async (req, res) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const user1_id = jwtToken.tokenClaim(token).user_id;

            const data = {
                user1_id: user1_id,
                user2_id: req.body.user2_id,
                chat_id: req.body.chat_id,
                content: req.body.content,
                sending_at: new Date()
            };

            const statusCode = await chatRepo.sendMessage(data);

            if (statusCode === 200) {
                // Socket.io Emitted with newMessage event
                io.emit('newMessage', data);
                res.status(200).send('Message sent successfully');
            } else {
                res.status(400).send('Message could not be sent');
            }
        } catch (error) {
            console.log(error);
            res.status(400).send('message could not be sent');
        }
    });

    // Creating sockets
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('sendMessage', (data) => {
            console.log('Message received:', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return router;
};
