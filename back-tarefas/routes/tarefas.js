const express = require("express");
const router = express.Router();
const db = require("../services/db");
const bcrypt = require("bcrypt");

const User = require('./models/User');

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

// LOGIN de usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.findOne({ email });

 if (!user) {
  return res.status(401).send({ message: "usuario nao encontrado" });
  }

  const isValidPassword = await bcrypt.compare(senha, usuario.senha);


  if (!isValidPassword) {
    return res.status(401).send({ message: 'Senha inválida' });
  }

 const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });

  res.send({ token });
});
module.exports = router;