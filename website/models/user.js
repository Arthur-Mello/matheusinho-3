module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    permissionLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  User.associate = (models) => {
    User.belongsToMany(models.Consulta, {
      through: 'UserConsulta',
      as: 'consultasPaciente',
      foreignKey: 'id_paciente',
    });

    User.belongsToMany(models.Consulta, {
      through: 'UserConsulta',
      as: 'consultasMedico',
      foreignKey: 'id_medico',
    });
  };

  return User;
};
