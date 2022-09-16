const bd = require('./ConectaAoBD');
const Produto = bd.sequelize.define('produto', {
  nome: {
    type: bd.Sequelize.STRING
  },
  descricao: {
    type: bd.Sequelize.STRING
  },
  imagem: {
    type: bd.Sequelize.STRING
  }
});

Produto.sync({ force: false });

module.exports = Produto;
