const http = require('http');

// import from a local "custom" module
const reqHandler = require('./routes');

const server = http.createServer(reqHandler);

// listen on port 3000 -> function we provided inside createServer body will be called on every request
// and receive the request and response objects to respond properly
server.listen(3000);
