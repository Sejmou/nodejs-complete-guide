const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    // action on form tag allows us to tell cleint to send form content to particular URL
    // as we want to send data to the server, we use POST as HTTP method
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }
  // upon sending form content, browser will navigate to URL mentioned under action (in this case /message)
  if (url === '/message' && method === 'POST') {
    fs.writeFileSync(
      'message.txt',
      'Received something from a client! TODO: parse actual request body'
    );
    // 302 === redirect status code
    res.statusCode = 302;
    // Location header specifies where client browser should be redirected to
    res.setHeader('Location', '/');
    return res.end();
  }
  // content type header tells client how to interpret the data we send back
  // afaik browser will try to parse as HTML per default, so this is not really necessary here
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

// listen on port 3000 -> function we provided inside createServer body will be called on every request
// and receive the request and response objects to respond properly
server.listen(3000);
