module.exports = (sequelize, DataTypes) => {
  const Consulta = sequelize.define('Consulta', {
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dataAgendada: {
      type: DataTypes.DATE,
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
  }, {
    sequelize,
    modelName: 'Consulta',
    tableName: 'Consultas',
  });

  Consulta.associate = (models) => {
    
    Consulta.belongsTo(models.User, {
      as: 'paciente',
      foreignKey: 'id_paciente',
    });
    
    Consulta.belongsTo(models.User, {
      as: 'medico',
      foreignKey: 'id_medico',
    });
    
  };

  return Consulta;
};
