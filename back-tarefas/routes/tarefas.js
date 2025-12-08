const express = require("express");
const router = express.Router();
const db = require("../services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "prfsenaiofc2@gmail.com",
    pass: "vmuk hmwy tnho lnyv",
  },
});

const SECRET_KEY = process.env.SECRET_KEY || '781ecb5259a3dc9057b5332e57e72603d6bfe0fa';

// ✅ EMAIL DO ADMINISTRADOR QUE RECEBERÁ AS NOTIFICAÇÕES
const ADMIN_EMAIL = "senaiprf@gmail.com"; // ⚠️ ALTERE AQUI!
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4200"; // URL do seu Angular

// Middleware para verificar token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

router.get("/listar", (req, res) => {
  const sql = "SELECT id, nome, cpf, email, telefone, endereco, cidade, estado, cep, status FROM administradores_prf";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuários" });
    res.json(results);
  });
});

router.get("/usuarios", verificarToken, (req, res) => {
  const sql = "SELECT id, nome, cpf, email, telefone, endereco, cidade, estado, cep FROM administradores_prf WHERE id = ?";
  
  db.query(sql, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar perfil" });
    if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
    
    res.json(results[0]);
  });
});

// ✅ NOVO REGISTRO COM APROVAÇÃO
router.post("/registrar", async (req, res) => {
  const { nome, cpf, email, senha } = req.body;
  
  if (!nome || !cpf || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  try {
    // Verifica se o email já existe
    const checkEmailSql = "SELECT * FROM administradores_prf WHERE email = ?";
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error("Erro ao verificar email:", err);
        return res.status(500).json({ erro: "Erro ao processar registro" });
      }

      if (results.length > 0) {
        const usuario = results[0];
        
        // Verifica se foi rejeitado
        if (usuario.status === 'rejeitado') {
          return res.status(409).json({ 
            erro: "Este email já foi registrado e rejeitado anteriormente. Entre em contato com o administrador.",
            status: "rejeitado"
          });
        }
        
        // Verifica se está pendente
        if (usuario.status === 'pendente') {
          return res.status(409).json({ 
            erro: "Este email já está aguardando aprovação do administrador.",
            status: "pendente"
          });
        }
        
        // Já foi aprovado
        return res.status(409).json({ 
          erro: "E-mail já cadastrado",
          status: usuario.status
        });
      }

      // Hash da senha e gera token de aprovação
      const hash = await bcrypt.hash(senha, 10);
      const tokenAprovacao = crypto.randomBytes(32).toString('hex');

      // Insere usuário com status PENDENTE
      const sql = `
        INSERT INTO administradores_prf 
        (nome, cpf, email, senha, status, token_aprovacao) 
        VALUES (?, ?, ?, ?, 'pendente', ?)
      `;

      db.query(sql, [nome, cpf, email, hash, tokenAprovacao], async (err, result) => {
        if (err) {
          console.error("Erro ao registrar usuário:", err);
          return res.status(500).json({ erro: "Erro ao registrar usuário" });
        }

        // Envia email ao administrador
        try {
          await enviarEmailAprovacao({ id: result.insertId, nome, cpf, email }, tokenAprovacao);
          
          res.status(201).json({ 
            mensagem: "Registro enviado para aprovação! Você receberá um email quando seu acesso for liberado.",
            status: "pendente"
          });
        } catch (emailError) {
          console.error("Erro ao enviar email:", emailError);
          // Mesmo com erro no email, o registro foi criado
          res.status(201).json({ 
            mensagem: "Usuário registrado, mas houve erro ao notificar o administrador.",
            status: "pendente"
          });
        }
      });
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ erro: "Erro ao processar registro" });
  }
});

