const express = require("express");
const cors = require("cors");
const tarefasRoutes = require("./routes/tarefas");
const db = require("./services/db");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/tarefas", tarefasRoutes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});