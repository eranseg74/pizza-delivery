/*
 * Server-related tasks
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const util = require('util');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const handlers = require('./handlers');
const helpers = require('./helpers');
const debug = util.debuglog('server');
const menu = require('./menu');

// Instantiate the server module object
const server = {};

// Instantiate the http server. The server should respond to all requests with a string
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

// Instantiate the https server. The server should respond to all requests with a string
server.httpsServerOptions = {
  'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  'cert' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
  server.unifiedServer(req, res);
});

// All the server logic for both the http and the https server implemented here
server.unifiedServer = (req, res) => {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');
  // Get the query string as an object
  const queryStringObject = parsedUrl.query;
  // Get the HTTP/S method
  const method = req.method.toLowerCase();
  // Get the headers as an object
  const headers = req.headers;
  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();
    // Choose the handler this request should go to. If one is not found, use the notFound handler
    let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
    // If the request is within the public directory, use the public handler instead
    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
    // Construct the data object to send to the handler
    const data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };
    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload, contentType) => {
      // Determine the type of response (fallback to JSON)
      contentType = typeof(contentType) == 'string' ? contentType : 'json';
      // Use the status code called back by the handler, or default to '200'
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // Return the response-parts that are content-specific
      let payloadString = '';
      if(contentType == 'json') {
        res.setHeader('Content-Type', 'application/json');
        // Use the payload called back by the handler, or default to an object
        payload = typeof(payload) == 'object' ? payload : {};
        // Convert the payload to a string
        payloadString = JSON.stringify(payload);
      }
      if(contentType == 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof(payload) == 'string' ? payload : '';
      }
      if(contentType == 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if(contentType == 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if(contentType == 'png') {
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if(contentType == 'jpg') {
        res.setHeader('Content-Type', 'image/jpeg');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      if(contentType == 'plain') {
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
      }
      // Return the response-parts that are common to all content-types
      res.writeHead(statusCode);
      res.end(payloadString);
      // If the response is 200, print green. Otherwise print red
      if(statusCode == 200) {
        debug('\x1b[32m%s\x1b[0m', method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
      } else {
        debug('\x1b[31m%s\x1b[0m', method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
      }
    });
  });
};

// Define the router
server.router = {
  '' : handlers.index,
  'account/create' : handlers.accountCreate,
  'account/edit' : handlers.accountEdit,
  'account/deleted' : handlers.accountDeleted,
  'session/create' : handlers.sessionCreate,
  'session/deleted' : handlers.sessionDeleted,
  'orders/all' : handlers.ordersList,
  'orders/create' : handlers.ordersCreate,
  'orders/submit' : handlers.ordersSubmit,
  'ping': handlers.ping,
  'api/users': handlers.users,
  'api/tokens': handlers.tokens,
  'api/carts': handlers.carts,
  'api/orders' : handlers.orders,
  'api/menus' : handlers.menus,
  'favicon.ico' : handlers.favicon,
  'public' : handlers.public
};

// Initialize script
server.init = () => {
  // Create the menu
  handlers._menus.loadMenu(menu);

  // Start the HTTP server
  server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[36m%s\x1b[0m', "The HTTP server is listening on port "+config.httpPort+" in "+config.envName+" mode");
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log('\x1b[35m%s\x1b[0m', "The HTTPS server is listening on port "+config.httpsPort+" in "+config.envName+" mode");
  });
};

// Export the module
module.exports = server;
