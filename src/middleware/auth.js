const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

async function verifyToken(token) {
    try {
        let { email } = await jwt.verify(token, process.env.SECRET)        
        return email
    } catch (error) {
        throw new Error('Invalid or expired token')
    }
}


async function authorization(email) {
    try {
        let user = await userModel.findOne({ email: email });
        return user.email
    } catch (error) {
        throw new Error('You are not authorized')
    }
}

module.exports = {
    verifyToken,
    authorization
};



