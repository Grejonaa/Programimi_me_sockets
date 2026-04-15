const express = require('express');
const { clients, messages } = require('./tcpServer');

const app = express();

app.get('/stats', (req, res) => {
res.json({
activeClients: clients.length,
lastMessages: messages.slice(-10)
});
});

app.get('/health',(req,res)=>{
  res.send("OK");
});

app.listen(8080,()=>{
  console.log("HTTP server running on 8080");
});

