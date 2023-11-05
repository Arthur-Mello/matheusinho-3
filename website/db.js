const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

sequelize.authenticate()
  .then(function () {
    console.log('Conexão realizada com sucesso!');
  })
  .catch(function (err) {
    console.error('Erro na conexão:', err);
  });

module.exports = sequelize;
