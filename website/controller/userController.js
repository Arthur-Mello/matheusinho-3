const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const jwt = require("jsonwebtoken");
const User = require('../models/user')(sequelize, DataTypes);
const bcrypt = require('bcrypt');


async function createUser(userData) {
    try {
        const existingUser = await User.findOne({
            where: {
                email: userData.email,
            },
        });

        if (existingUser) {
            return "erroremailEmUso";
        }

        if (userData.password.length < 8) {
            return "errorsenhaCurta";
        }

        if (userData.confirmPassword !== userData.password) {
            return "errorsenhasDiferentes";
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Add the permissionLevel when creating a new user
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });
        return "success";
    } catch (error) {
        return "error";
    }
}


async function loginUser(userData) {
    try {
        const user = await User.findOne({
            where: {
                email: userData.email,
            },
        });
        console.log(!user || !(await bcrypt.compare(userData.password, user.password)));
        if (!user || !(await bcrypt.compare(userData.password, user.password))) {
            console.log("CAIU")
            return null;
        }
        console.log(config)
        const token = jwt.sign({ username: user.email }, config.secretKey, {
            expiresIn: '1h',
        });

        return token;
    } catch (error) {
        return null;
    }
}

//function getUser() {
//    return "success"
//}

module.exports = {
    createUser,
    loginUser
};