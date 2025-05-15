const { Server } = require('ws');

let wss;

module.exports = (req, res) => {
  if (!res.socket.server.wss) {
    wss = new Server({ server: res.socket.server });
    res.socket.server.wss = wss;
    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(message.toString());
          }
        });
      });
    });
  }
  res.status(200).end();
};
