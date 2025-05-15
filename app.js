
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware para ler os dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve arquivos como style.css e typing-sound.mp3

// Rota principal - exibe o formulário
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Formulário Matrix</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h2>Digite seu nome:</h2>
      <form method="POST" action="/enviar">
        <input type="text" name="nome" placeholder="Seu nome" required />
        <button type="submit">Enviar</button>
      </form>
      <br>
      <a href="/lista">Ver nomes salvos</a>

      <script>
        const audio = new Audio('/sounds/typing-sound.mp3');
        const input = document.querySelector('input[name="nome"]');
        input.addEventListener('input', () => {
          audio.currentTime = 0;
          audio.play();
        });
      </script>

      <script src="/matrix.js"></script>
    </body>
    </html>
  `);
});

// Rota que recebe os dados enviados
app.post('/enviar', (req, res) => {
  const nome = req.body.nome;
  fs.appendFile('nomes.txt', nome + '\n', (err) => {
    if (err) {
      return res.send('<h1>Erro ao salvar o nome.</h1>');
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <title>Nome Salvo</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Olá, ${nome}! Seu nome foi salvo com sucesso.</h1>
        <a href="/">Voltar</a>
      </body>
      </html>
    `);
  });
});

// Rota que exclui um nome
app.post('/excluir', (req, res) => {
  const nomeAExcluir = req.body.nome;
  fs.readFile('nomes.txt', 'utf8', (err, data) => {
    if (err) {
      return res.send('<h1>Erro ao ler nomes para excluir.</h1>');
    }

    const nomes = data.trim().split('\n');
    const nomesAtualizados = nomes.filter(n => n !== nomeAExcluir);
    const conteudoAtualizado = nomesAtualizados.join('\n') + '\n';

    fs.writeFile('nomes.txt', conteudoAtualizado, err => {
      if (err) {
        return res.send('<h1>Erro ao excluir o nome.</h1>');
      }

      res.redirect('/lista');
    });
  });
});

// Rota que exibe todos os nomes salvos
app.get('/lista', (req, res) => {
  fs.readFile('nomes.txt', 'utf8', (err, data) => {
    if (err) {
      return res.send('<h1>Erro ao ler os nomes.</h1>');
    }

    const nomes = data.trim().split('\n');
    const listaHtml = nomes.map(nome => `
      <li>
        ${nome}
        <form method="POST" action="/excluir" style="display:inline">
          <input type="hidden" name="nome" value="${nome}">
          <button type="submit">Excluir</button>
        </form>
      </li>
    `).join('');

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <title>Lista de Nomes</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Lista de Nomes Salvos</h1>
        <ul>${listaHtml}</ul>
        <a href="/">Voltar</a>
      </body>
      </html>
    `);
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
}); 
