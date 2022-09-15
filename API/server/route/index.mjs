import express, { request } from "express";
import { getProdutosByPedidoId } from "../data/index.mjs";
const router = express.Router();

import * as service from "../service/index.mjs";

router.get("/", async (req, res) => {
  res.send("Oi, estou escutando aqui!");
});

router.get("/usuarios", async (req, res) => {
  const usuariosJSON = await service.getUsuarios();
  res.json(usuariosJSON);
});

// Zerar banco de dados -------------------------------------------------
// zerar Banco de Dados endpoint: | method: "delete"
router.delete("/", async (req, res) => {
  try {
    service.zeraDb();
    res.status(204).end();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Referentes a Produtos  -----------------------------------------------

// Pegar todos os produtos do banco
// endpoint: /produtos/info
// method: "get"
router.get("/produtos/info", async (req, res) => {
  try {
    const produtos = await service.getProdutos();
    res.status(200).json(produtos);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Pegar produtos por categoria
// endpoint: //produtos/categoria/:id_categoria
// methoc: "get"
router.get("/produtos/categoria/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const produtos = await service.getProdutosByIdCategoria(id);
    res.status(200).json(produtos);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Atualizar produtos do banco de dados

// Inserir produtos no banco de dados

// subtrair quantidades de produtos com um tamanho selecionado

// Referentes a Cadastros e Dados Dadastrais  ---------------------------

// Cadastrar novos usuarios
// endpoint: /usuarios/cadastro/novo
// method: "post"
// body: {email: "pedro@gmail.com", senha: "pedrinho123"}
router.post("/usuarios/cadastro/novo", async (req, res) => {
  const newUsuario = req.body;
  try {
    service.insertCadastro(newUsuario);
    res.status(201).send("Cadastro Efetuado com sucesso!");
  } catch (e) {
    res.status(422).send(e.message);
  }
});

// Inativar usuarios cadastrados
// endpoint: /usuarios/info/inativar/:id_usuario
// method: "put"
router.put("/usuarios/info/inativar/:id", async (req, res) => {
  try {
    const idUsuario = req.params.id;
    service.inativarUsuarioById(idUsuario);
    res.status(204).end();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Efetuar login, verificar dados e gerar token de acesso
// endpoint: /login/:email/:senha
// method: "get"
router.get("/login/:email/:senha", async (req, res) => {
  const email = req.params.email;
  const senha = req.params.senha;
  const dados = { email, senha };

  try {
    const response = await service.makeLogin(dados);
    res.status(200).json(response);
  } catch (e) {
    res.status(406).send(e.message);
  }
});

// Atualizar dados cadastrais
// enpoint: /usuarios/info/update/:id
// method: "put"
// body: {
//   nomeCompleto: "Joca da Silva",
//   pais: "Brasil",
//   cep: "74717171",
//   logradouro: "R. joca Qd joca lote 1 ",
//   cidade: "Goiania",
//   estado: "GO",
//   complemento: "joca",
// }
router.put("/usuarios/info/update/:id", async (req, res) => {
  const idUsuario = req.params.id;
  const newDados = req.body;
  try {
    service.updateCadastro(idUsuario, newDados);
    res.status(204).end();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Atualizar email e senha cadastradas
// endpoint: /usuarios/update/:id
// method: "put"
// body: {email: "joaozinho@gamil.com", senha: "joaozinho"}
router.put("/usuarios/update/:id", async (req, res) => {
  const newDados = req.body;
  const idUsuario = req.params.id;
  try {
    service.changeEmailPassword(newDados, idUsuario);
    res.status(204).end();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Atualizar Usuario para ADM
// endpoint: /usuarios/adm/update/:id
// method: "put"
router.put("/usuarios/adm/update/:id", async (req, res) => {
  const idUsuario = req.params.id;
  try {
    service.changeAdmUsuario(idUsuario);
    res.status(204).end();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Referentes a pedidos ---------------------------------

// Pegar dados de todos os pedidos existentes
// endpoint: /pedidos/info
// method: "get"
router.get("/pedidos/info", async (req, res) => {
  try {
    const pedidosJSON = await service.getPedidos();
    res.status(200).json(pedidosJSON);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Pegar todos os pedidos de um usuário
// endpoint: /pedidos/info/usuarios/:id_usuario
// method: "get"
router.get("/pedidos/info/usuarios/:id", async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const pedidosJSON = await service.getPedidosByIdUsuario(idUsuario);
    res.status(200).json(pedidosJSON);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Pegar dados informações de um pedido
// endpoint: /pedidos/info/:id_pedido
// method: "get"
router.get("/pedidos/info/:id", async (req, res) => {
  try {
    const idPedido = req.params.id;
    const pedidoJSON = await service.getInfoPedidoById(idPedido);
    res.status(200).json(pedidoJSON);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Pegar produtos de um pedido
// endpoint: /pedidos/info/produtos/:id_pedido
// method: "get"
router.get("/pedidos/info/produtos/:id", async (req, res) => {
  try {
    const idPedido = req.params.id;
    const produtosJSON = await service.getProdutosByPedidoId(idPedido);
    res.status(200).json(produtosJSON);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// Inserir novo pedido
// endpoint: /pedidos/novo
// method: "post"
// body: {idUsuario: 3, precoTotal: "1200", idFormaPagamento: 2}
router.post("/pedidos/novo", async (req, res) => {
  const newPedido = req.body;
  try {
    service.insertPedido(newPedido);
    res.status(201).send("Pedido Efetuado com sucesso!");
  } catch (e) {
    res.status(422).send(e.message);
  }
});

// Inserir produtos de um determinado pedido
// endpoint: /pedidos/produtos/novo/:id_pedido
// method: "post"
// body: [
//   {
//     idProduto: 1,
//     precoSubtotal: 200,
//     quantidade: 2,
//     tamanho: "m",
//   },
//   {
//     idProduto: 1,
//     precoSubtotal: 200,
//     quantidade: 2,
//     tamanho: "p",
//   },
//   ...
// ]
router.post("/pedidos/produtos/novo/:id", async (req, res) => {
  const idPedido = req.params.id;
  const produtos = req.body;
  try {
    service.insertProdutosByPedidoId(idPedido, produtos);
    res.status(201).send("Produtos Inseridos com sucesso");
  } catch (e) {
    res.status(422).send(e.message);
  }
});

// Alterar informações de um pedido
// endpoint: /pedidos/info/:id_pedido
// method: "put"
// body: {status: 2, idFormaPagamento: 1 }
router.put("/pedidos/info/:id", async function (req, res) {
  const updatePedido = req.body;
  const idPedidoUpdate = req.params.id;
  try {
    service.updatePedido(idPedidoUpdate, updatePedido);
    res.status(204).end();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
