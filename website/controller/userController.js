const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const jwt = require("jsonwebtoken");
const User = require('../models/user')(sequelize, DataTypes);
const bcrypt = require('bcrypt');

const permissionLevel = {
    0: "Paciente",
    1: "Médico",
    2: "Admin"
}

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
        
        if (!user || !(await bcrypt.compare(userData.password, user.password))) {
            return null;
        }

        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, cargo: permissionLevel[user.permissionLevel] }, config.secretKey, {
            expiresIn: '1h',
        });

        return token;
    } catch (error) {
        return null;
    }
}

async function getUser(id) {
    try {
        const user = await User.findOne({ where: { id: id } });

        if (!user) {
            throw new Error("Usuario Inexistente");
        }

        return user;
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    try {
        const users = await User.findAll()
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser,
    loginUser
};