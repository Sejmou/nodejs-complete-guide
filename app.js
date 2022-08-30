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
    const body = [];
    // data event fires whenever new data chunk is available; listener receives chunk
    req.on('data', chunk => {
      console.log('received chunk', chunk);
      body.push(chunk);
    });
    req.on('end', () => {
      // when this fires, we received all the data chunks!
      // now we can concatenate the current (complete) content of body to the globally available buffer
      // there's also a utility function for parsing the buffer content as a string
      // note that in this case we just assume the data will be a string
      // the correct approach always depends on the type of data we receive
      const parsedBody = Buffer.concat(body).toString();
      console.log('received all chunks, parsed result:', parsedBody);
      // now, we're ready to write the message to a local file
      fs.writeFileSync(
        'message.txt',
        parsedBody.split('=')[1] // we expect message to be string "message=[messageContent]" where [mesageContent] is the actual form input content
      );
      // side note: we would actually need to parse special characters like exclamation marks as they are URL-encoded by default
    });
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
