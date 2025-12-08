// server.js
const express = require('express');
const path = require('path');
const app = express();

// Ajuste para a pasta de build do projeto. A build atual gera `dist/front-end/browser`.
const DIST_FOLDER = path.join(__dirname, 'dist', 'front-end', 'browser');

// Serve os arquivos estáticos da build do Angular
app.use(express.static(DIST_FOLDER));

// Todas as rotas desconhecidas devolvem o index.html (resolve o refresh/F5)
// Use '/*' instead of '*' to avoid path-to-regexp edge cases on some environments
// Fallback: se for uma requisição HTML (navegador), devolve index.html
// Isso evita usar padrões de rota que podem desencadear parsing do path-to-regexp
app.use((req, res, next) => {
  // só servir index para requests GET que aceitem HTML
  if (req.method === 'GET' && req.headers.accept && req.headers.accept.includes('text/html')) {
    // esta build gera index.csr.html (client-side render). Use-o quando disponível.
    const indexFile = path.join(DIST_FOLDER, 'index.html');
    const csrIndexFile = path.join(DIST_FOLDER, 'index.csr.html');
    if (require('fs').existsSync(indexFile)) {
      return res.sendFile(indexFile);
    }
    if (require('fs').existsSync(csrIndexFile)) {
      return res.sendFile(csrIndexFile);
    }
    // fallback: list files for debugging
    return res.status(404).send('index file not found in ' + DIST_FOLDER);
  }
  next();
});

// Pequeno handler de erro para logar problemas inesperados
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

// Porta
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});