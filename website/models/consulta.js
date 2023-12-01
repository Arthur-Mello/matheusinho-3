'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Consulta extends Model {
    static associate(models) {
      Consulta.belongsTo(models.User, { foreignKey: 'id_paciente', as: 'paciente' });
      Consulta.belongsTo(models.User, { foreignKey: 'id_medico', as: 'medico' });
    }
  }
  Consulta.init(
    {
      id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_medico: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      horarioAgendado: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      prontuario: {
        type: DataTypes.STRING,
      },
      receita: {
        type: DataTypes.STRING,
      },
      atestado: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Consulta',
      tableName: 'Consultas',
    }
  );
  return Consulta;
};
