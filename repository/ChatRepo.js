const {PrismaClient} = require('@prisma/client');
const { all } = require('../routers/loginRouter');
const prisma = new PrismaClient();

/**
 * This function accesses the user_id value from the phone number.
 * @param {*} phone_number User phone number
 * @returns User objects
 */
async function findUserIdByPhoneNumber(phone_number){
    try{
        const user = await prisma.userProfile.findUnique({
            where:{
                phone_number:phone_number
            }
        })
    
        return user
    }catch(error){
        console.log(error);
    }
}

/**
 * This function checks whether the people who will speak have already been registered before adding them to the directory.
 * @param {*} user1_id 1st user to talk to
 * @param {*} user2_id 2st user to talk to
 * @returns user object
 */
async function memberIsUnique(user1_id,user2_id){
    try{
        const user = await prisma.chat_members.findMany({
            where:{
                user1_id:user1_id,
                user2_id:user2_id
            }
        });

        return user;
    }catch(error){
        console.log(error);
    }
}

/**
 * This function allows 2 users to start a chat with each other
 * @param {*} user1_id 1st user to talk to
 * @param {*} user2_id 2st user to talk to
 * @returns Returns status object and chat_id variable
 */
async function saveChatMember(user1_id,user2_id){
    try{
        const savedMember = await prisma.chat_members.create({
            data:{
                user1_id:user1_id,
                user2_id:user2_id
            }
        });
        return {status:200,chat_id:savedMember.chat_id};
    }catch(error){
        console.log(error);
    }
}

/**
 * This function saves the name of the user to be registered
 * @param {*} user1_id 1st user to talk to
 * @param {*} user2_id 2st user to talk to
 * @param {*} record_name Name of the chat 
 * @param {*} chat_id ID value of the chat 
 * @returns Returns status object and savedRecord variable
 */
async function savedRecordName(user1_id,user2_id,record_name,chat_id){
    try{
        const savedRecord = await prisma.record_name.create({
            data:{
               record_name:record_name,
               chat_id:chat_id,
               recorder_user:user1_id,
               recorded_user:user2_id 
            }  
        });
        return {status:200,savedRecord:savedRecord};
    }catch(error){
        console.log(error);
    }
}

/**
 * This function delete chat member
 * @param {*} user1_id 1st user to talk to
 * @param {*} user2_id 2st user to talk to
 * @param {*} chat_id ID value of the chat
 * @returns Status code 200
 */
async function deleteChatMember(user1_id,user2_id,chat_id){
    try{    
        const deletedChatMember = await prisma.chat_members.delete({
            where:{
                user1_id:user1_id,
                user2_id:user2_id,
                chat_id:chat_id
            }
        });

        return 200;
    }catch(error){
        console.log(error)
    }
}

/**
 * This function delete user record name 
 * @param {*} user1_id 1st user to talk to
 * @param {*} user2_id 2st user to talk to
 * @param {*} chat_id ID value of the chat
 * @returns Status code 200
 */
async function deleteRecordName(user1_id,user2_id,chat_id){
    try{
        const deletedRecord = await prisma.record_name.delete({
            where:{
                recorder_user:user1_id,
                recorded_user:user2_id,
                chat_id:chat_id
            }
        })

        return 200;
    }catch(error){
        console.log(error);
    }
}

/**
 * all people the user has talked to
 * @param {*} user1_id 1st user to talk to
 * @returns all members object
 */
async function findChatMembers(user1_id){
    try{
        const allMembers = await prisma.chat_members.findMany({
            where:{user1_id:user1_id}
        })
        return allMembers;
    }catch(error){
        console.log(error);
    }
}

/**
 * Returns the user's saved name
 * @param {*} user1_id 1st user to talk to
 * @param {*} user2_id 2st user to talk to
 * @param {*} chat_id ID value of the chat
 * @returns records objects
 */
async function findRecord(user1_id,user2_id,chat_id){
    try{
        const records = await prisma.record_name.findFirst({
            where:{
                recorder_user:user1_id,
                recorded_user:user2_id,
                chat_id:chat_id
            }
        });

        return records
    }catch(error){
        console.log(error);
    }
}

/**
 * Returns all conversations between two users
 * @param {*} user1_id 1st user to talk to
 * @param {*} user2_id 2st user to talk to
 * @returns 
 */
async function findChatMessage(user1_id,user2_id){
    try{
        const chatMember = await prisma.chat_members.findFirst({
            where: {
                OR: [
                    {
                        user1_id: user1_id,
                        user2_id: user2_id
                    },
                    {
                        user1_id: user2_id,
                        user2_id: user1_id
                    }
                ]
            }
        });

        const messages = await prisma.messages.findMany({
            where:{
                chat_id:chatMember.chat_id
            }
        })
        return messages;

    }catch(error){
        console.log(error);
    }
}

/**
 * Allows users to send messages
 * @param {*} data user1_id,user2_id,chat_id,content,sendingAt
 * @returns status code 200
 */
async function sendMessage(data){
    try{
        const message = await prisma.messages.create({
            data:{
                user1_id:data.user1_id,
                user2_id:data.user2_id,
                chat_id:data.chat_id,
                content:data.content,
                sending_at:data.sending_at
            }
        });

        return 200;
    }catch(error){
        console.log(error);
        return 400;
    }

}


module.exports = {
    findUserIdByPhoneNumber,
    memberIsUnique,
    saveChatMember,
    savedRecordName,
    deleteChatMember,
    deleteRecordName,
    findChatMembers,
    findRecord,
    findChatMessage,
    sendMessage,
    
}