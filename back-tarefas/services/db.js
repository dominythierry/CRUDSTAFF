const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "vehicle_info",
  port: 3306
});

connection.connect(err => {
  if (err) {
    console.error("Erro ao conectar no banco:", err);
    process.exit(1);
  }
  console.log("Conectado ao MariaDB!");
});

module.exports = connection;