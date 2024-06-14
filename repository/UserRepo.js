const {PrismaClient} = require('@prisma/client');
const { all } = require('../routers/loginRouter');
const prisma = new PrismaClient();
const mailService = require('../service/MailService');
const sendMail = require('../service/MailService');


/**
 * This function Finds user from username and password
 * @param {*} user_name Login user name
 * @param {*} password Login user password
 * @returns user object
 */
async function findUserByUsernameAndPassword(user_name, password){
    return await prisma.user.findUnique({
        where:{
            user_name,
            password
        },
        select:{
            user_id:true,
            user_name:true,
            email:true,
            role:true
        }
    });
}

/**
 * This function registers the user
 * @param {*} user_name Username of the user to register
 * @param {*} password Password of the user to register
 * @param {*} email Email of the user to register
 * @returns Succes message
 */
async function addUser(user_name,password,email){
    const newUser = await prisma.user.create({
        data:{
            user_name: user_name,
            password: password,
            email: email,
        }
    })

    return "user created succes";
}

/**
 * This function Checks if the username and email address have been used before.
 * @param {*} user_name User name
 * @param {*} email Email adress
 * @returns user object
 */
async function findUnique(user_name, email) {
    const user = await prisma.user.findFirst({
        where: {
          OR: [
            { user_name },
            { email }
          ]
        }
    });

    return user;
}

/**
 * This function Finds the user using the user_id variable
 * @param {*} user_id User primary ID
 * @returns user object
 */
async function findUser(user_id){
    const user = await prisma.user.findUnique({
        where:{
            user_id:user_id
        }
    });

    return user;
}

/**
 * Finds the user profile using the user_id variable
 * @param {*} user_id User Primary ID
 * @returns user object
 */
async function findUserProfileInfo(user_id){
    const user = await prisma.userProfile.findUnique({
        where:{user_id:user_id},
        select: all
    })

    return user;
}

/**
 * This function Saves user profile information
 * @param {*} array user_id,phone_number,description, birth_date_year, birth_date_mount, birth_date_day, mail_verify, pP_full_url
 * @returns Succes Message
 */
async function saveUserProfileInfo(array){

    try{
        const newUserProfile = await prisma.userProfile.create({
            data:{
                user_id:array.user_id,
                phone_number:array.phone_number,
                description:array.description,
                birth_date_year:array.birth_date_year,
                birth_date_mount: array.birth_date_mount,
                birth_date_day: array.birth_date_day,
                mail_verify: array.mail_verify,
                pP_full_url:array.pP_full_url
            }
        });
    
        return "User profile created succes";
    }catch{
        return "User profile already created"
    }
}

/**
 * Delete user profile information
 * @param {*} user_id User Primary ID
 * @param {*} res Response object to client sending
 * @returns Succes Message
 */
async function deleteUserInfo(user_id, res){
    try {
        const deletedProfileInfo = await prisma.userProfile.delete({
            where: {
                user_id: user_id
            }
        });
        console.log("User profile deleted: " + deletedProfileInfo);
        return 'User profile deleted';
    } catch (error) {
        console.log(error);
        throw new Error('Failed to delete user profile');
    }
}

/**
 * This function works when the user verifies their e-mail address. Updates the mail_verift field.
 * @param {*} user_id User Primary ID
 * @param {*} value Mail verify value (0 unverify, 1 verify)
 * @returns Succes Message
 */
async function updateUserInfoMailVerify(user_id,value){
    try{
        const updatedProfileInfo = await prisma.userProfile.update({
            where:{
                user_id:user_id
            },
            data:{
                mail_verify:value
            }
        })

        return 'Updated succes';
    }catch(error){
        console.log(error);
    }
}

/**
 * This function generates a verification code. Saves to DB and sends e-mail
 * @param {*} array 
 * @returns Succes Message
 */
async function generateMailVerifyCode(array) {
    try {
        const newVerifyCode = await prisma.verify_codes.create({
            data: {
                code: array.code,
                is_completed: array.is_completed,  
                created_time: array.created_time,
                end_time: array.end_time,
                user_id: array.user_id
            }
        });

        findUser(array.user_id).then(user => {
            sendMail(user.email, 'Email Verification Code', `Your verification code is: ${array.code}`);
            console.log('mail send is succes');
        }).catch(error => {
            console.log(error)
        })

        return "Verify code generated";
    } catch (error) {
        deleteMailVerifyCode(array.user_id);
        throw new Error('Verify code not generated try again');
    }
}

/**
 * This function delete verify code to DB
 * @param {*} user_id User Primary Id
 * @returns Succes Message
 */
async function deleteMailVerifyCode(user_id){
    try{
        const deleteCode = await prisma.verify_codes.delete({
            where:{
                user_id:user_id
            }
        });
        console.log("Verify code deleted: " + deleteCode);
        return 'Verify code deleted';
    }catch(error){
        console.log(error);
    }
}

/**
 * Finds the email verification code from DB
 * @param {*} user_id User Primary ID
 * @returns user object
 */
async function findMailVerifyCode(user_id){
    try{
        const user  = await prisma.verify_codes.findUnique({
            where:{
                user_id:user_id
            }
        });

        return user;
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    findUserByUsernameAndPassword,
    addUser,
    findUnique,
    findUser,
    findUserProfileInfo,
    saveUserProfileInfo,
    deleteUserInfo,
    updateUserInfoMailVerify,
    generateMailVerifyCode,
    deleteMailVerifyCode,
    findMailVerifyCode 
};