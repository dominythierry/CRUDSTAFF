const express = require('express');
const router = express.Router();
const connection = require('../services/db'); // <-- IMPORTANTE

// Criar carro
router.post('/', (req, res) => {
    const { marca, modelo, ano, cor, placa, motivo } = req.body;

    const sql = `INSERT INTO carros (marca, modelo, ano, cor, placa, motivo)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [marca, modelo, ano, cor, placa, motivo], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Carro cadastrado com sucesso!', id: results.insertId });
    });
});

// Listar carros
router.get('/', (req, res) => {
    connection.query("SELECT * FROM carros", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Pegar carro por ID
router.get('/:id', (req, res) => {
    connection.query("SELECT * FROM carros WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});

// Atualizar carro
router.put('/:id', (req, res) => {
    const { marca, modelo, ano, cor, placa, motivoRecolhimento} = req.body;

    const sql = `
        UPDATE carros SET marca=?, modelo=?, ano=?, cor=?, placa=?, motivoRecolhimento=?
        WHERE id=?
    `;
    connection.query(sql, [marca, modelo, ano, cor, placa, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Carro atualizado!" });
    });
});

// Deletar carro
router.delete('/:id', (req, res) => {
    connection.query("DELETE FROM carros WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Carro removido!" });
    });
});

module.exports = router;