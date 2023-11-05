const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');

const User = require('../models/user')(sequelize, DataTypes);
const bcrypt = require('bcrypt');

async function createUser(userData) {
    try {
        const existingUser = await User.findOne({
            where: {
                email: userData.email,
            },
        }).catch((error) => {
            return "error"
        });
        if (existingUser) {
            console.log("passou aqui")
            return "emailEmUso";
        }
        if (userData.password.length < 8) {
            return "senhaCurta";
        }
        if (userData.confirmPassword != userData.password) {
            return "senhasDiferentes";
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({ ...userData, password: hashedPassword });
        return "success";
    } catch (error) {
        return "error";
    }
}

//function getUser() {
//    return "success"
//}

module.exports = {
    createUser
  //  getUser
};