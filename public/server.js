const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('WebSocket Server started at ws://localhost:8080');
});

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
