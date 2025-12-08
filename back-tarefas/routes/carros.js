const express = require('express');
const router = express.Router();
const pool = require('../services/db');

// Criar carro
router.post('/', async (req, res) => {
    try {
        const { marca, modelo, ano, cor, placa, motivo } = req.body;

        const sql = `INSERT INTO carros (marca, modelo, ano, cor, placa, motivo)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     RETURNING id`;

        const result = await pool.query(sql, [marca, modelo, ano, cor, placa, motivo]);
        res.json({ message: 'Carro cadastrado com sucesso!', id: result.rows[0].id });
    } catch (err) {
        console.error('Erro ao criar carro:', err);
        res.status(500).json({ error: err.message });
    }
});

// Listar carros
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM carros");
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao listar carros:', err);
        res.status(500).json({ error: err.message });
    }
});

// Pegar carro por ID
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM carros WHERE id = $1", [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar carro:', err);
        res.status(500).json({ error: err.message });
    }
});

// Atualizar carro
router.put('/:id', async (req, res) => {
    try {
        console.log('PUT /carros/:id recebido:', req.body);
        const allowed = ['marca', 'modelo', 'ano', 'cor', 'placa', 'motivo', 'motivoRecolhimento', 'dataEntrada', 'saida_em', 'criado_em'];
        const body = req.body || {};

        function toSqlDatetime(val) {
            if (!val) return null;
            if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                return `${val} 00:00:00`;
            }
            const d = new Date(val);
            if (isNaN(d.getTime())) return val;
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const hh = String(d.getHours()).padStart(2, '0');
            const mi = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
        }

        // PostgreSQL: Get columns using information_schema
        const columnsResult = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'carros'
        `);
        
        const existing = columnsResult.rows.map(c => c.column_name);
        console.log('Colunas existentes na tabela:', existing);

        const setClauses = [];
        const params = [];
        let paramIndex = 1;

        for (const key of allowed) {
            if (!existing.includes(key) && !(key === 'motivoRecolhimento' && existing.includes('motivo'))) {
                continue;
            }

            if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
                console.log(`Processando campo ${key}:`, body[key]);
                if (key === 'motivoRecolhimento') {
                    setClauses.push(`motivo = $${paramIndex++}`);
                    params.push(body[key]);
                } else if (key === 'dataEntrada') {
                    let targetCol = null;
                    if (existing.includes('criado_em')) targetCol = 'criado_em';
                    else if (existing.includes('createdat')) targetCol = 'createdat';
                    else if (existing.includes('created_at')) targetCol = 'created_at';
                    else if (existing.includes('dataentrada')) targetCol = 'dataentrada';

                    console.log(`dataEntrada mapeado para coluna: ${targetCol}`);
                    if (targetCol) {
                        setClauses.push(`${targetCol} = $${paramIndex++}`);
                        const formatted = toSqlDatetime(body[key]);
                        console.log(`Data formatada para ${targetCol}:`, formatted);
                        params.push(formatted);
                    }
                } else if (key === 'dataSaida' || key === 'saida_em') {
                    if (existing.includes('saida_em')) {
                        setClauses.push(`saida_em = $${paramIndex++}`);
                        const formatted = toSqlDatetime(body[key]);
                        params.push(formatted);
                    }
                } else if (!['criado_em', 'createdat', 'created_at'].includes(key)) {
                    setClauses.push(`${key} = $${paramIndex++}`);
                    params.push(body[key]);
                }
            }
        }

        if (setClauses.length === 0) {
            return res.status(400).json({ error: 'Nenhum campo válido fornecido para atualizar.' });
        }

        const sql = `UPDATE carros SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`;
        params.push(req.params.id);

        console.log('SQL final:', sql);
        console.log('Parâmetros:', params);

        await pool.query(sql, params);

        // Return the updated row
        const updatedResult = await pool.query('SELECT * FROM carros WHERE id = $1', [req.params.id]);
        res.json({ message: 'Carro atualizado!', updated: updatedResult.rows[0] });
    } catch (err) {
        console.error('Erro ao atualizar carro:', err);
        res.status(500).json({ error: err.message });
    }
});

// Deletar carro
router.delete('/:id', async (req, res) => {
    try {
        await pool.query("DELETE FROM carros WHERE id=$1", [req.params.id]);
        res.json({ message: "Carro removido!" });
    } catch (err) {
        console.error('Erro ao deletar carro:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;