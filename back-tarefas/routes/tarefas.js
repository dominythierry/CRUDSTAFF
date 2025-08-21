const express = require("express");
const router = express.Router();
const db = require("../services/db");

// GET: Listar todas as tarefas
router.get("/", (req, res) => {
  const sql = "SELECT * FROM tarefas";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar tarefas:", err);
      return res.status(500).json({ erro: "Erro ao buscar tarefas" });
    }
    res.json(results);
  });
});

// POST: Adicionar nova tarefa
router.post("/", (req, res) => {
  const { titulo, descricao, status } = req.body;
  const sql = "INSERT INTO tarefas (titulo, descricao, status) VALUES (?, ?, ?)";
  db.query(sql, [titulo, descricao, status || "pendente"], (err, result) => {
    if (err) {
      console.error("Erro ao adicionar tarefa:", err);
      return res.status(500).json({ erro: "Erro ao adicionar tarefa" });
    }
    res.status(201).json({
      id: result.insertId,
      titulo,
      descricao,
      status: status || "pendente"
    });
  });
});

// PATCH: Atualizar status da tarefa
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = "UPDATE tarefas SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar tarefa:", err);
      return res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json({ id, status });
  });
});

// DELETE: Remover tarefa pelo ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tarefas WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar tarefa:", err);
      return res.status(500).json({ erro: "Erro ao deletar tarefa" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json({ mensagem: "Tarefa excluída com sucesso", id });
  });
});

module.exports = router;