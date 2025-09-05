const WebSocket = require('ws');

// Use dynamic port for Render, fallback to 8080 locally
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

const messages = []; // chat history

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send existing chat history to new clients
    messages.forEach(msg => ws.send(JSON.stringify(msg)));

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            messages.push(message);

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

console.log(`WebSocket server running on port ${PORT}`);
