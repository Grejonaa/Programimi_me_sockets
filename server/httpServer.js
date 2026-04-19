const express = require('express');
const { clients, messages } = require('./tcpServer');

const app = express();

app.get('/stats', (req, res) => {

  const html = `
  <html>
  <head>
     <title>Server Dashboard</title>
     <style>
        body {
            font-family: Arial;
            background:color: white;
            padding: 20px;
  }

       .card {
                background: #1e293b;
                padding: 15px;
                margin-bottom: 15px;
                border-radius: 10px;
            }

            h1 {
                color: #38bdf8;
            }

            .msg {
            background:#334155;
            padding: 8px;
            margin: 5px, 0;
            border-radius: 6px;
            }
          
          </style>
          </head>
          <body>
          <h1>TCP Server Dashboard</h1>

        <div class="card">
            <h2>Active Clients: ${clients.length}</h2>
        </div>

        <div class="card">
            <h2>Last Messages</h2>
            ${messages.slice(-10).map(m =>
                `<div class="msg">${m.ip}: ${m.msg}</div>`
            ).join('')}
        </div>
    </body>
    </html>
    `;
  res.send(html);
          });

app.get('/health',(req,res)=>{
  res.send("OK");
});

app.listen(8080,()=>{
  console.log("HTTP server running on 8080");
});