// ✅ FUNÇÃO PARA ENVIAR EMAIL AO ADMIN
async function enviarEmailAprovacao(usuario, token) {
  const linkAprovacao = `${FRONTEND_URL}/aprovar-registro/${token}`;
  const linkRejeicao = `${FRONTEND_URL}/rejeitar-registro/${token}`;

  const htmlEmail = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #003d7a; color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .user-info { background: #f8f9fa; padding: 20px; border-left: 4px solid #003d7a; margin: 20px 0; border-radius: 4px; }
        .user-info p { margin: 8px 0; }
        .user-info strong { color: #003d7a; }
        .buttons { text-align: center; margin: 30px 0; }
        .btn { 
          display: inline-block; 
          padding: 14px 32px; 
          margin: 10px; 
          text-decoration: none; 
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
        }
        .btn-aprovar { background: #28a745; color: white; }
        .btn-aprovar:hover { background: #218838; }
        .btn-rejeitar { background: #dc3545; color: white; }
        .btn-rejeitar:hover { background: #c82333; }
        .footer { text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 12px; }
        .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚔 Sistema PRF - Nova Solicitação</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;"><strong>Olá, Administrador!</strong></p>
          <p>Um novo usuário solicitou acesso ao Sistema de Gerenciamento do Pátio da PRF.</p>
          
          <div class="user-info">
            <p><strong>👤 Nome:</strong> ${usuario.nome}</p>
            <p><strong>📧 Email:</strong> ${usuario.email}</p>
            <p><strong>🆔 CPF:</strong> ${usuario.cpf}</p>
            <p><strong>📅 Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>

          <div class="alert">
            <strong>⚠️ Ação Necessária:</strong> Clique em um dos botões abaixo para aprovar ou rejeitar esta solicitação.
          </div>

          <div class="buttons">
            <a href="${linkAprovacao}" class="btn btn-aprovar">✓ APROVAR REGISTRO</a>
            <a href="${linkRejeicao}" class="btn btn-rejeitar">✗ REJEITAR REGISTRO</a>
          </div>

          <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
            Caso os botões não funcionem, copie e cole os links abaixo no navegador:
          </p>
          <p style="font-size: 12px; word-break: break-all; color: #666; text-align: center;">
            <strong>Aprovar:</strong> ${linkAprovacao}<br>
            <strong>Rejeitar:</strong> ${linkRejeicao}
          </p>
        </div>
        <div class="footer">
          <p><strong>Sistema de Gerenciamento de Pátio - PRF</strong></p>
          <p>Este é um email automático, não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: '"Sistema PRF - Pátio" <prfsenaiofc2@gmail.com>',
    to: ADMIN_EMAIL,
    subject: '🔔 Nova Solicitação de Registro - Sistema PRF',
    html: htmlEmail
  });
}

// ✅ ROTA PARA APROVAR REGISTRO
router.get("/aprovar/:token", async (req, res) => {
  const { token } = req.params;

  try {
    // Busca o usuário pelo token
    const sql = "SELECT * FROM administradores_prf WHERE token_aprovacao = ? AND status = 'pendente'";
    
    db.query(sql, [token], async (err, results) => {
      if (err) {
        console.error("Erro ao buscar usuário:", err);
        return res.status(500).json({ erro: "Erro ao processar aprovação" });
      }

      if (results.length === 0) {
        return res.status(404).json({ erro: "Solicitação não encontrada ou já processada" });
      }

      const usuario = results[0];

      // Atualiza o status para aprovado
      const updateSql = `
        UPDATE administradores_prf 
        SET status = 'aprovado', data_aprovacao = NOW(), token_aprovacao = NULL 
        WHERE id = ?
      `;

      db.query(updateSql, [usuario.id], async (err) => {
        if (err) {
          console.error("Erro ao aprovar usuário:", err);
          return res.status(500).json({ erro: "Erro ao aprovar registro" });
        }

        // Envia email de confirmação ao usuário
        try {
          await transporter.sendMail({
            from: '"Sistema PRF - Pátio" <prfsenaiofc2@gmail.com>',
            to: usuario.email,
            subject: '✅ Seu registro foi aprovado!',
            html: `
              <!DOCTYPE html>
              <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0;">✅ Registro Aprovado!</h1>
                  </div>
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                    <p>Olá, <strong>${usuario.nome}</strong>!</p>
                    <p>Seu registro no Sistema de Gerenciamento do Pátio da PRF foi <strong>aprovado</strong>!</p>
                    <p>Você já pode fazer login no sistema com o email e senha cadastrados.</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${FRONTEND_URL}/login" style="background: #003d7a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Acessar Sistema
                      </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Bem-vindo ao sistema!</p>
                  </div>
                </div>
              </body>
              </html>
            `
          });
        } catch (emailError) {
          console.error("Erro ao enviar email de confirmação:", emailError);
        }

        res.json({ 
          mensagem: "Registro aprovado com sucesso!",
          usuario: { nome: usuario.nome, email: usuario.email }
        });
      });
    });
  } catch (error) {
    console.error("Erro ao aprovar:", error);
    res.status(500).json({ erro: "Erro ao processar aprovação" });
  }
});

// ✅ ROTA PARA REJEITAR REGISTRO
router.get("/rejeitar/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const sql = "SELECT * FROM administradores_prf WHERE token_aprovacao = ? AND status = 'pendente'";
    
    db.query(sql, [token], async (err, results) => {
      if (err) {
        console.error("Erro ao buscar usuário:", err);
        return res.status(500).json({ erro: "Erro ao processar rejeição" });
      }

      if (results.length === 0) {
        return res.status(404).json({ erro: "Solicitação não encontrada ou já processada" });
      }

      const usuario = results[0];

      // Atualiza o status para rejeitado
      const updateSql = `
        UPDATE administradores_prf 
        SET status = 'rejeitado', token_aprovacao = NULL 
        WHERE id = ?
      `;

      db.query(updateSql, [usuario.id], async (err) => {
        if (err) {
          console.error("Erro ao rejeitar usuário:", err);
          return res.status(500).json({ erro: "Erro ao rejeitar registro" });
        }

        // Envia email de notificação ao usuário
        try {
          await transporter.sendMail({
            from: '"Sistema PRF - Pátio" <prfsenaiofc2@gmail.com>',
            to: usuario.email,
            subject: '❌ Registro não aprovado',
            html: `
              <!DOCTYPE html>
              <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0;">❌ Registro Não Aprovado</h1>
                  </div>
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                    <p>Olá, <strong>${usuario.nome}</strong>,</p>
                    <p>Informamos que seu registro no Sistema de Gerenciamento do Pátio da PRF não foi aprovado.</p>
                    <p>Para mais informações, entre em contato com o administrador do sistema.</p>
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">Atenciosamente,<br>Equipe PRF</p>
                  </div>
                </div>
              </body>
              </html>
            `
          });
        } catch (emailError) {
          console.error("Erro ao enviar email de rejeição:", emailError);
        }

        res.json({ 
          mensagem: "Registro rejeitado",
          usuario: { nome: usuario.nome, email: usuario.email }
        });
      });
    });
  } catch (error) {
    console.error("Erro ao rejeitar:", error);
    res.status(500).json({ erro: "Erro ao processar rejeição" });
  }
});

// ✅ LOGIN - AGORA VERIFICA O STATUS
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query("SELECT * FROM administradores_prf WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Erro no banco:", err);
      return res.status(500).json({ error: "Erro no banco de dados" });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const usuario = results[0];

    // ✅ VERIFICA SE O USUÁRIO FOI APROVADO
    if (usuario.status === 'pendente') {
      return res.status(403).json({ 
        message: "Seu registro ainda está aguardando aprovação do administrador.",
        status: "pendente"
      });
    }

    if (usuario.status === 'rejeitado') {
      return res.status(403).json({ 
        message: "Seu registro foi rejeitado. Entre em contato com o administrador.",
        status: "rejeitado"
      });
    }

    try {
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, SECRET_KEY, { expiresIn: "48h" });

      return res.json({
        message: "Login bem-sucedido",
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
      });
    } catch (errCompare) {
      console.error("Erro ao comparar senha:", errCompare);
      return res.status(500).json({ error: "Erro interno" });
    }
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

    const deleteSql = "DELETE FROM administradores_prf WHERE email = ?";
    db.query(deleteSql, [email], (err, result) => {
      if (err) return res.status(500).json({ erro: "Erro ao deletar usuário" });
      res.json({ mensagem: "Conta deletada com sucesso" });
    });
  });
});

