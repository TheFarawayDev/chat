const { Server } = require('ws');

let wss;

module.exports = (req, res) => {
  if (!res.socket.server.wss) {
    wss = new Server({ server: res.socket.server });
    res.socket.server.wss = wss;
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        // Broadcast to everyone else
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === 1) {
            client.send(message);
          }
        });
      });
    });
    console.log('WebSocket server started!');
  }
  res.status(200).end();
};
