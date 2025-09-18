const express = require("express");
const router = express.Router();
const db = require("../services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");
const nodemailer = require('nodemailer');
const app = express();


// GET - Listar todos os usuários
router.get("/usuarios", (req, res) => {
  const sql = "SELECT id, nome, cpf, email FROM administradores_prf";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuários" });
    res.json(results);
  });
});

// REGISTRO de usuário
router.post("/registrar", async (req, res) => {
  const { nome, cpf, email, senha } = req.body;
  if (!nome || !cpf || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }
  const hash = await bcrypt.hash(senha, 10);
  const sql = "INSERT INTO administradores_prf (nome, cpf, email, senha) VALUES (?, ?, ?, ?)";
  db.query(sql, [nome, cpf, email, hash], (err, result) => {
    if (err) {
      console.error("Erro ao registrar usuário:", err); // Adicione esta linha
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ erro: "E-mail já cadastrado" });
      }
      return res.status(500).json({ erro: "Erro ao registrar usuário" });
    }
    res.status(201).json({ mensagem: "Usuário registrado com sucesso", id: result.insertId });
  });
});

//requisitos de login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query("SELECT * FROM administradores_prf WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Erro no banco:", err);
      return res.status(500).json({ error: "Erro no banco de dados" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const usuario = results[0];
    
    // compara senha enviada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    // se tudo ok
    res.json({ message: "Login bem-sucedido", usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  });
});

// DELETAR conta do usuário
router.delete("/deletar", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Informe email e senha" });
  }

  const sql = "SELECT * FROM administradores_prf WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });
    if (results.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(senha, user.senha);

    if (!isValidPassword) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    // se senha ok → deleta
    const deleteSql = "DELETE FROM administradores_prf WHERE email = ?";
    db.query(deleteSql, [email], (err, result) => {
      if (err) return res.status(500).json({ erro: "Erro ao deletar usuário" });
      res.json({ mensagem: "Conta deletada com sucesso" });
    });
  });
});



module.exports = router;

