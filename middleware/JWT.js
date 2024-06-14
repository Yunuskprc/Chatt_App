const jwt = require('jsonwebtoken');
const config = require('../config/authorization.json');
const userRepo = require('../repository/UserRepo');

const SECRET_KEY = "YourSecretKey";

/**
 * This function creates and returns a jwt token with the properties we want.
 * @param {*} user_id - The user_id of the user. Authentication is done with this parameter. 
 * @param {*} ROLE - It is the role parameter that the user has authority over.
 * @param {*} expSecond - Indicates how many seconds it will take for the token to expire.
 * @returns - JWT TOKEN
 */
function generateToken(user_id,ROLE, expSecond) {
    try {
        const token = jwt.sign({
            // You can add the features you want to have in the token here.
            // Queries on endpoints work with user_id. If you do not want to use user_id, you will need to edit the endpoints.
            user_id: user_id,
            ROLE: ROLE,
            exp: Math.floor(Date.now() / 1000) + expSecond,
            issuer: "Kopru"
        }, SECRET_KEY);
        return token;
    } catch (err) {
        console.log(err);
    }
}

/**
 * This function parses the parameters inside the token
 * @param {*} token - The token we want to parse
 * @returns - Parsed token object
 */
function tokenClaim(token) {
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.log('Token expired');
        }else if(err.name === 'JsonWebTokenError'){
            console.log('Token not found');
        }
        console.log('Token is invalid:', err.message);
    }
}

/**
 * This function Authenticates users
 * @param {*} user_name Login username
 * @param {*} password Login password
 * @param {*} res Returns a response object based on the input status
 */
function authtenticate(user_name,password,res){
    userRepo.findUserByUsernameAndPassword(user_name, password)
    .then(user => {
        if (user == null) {
            return res.status(404).send({ message: "User not found" });
        }
        const token = generateToken(user.user_id, user.role, 3600);
        res.status(200).send({
            message: "Login succes",
            token: token
        });
        return res;
    })
    .catch(error => {
        console.error("User not found or an error occurred:", error);
        res.status(500).send({ message: "Something went wrong", error: error.message });
    });
}

/**
 *
 * @param {*} token Token for authorization
 * @returns 
 */
function checkAuthorization(token) {

    const decodedToken = tokenClaim(token);
    if (!decodedToken || !decodedToken.ROLE) {
        return false;
    }
    const role = decodedToken.ROLE;
    const authorization = require('../config/authorization.json');
    const roles = authorization.roles;
    const paths = roles[role];

    if (paths) {
        return true;
    }
    return false;
}



/**
 *  this function Authorizes
 * @param {*} req - Request
 * @param {*} res - Response
 * @param {*} next - Next
 * @returns 
 */
function authorizeRole(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Unauthorized access: Authentication failed.');
    }

    const token = authHeader.split(" ")[1];
    const authorized = checkAuthorization(token);

    if (!authorized) {
        return res.status(403).send('You have no authority');
    }

    next(); 
}

module.exports = {
    generateToken,
    tokenClaim,
    authtenticate,
    authorizeRole
}