const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Hello world</title></head>');
    res.write('<body><h1>hello world</h1><form method="POST" action="/create-user"><input type="text" name="username"><button type="submit">Create user</button></form></body>');
    res.write('</html>');

    return res.end();
  }

  if (url === '/users' && method === 'POST') {
    res.write('<html>');
      res.write('<head><title>hello world</title></head>');
      res.write('<body>');
        res.write('<ul>');
          res.write('<li>User 1</li>');
          res.write('<li>User 2</li>');
          res.write('<li>User 3</li>');
        res.write('</ul>')
      res.write('</body>')
    res.write('</html>');

    return res.end();
  }

  if(url === '/create-user') {
    const body = [];

    req.on('data', chunk => {
      body.push(chunk);
    })

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split('=')[1];

      console.log(username);
    })

  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>hello world</title></head>');
  res.write('<body><h1>hello world</h1></body>');
  res.write('</html>');

  return res.end();
});

server.listen(3000);
