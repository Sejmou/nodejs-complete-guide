const http = require('http');

// import from a local "custom" module
const routes = require('./routes');

console.log('imported value:', routes.someValue);

const server = http.createServer(routes.handler);

// listen on port 3000 -> function we provided inside createServer body will be called on every request
// and receive the request and response objects to respond properly
server.listen(3000);
