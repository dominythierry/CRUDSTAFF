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
    console.log('PUT /carros/:id recebido:', req.body);
    // Build dynamic UPDATE but only for columns that actually exist in the carros table.
    // accept both frontend names and DB column name for entry/exit dates
    const allowed = ['marca', 'modelo', 'ano', 'cor', 'placa', 'motivo', 'motivoRecolhimento', 'dataEntrada', 'saida_em', 'criado_em', ];
    const body = req.body || {};

    // helper to format JS date/ISO to MySQL DATETIME 'YYYY-MM-DD HH:MM:SS'
    function toSqlDatetime(val) {
        if (!val) return null;
        // if already in YYYY-MM-DD format (from <input type=date>), add time
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            return `${val} 00:00:00`;
        }
        const d = new Date(val);
        if (isNaN(d.getTime())) return val; // return as-is if unparsable
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }

    // First check which columns exist in the table
    connection.query("SHOW COLUMNS FROM carros", (err, columns) => {
        if (err) {
            console.error('Erro ao obter colunas da tabela carros:', err);
            return res.status(500).json({ error: err });
        }

        const existing = (columns || []).map(c => c.Field);
        console.log('Colunas existentes na tabela:', existing);

        const setClauses = [];
        const params = [];

        for (const key of allowed) {
            if (!existing.includes(key) && !(key === 'motivoRecolhimento' && existing.includes('motivo'))) {
                // skip fields that don't exist (except motivoRecolhimento which maps to motivo)
                continue;
            }

            if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
                console.log(`Processando campo ${key}:`, body[key]);
                if (key === 'motivoRecolhimento') {
                    // map to motivo column
                    setClauses.push('motivo = ?');
                    params.push(body[key]);
                } else if (key === 'dataEntrada') {
                    // map frontend 'dataEntrada' to DB column (check for criado_em, createdAt, created_at, dataEntrada)
                    let targetCol = null;
                    if (existing.includes('criado_em')) targetCol = 'criado_em';
                    else if (existing.includes('createdAt')) targetCol = 'createdAt';
                    else if (existing.includes('created_at')) targetCol = 'created_at';
                    else if (existing.includes('dataEntrada')) targetCol = 'dataEntrada';

                    console.log(`dataEntrada mapeado para coluna: ${targetCol}`);
                    if (targetCol) {
                        setClauses.push(`${targetCol} = ?`);
                        const formatted = toSqlDatetime(body[key]);
                        console.log(`Data formatada para ${targetCol}:`, formatted);
                        params.push(formatted);
                    }
                } else if (key === 'dataSaida' || key === 'saida_em') {
                    // map frontend 'dataSaida' or 'saida_em' to DB column 'saida_em' if it exists
                    if (existing.includes('saida_em')) {
                        setClauses.push('saida_em = ?');
                        const formatted = toSqlDatetime(body[key]);
                        params.push(formatted);
                    }
                } else if (!['criado_em', 'createdAt', 'created_at'].includes(key)) {
                    // skip entry date column names if already processed above
                    setClauses.push(`${key} = ?`);
                    params.push(body[key]);
                }
            }
        }

        if (setClauses.length === 0) {
            return res.status(400).json({ error: 'Nenhum campo válido fornecido para atualizar.' });
        }

    const sql = `UPDATE carros SET ${setClauses.join(', ')} WHERE id = ?`;
    params.push(req.params.id);

    console.log('SQL final:', sql);
    console.log('Parâmetros:', params);

    connection.query(sql, params, (err, results) => {
            if (err) {
                console.error('Erro SQL ao atualizar carro:', err);
                return res.status(500).json({ error: err });
            }

            // Return the updated row so the frontend can reflect DB state immediately
            connection.query('SELECT * FROM carros WHERE id = ?', [req.params.id], (err2, rows) => {
                if (err2) {
                    console.error('Erro ao buscar registro atualizado:', err2);
                    return res.status(500).json({ message: 'Carro atualizado, mas falha ao recuperar registro', error: err2 });
                }
                res.json({ message: 'Carro atualizado!', updated: rows[0] });
            });
        });
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