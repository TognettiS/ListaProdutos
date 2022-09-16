const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const Produto = require("./models/CriaTabela.js");
const fileUpload = require('express-fileupload');
const path = require('path');

ConfiguraBibliotecas(app);

app.get("/", function(req, res) {
  Produto.findAll().then(function(Produto) {
    res.render('home', { produto: Produto });
  })
});

app.get("/cadastro", function(req, res) {
  res.render('cadastro');
});

app.post("/cadastro", function(req, res) {
  VerificaImagem(req, res);
  CadastraValores(req, res, nomeimagem);
});

app.get("/editar/:id", function(req, res) {
  globalThis.ID = req.params.id;
  res.redirect('/editar');
});

app.get("/editar", function(req, res) {
  res.render('editar');
});

app.post('/editar', function(req, res) {
  EditaImagem(req, res);
});

app.get("/deletar/:id", function(req, res) {
  ExcluirItem(req, res);
});

app.listen(8081, function() {
  console.log("Server Aberto");
});

function ConfiguraBibliotecas(app) {
  app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  }));
  app.set('view engine', 'handlebars');

  app.use(bodyParser.urlencoded({ extended: false })); app.use(bodyParser.json());
  app.use(express.static(__dirname + '/assets'));
  app.use(fileUpload());
}
function VerificaImagem(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    globalThis.nomeimagem = 'PlaceHolder.png';
  }
  else {
    let imagem = req.files.Imagem; globalThis.nomeimagem = imagem.name

    ArmazenaImagem(imagem);
  }
}
function CadastraValores(req, res, nomeimagem) {
  Produto.create({
    nome: req.body.Nome,
    descricao: req.body.Descricao,
    imagem: nomeimagem
  }).then(function() {
    res.redirect('/');
    console.log("Cadastrado com Sucesso");
  }).catch(function(erro) {
    res.send("Houve erro: " + erro);
    console.log("Houve erro: " + erro);
  });
  console.log(req.body.Descricao);
}
function ArmazenaImagem(imagem) {
  let caminho;

  caminho = __dirname + '/assets/Images/' + imagem.name;

  imagem.mv(caminho, function(erro) {
    if (erro) return res.status(500).send(erro);
  });
}
function EditaImagem(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    Produto.findOne({ where: { "id": ID } }).then(function(Produto) {
      nomeimagem = Produto.get('imagem');
      VerificaOpcoes(req, res);
    });
  }
  else {
    let imagem = req.files.Imagem;
    nomeimagem = imagem.name;
    ArmazenaImagem(imagem);
    VerificaOpcoes(req, res);
  }
}
function VerificaOpcoes(req, res) {
  let nomenovo, descricaonova;

  switch (true) {
    case req.body.Nome == '' && req.body.Descricao == '':
      console.log(descricaonova);
      EditaValores(req, res, nomenovo, descricaonova, nomeimagem);
      break;
    case req.body.Nome != '' && req.body.Descricao != '':
      nomenovo = req.body.Nome; descricaonova = req.body.Descricao;
      console.log(descricaonova);
      EditaValores(req, res, nomenovo, descricaonova, nomeimagem);
      break;
    case req.body.Nome != '' && req.body.Descricao == '':
      nomenovo = req.body.Nome;
      console.log(descricaonova);
      EditaValores(req, res, nomenovo, descricaonova, nomeimagem);
      break;
    case req.body.Nome == '' && req.body.Descricao != '':
      descricaonova = req.body.Descricao;
      console.log(descricaonova);
      EditaValores(req, res, nomenovo, descricaonova, nomeimagem);
      break;
  }
}
function EditaValores(req, res, nomenovo, descricaonova, nomeimagem) {
  Produto.update({
    nome: nomenovo,
    descricao: descricaonova,
    imagem: nomeimagem
  }, {
    where: { "id": ID }
  }).then(function() {
    res.redirect('/');
    console.log("Editado com Sucesso");
  }).catch(function(erro) {
    res.send("Houve erro" + erro);
    console.log("Houve erro: " + erro);
  });
}

function ExcluirItem(req, res) {
  Produto.destroy({ where: { "id": req.params.id } }).then(function() {
    res.redirect('/');
  }).catch(function(erro) {
    console.log("Inexistente");
  });
}
