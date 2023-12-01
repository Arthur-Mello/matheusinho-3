const { DataTypes } = require('sequelize');
const { sequelize } = require('../models');
const Consulta = require('../models/consulta')(sequelize, DataTypes);

async function fetchDataForMedico(id_medico) {
    const currentDate = new Date(); // Replace this with your actual current date
    const currentBRTDate = new Date(currentDate.getTime() - 3 * 60 * 60 * 1000); // Convert to Brasília time (BRT)

    return Consulta.findAll({
        where: {
            id_medico: id_medico,
            data: {
                [sequelize.Sequelize.Op.gte]: currentBRTDate,
            },
            horarioAgendado: {
                [sequelize.Sequelize.Op.gte]: currentBRTDate,
            },
        },
        order: [['data', 'ASC'], ['horarioAgendado', 'ASC']],
        limit: 5,
    });
}

async function getFiveConsultas(id_medico) {
    try {
        const consultas = await fetchDataForMedico(id_medico);
        return consultas;
    } catch (error) {
        console.error('Error fetching consultas:', error);
        throw error;
    }
}

module.exports = getFiveConsultas;
