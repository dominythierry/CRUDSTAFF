const express = require("express");
const cors = require("cors");
const tarefasRoutes = require("./routes/tarefas");
const db = require("./services/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rotas do servidor
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Verifica se o usuário existe no banco de dados
    const user = await Tarefa.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Gera um código de redefinição de senha aleatório
    const resetCode = Math.random().toString(36).substring(2, 10);

    // Armazena o código de redefinição de senha no banco de dados
    user.resetCode = resetCode;
    user.resetExpires = Date.now() + 3600000; // 1 hora de validade
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Envio de email para o usuário com o código de redefinição de senha
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'seuemail@gmail.com',
        pass: 'sua senha'
      }
    });

    const mailOptions = {
      from: 'seuemail@gmail.com',
      to: user.email,
      subject: 'Redefinição de senha',
      text: `Código de redefinição de senha: ${resetCode}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email enviado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas
app.use("/tarefas", tarefasRoutes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});