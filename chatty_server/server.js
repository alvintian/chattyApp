// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({
  server
});
// wss.broadcast = function broadcast(data) {
//   // wss.clients.forEach(function each(client) {
//   //   if (client.readyState === WebSocket.OPEN) {
//   //     client.send(data);
//   //   }
//   // });
// };

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
    wss.clients.forEach(client => {
      client.send(wss.clients.size);
    });  
//wss.broadcast(data);
  ws.on('message', function incoming(data) {
    data = JSON.parse(data);
    data.id = uuidv1(data);
    if (data.type === "postNotification") {
      data.type = "incomingNotification";
    } else {
      data.type = "incomingMessage";
    }
    data = JSON.stringify(data);
    console.log(data, "data in websocket");
//wss.broadcast(data);
    wss.clients.forEach(client => {
      client.send(data);
    })
  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
        wss.clients.forEach(client => {
      client.send(wss.clients.size);
    })}
//wss.bro
    );
});