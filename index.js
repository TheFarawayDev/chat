const { Server } = require('ws');

// Create a WebSocket server on port 3000 (Vercel will assign a port)
const wss = new Server({ port: 3000 });

// Store connected clients
const clients = new Set();

// Function to send a message to all connected clients
function broadcast(message) {
    for (const client of clients) {
        if (client.readyState === 1) { // Check if the client is connected
            client.send(message);
        }
    }
}

// Event listener for when a client connects to the server
wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws); // Add the new client to the set

    // Event listener for messages from the client
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        broadcast(message); // Broadcast the message to all clients
    });

    // Event listener for when the client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws); // Remove the client from the set
    });

    // Error handling for the client
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

console.log('WebSocket server started on port 3000');

// Export the WebSocket server (required for Vercel deployment)
module.exports = (req, res) => {
    if (req.url === '/_vercel/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        return;
    }
    // Handle HTTP requests if needed.  For a pure websocket server, this can be minimal.
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running.  Use a WebSocket client to connect.');
};
