const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

// Serve a basic HTTP route for sanity check
app.get('/', (req, res) => {
  res.send('WebSocket server is running 🚀');
});

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach WebSocket server to the same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New Client Connected.');

  ws.on('message', (data) => {
    console.log('Received: ', data);

    // Broadcast to all other clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client Disconnected.');
  });
});

// Start HTTP + WebSocket server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
