const express = require("express");
const cors = require("cors");
const carrosRoutes = require('./routes/carros');
const tarefasRoutes = require("./routes/tarefas");
const db = require("./services/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;
const SECRET_KEY = "781ecb5259a3dc9057b5332e57e72603d6bfe0fa";

app.use(cors());
app.use(express.json());


// Rotas
app.use("/tarefas", tarefasRoutes);

app.use('/carros', carrosRoutes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});