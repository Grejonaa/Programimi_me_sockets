const http = require('http');
const { clients, messages } = require('./tcpServer');
const PORT = 8080;
const server = http.createServer((req, res) => {
  if(req.url === '/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type' : 'application/json' });

  const monitorData = {
    status: "Online",
    active_connections: clients.length,
    total_messages: messages.length,
    connected_ips: clients.map(c => c.remoteAddress),
    last_messages: messages.slice(-5)
  };
    res.end(JSON.stringify(monitorData, null, 2));
  }else{
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end("Per monitorin vizitoni / stats");
  }
});
server.listen(PORT, () => {
  console.log('[HTTP] Monitori po punon ne http:/localhost:'${PORT}/stats');
});
