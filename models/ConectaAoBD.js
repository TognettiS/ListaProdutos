const Sequelize = require('sequelize');
const sequelize = new Sequelize('listaprodutos', 'root', 'mysql123', {
  host: "localhost",
  dialect: "mysql"
});

sequelize.authenticate().then(function() {
  console.log("Conectado ao Banco de Dados");
}).catch(function(erro) {
  console.log("Erro: " + erro);
});

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize
};
