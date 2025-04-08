const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const figlet = require('figlet');

const server = http.createServer(function (req, res) {
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.pathname;
  const params = querystring.parse(parsedUrl.query);

  console.log('User visited:', path);

  // Home page
  if (path === '/') {
    fs.readFile('index.html', function (err, html) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(html);
      res.end();
    });
  }

  // Serve the shuffled memory cards
  else if (path === '/api/cards') {
    const emojiList = ['🍎', '🍌', '🍇', '🍊', '🍉'];
    let cardDeck = emojiList.concat(emojiList); // duplicate for pairs

    // Shuffle the cards randomly
    for (let i = cardDeck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = cardDeck[i];
      cardDeck[i] = cardDeck[j];
      cardDeck[j] = temp;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(cardDeck));
  }

  // Serve CSS file
  else if (path === '/css/style.css') {
    fs.readFile('css/style.css', function (err, cssFile) {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(cssFile);
      res.end();
    });
  }

  // Serve JS file
  else if (path === '/js/main.js') {
    fs.readFile('js/main.js', function (err, jsFile) {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.write(jsFile);
      res.end();
    });
  }

  // 404 fallback
  else {
    figlet('404!!', function (err, figletText) {
      if (err) {
        console.log('Figlet error:', err);
        return;
      }
      res.write(figletText);
      res.end();
    });
  }
});

server.listen(8000, function () {
  console.log('Server is running on http://localhost:8000');
});
