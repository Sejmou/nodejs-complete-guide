// as this file uses module.exports it is treated as an importable module by Node

const fs = require('fs');

const routesHandler = (req, res) => {
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

    // return statement is important! otherwise the code after if would execute
    // I guess putting return on its own line directly after req.on would have exactly same effect in this case?
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log('received all chunks, parsed result:', parsedBody);
      // now, we're ready to write the message to a local file
      fs.writeFile(
        // non-blocking alternative to writeFileSync -> also event-based (callback called after file write operation)
        'message.txt',
        parsedBody.split('=')[1],
        err => {
          // if any errors occurred we would receive them in err
          res.statusCode = 302;
          res.setHeader('Location', '/');
          return res.end();
        }
      );
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
};

// this is how one can export multiple things at once
module.exports = {
  handler: routesHandler,
  someValue: 'This is a test value',
};

// Other way to achieve the same thing:
// module.exports.handler = routesHandler;
// module.exports.someValue = 'This is a test value';

// in Node, we can also leave out the "module." part
// exports.handler = routesHandler;
// exports.someValue = 'This is a test value';
