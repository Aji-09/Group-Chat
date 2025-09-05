const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const messages = []; // store chat history

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send existing chat history to new client
    messages.forEach(msg => ws.send(JSON.stringify(msg)));

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data); // expect client JSON
            messages.push(message); // save to history

            // Broadcast to all clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        } catch (err) {
            console.error("Invalid message format:", data);
        }
    });

    ws.on('close', () => console.log('Client disconnected'));
});

console.log('WebSocket server running on ws://localhost:8080');
