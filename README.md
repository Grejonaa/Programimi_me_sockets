# TCP Socket Project

## Description
This project implements a TCP server-client system using Node.js.

## Features
- Multi-client TCP server (max 4 clients)
- Broadcast messaging
- File management (list, read, delete, search)
- Upload and download files
- Admin role
- Timeout handling
- HTTP monitoring (/stats)

## Commands
/list
/read filename
/delete filename (admin)
/info filename
/search keyword
/upload filename
/download filename
/admin

## Run
npm install

Server:
node server/tcpServer.js

HTTP:
node server/httpServer.js

Client:
node client/client.js
