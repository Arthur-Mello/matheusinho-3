const { DataTypes, Op } = require('sequelize');
const { sequelize, User, Consulta } = require('../models');

async function fetchDataForMedico(id_medico) {
    const currentDate = new Date();



    return Consulta.findAll({
        where: {
            id_medico: id_medico,
            dataAgendada: {
                [Op.gte]: currentDate,
            },
        },
        order: [['dataAgendada', 'ASC']],
        limit: 5,
        include: [
            {
                model: User,
                as: 'paciente',
                attributes: ['username'],
            },
            {
                model: User,
                as: 'medico',
                attributes: ['username'],
            },
        ],

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

async function getAllConsultas(id_medico, page, pageSize) {
    try {
        const currentDate = new Date();


        const consultas = await Consulta.findAndCountAll({
            where: {
                id_medico: id_medico,
                dataAgendada: {
                    [Op.gte]: currentDate,
                },
            },
            order: [['dataAgendada', 'ASC']],
            offset: (page - 1) * pageSize,
            limit: pageSize,
            include: [
                {
                    model: User,
                    as: 'paciente',
                    attributes: ['username'],
                },
                {
                    model: User,
                    as: 'medico',
                    attributes: ['username'],
                },
            ],
        });

        return {
            rows: consultas.rows,
            count: consultas.count,
        };
    } catch (error) {

        console.error('Error fetching consultas:', error);
        throw error;
    }
}
async function getAllConsultasPast(id_medico, page, pageSize) {
    try {
        const currentDate = new Date();


        const consultas = await Consulta.findAndCountAll({
            where: {
                id_medico: id_medico,
                dataAgendada: {
                    [Op.lt]: currentDate,
                },
            },
            order: [['dataAgendada', 'ASC']],
            offset: (page - 1) * pageSize,
            limit: pageSize,
            include: [
                {
                    model: User,
                    as: 'paciente',
                    attributes: ['username'],
                },
                {
                    model: User,
                    as: 'medico',
                    attributes: ['username'],
                },
            ],
        });

        return {
            rows: consultas.rows,
            count: consultas.count,
        };
    } catch (error) {
        console.error('Error fetching consultas:', error);
        throw error;
    }
}
async function insertConsulta(informations) {
    try {
        const { id_paciente, id_medico, dataAgendada, prontuario = null, receita = null, atestado = null } = informations;

        const newConsulta = await Consulta.create({
            id_paciente,
            id_medico,
            dataAgendada,
            prontuario,
            receita,
            atestado,
        });

        return newConsulta;
    } catch (error) {
        console.error("Error inserting consultation:", error);
        throw error;
    }
}




async function getConsultaDetails(id) {
    try {
        const consulta = await Consulta.findOne({
            where: { id: id },
            include: [
                {
                    model: User,
                    as: 'paciente',
                    attributes: ['username'],
                },
                {
                    model: User,
                    as: 'medico',
                    attributes: ['username'],
                },
            ],
        });

        if (!consulta) {
            throw new Error("Consulta inexistente");
        }


        const dataAgendadaDate = new Date(consulta.dataAgendada);
        if (isNaN(dataAgendadaDate.getTime())) {
            throw new Error("Invalid date format");
        }

        const formattedDate = `${padZero(dataAgendadaDate.getDate())}/${padZero(dataAgendadaDate.getMonth() + 1)}/${dataAgendadaDate.getFullYear()} - ${padZero(dataAgendadaDate.getHours())}:${padZero(dataAgendadaDate.getMinutes())}`;
        const consultaWithFormattedDate = { ...consulta.dataValues, dataAgendada: formattedDate };



        return consultaWithFormattedDate;
    } catch (error) {
        throw error;
    }
}

function padZero(number) {
    return number < 10 ? `0${number}` : `${number}`;
}

async function updateProntuario(consultaId, prontuario) {
    try {
        await Consulta.update({ prontuario }, { where: { id: consultaId } });
    } catch (error) {
        console.error('Error updating prontuario:', error);
        throw error;
    }
}
async function updateReceita(consultaId, receita) {
    try {
        await Consulta.update({ receita }, { where: { id: consultaId } });
    } catch (error) {
        console.error('Error updating prontuario:', error);
        throw error;
    }
}
async function updateAtestado(consultaId, atestado) {
    try {
        await Consulta.update({ atestado }, { where: { id: consultaId } });
    } catch (error) {
        console.error('Error updating prontuario:', error);
        throw error;
    }
}

module.exports = { getAllConsultasPast, getFiveConsultas, getAllConsultas, insertConsulta, getConsultaDetails, updateProntuario, updateReceita, updateAtestado };