router.put("/usuarios", verificarToken, (req, res) => {
  const { nome, email, telefone, endereco, cidade, estado, cep } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios" });
  }

  const sql = `
    UPDATE administradores_prf 
    SET nome = ?, email = ?, telefone = ?, endereco = ?, cidade = ?, estado = ?, cep = ?
    WHERE id = ?
  `;

  db.query(sql, [nome, email, telefone, endereco, cidade, estado, cep, req.userId], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ erro: "E-mail já cadastrado" });
      }
      return res.status(500).json({ erro: "Erro ao atualizar perfil" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Perfil atualizado com sucesso" });
  });
});

router.put("/alterar-senha", verificarToken, async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ erro: "Informe a senha atual e a nova senha" });
  }

  if (novaSenha.length < 6) {
    return res.status(400).json({ erro: "A nova senha deve ter no mínimo 6 caracteres" });
  }

  db.query("SELECT senha FROM administradores_prf WHERE id = ?", [req.userId], async (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });
    if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha atual incorreta" });
    }

    const novoHash = await bcrypt.hash(novaSenha, 10);

    db.query("UPDATE administradores_prf SET senha = ? WHERE id = ?", [novoHash, req.userId], (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao atualizar senha" });
      res.json({ mensagem: "Senha alterada com sucesso" });
    });
  });
});

router.post('/passwordreset', async (req, res) => {
  const { email } = req.body;

  const query = 'SELECT * FROM administradores_prf WHERE email = ?';
  db.query(query, [email], async (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro no banco de dados.' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'E-mail não encontrado' });
    }

    const novaSenha = crypto.randomBytes(4).toString('hex');
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(novaSenha, saltRounds);

    db.query('UPDATE administradores_prf SET senha = ? WHERE email = ?', [senhaHash, email], async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar senha.' });
      }

      try {
        await transporter.sendMail({
          from: '"Suporte" <prfsenaiofc2@gmail.com>',
          to: email,
          subject: 'Recuperação de senha',
          text: `Sua nova senha é: ${novaSenha}`
        });

        res.json({ message: 'Nova senha enviada por e-mail.' });
      } catch (errMail) {
        console.error('Erro detalhado ao enviar e-mail:', errMail);
        res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
      }
    });
  });
});

module.exports = router;