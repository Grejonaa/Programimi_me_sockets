const express = require('express');
const { clients, messages } = require('./tcpServer');

const app = express();

app.get('/stats', (req, res) => {

  const format = req.query.format || 'json';

  const stats = {
    activeClients: clients.length,
    totalMessages: messages.length,
    lastMessages: messages.slice(-10),
    uptime: process.uptime(),

    roles: {
      admin: clients.filter(c => c.role === 'admin').length,
       user: clients.filter(c => c.role === 'user').length,
       readOnly: clients.filter(c => c.role === 'read-only').length
    }
  };

  // ==== JSON ====
  if (format==='json') {
    return res.json(stats);
  }

  // ====HTML ====
  if(format === 'html') {

  const html = `
  <html>
  <head>
     <title>Server Dashboard</title>
     <style>
         body {
                    font-family: Arial;
                    background: #0f172a;
                    color: white;
                    padding: 20px;
                }
                .card {
                    background: #1e293b;
                    padding: 15px;
                    margin-bottom: 15px;
                    border-radius: 10px;
                }
                .msg {
                    background: #334155;
                    padding: 6px;
                    margin: 4px 0;
                    border-radius: 6px;
                }
          
          </style>
          </head>
          <body>
          <h1>Server Dashboard</h1>

        <div class="card">
            <h2>Active Clients: 
            ${stats.activeClients}</h2>
                <h3>Total Messages: ${stats.totalMessages}</h3>
                <h3>Uptime: ${Math.floor(stats.uptime)} sec</h3>
                </div>

        <div class="card">
        <h2>Roles</h2>
        <p>Admin: ${stats.roles.admin}</p>
        <p>User: ${stats.roles.user}</p>
        <p>Read-only: ${stats.roles.readOnly}</p>

        </div>

        <div class="card">
        <h2> Last Messages</h2>
        ${stats.lastMessages.map(m=>`
          <div class="msg">${m.ip}: ${m.msg}
          </div>
          `).join('')}
          </div>
          <script>
             setInterval(() => location.reload(), 3000);
            </script>
        </body>
        </html>
    `;
    return res.send(html);
        }

        res.send("Invalid format");
      });

app.get('/health',(req,res)=>{
  res.send("OK");
});

app.listen(8080,()=>{
  console.log("HTTP server running on 8080");
});


