const net = require('net');
const fs = require('fs');
const path = require('path');
const { exes } = require('child_process');

const PORT = 3000;
const HOST = '0.0.0.0';

const MAX_CLIENTS = 4;
const TIMEOUT = 300000;

let clients = [];
let messages = [];

const FILES_DIR = path.join(__dirname, '../files');
const LOG_FILE = path.join(__dirname, '../logs/server.log');


if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR);
if (!fs.existsSync(path.join(__dirname, '../logs'))) 
fs.mkdirSync(path.join(__dirname, '../logs'));

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(LOG_FILE, line);
    console.log(msg);
}

const server = net.createServer((socket) => {
    socket.username = "Guest";

    if (clients.length >= MAX_CLIENTS) {
        socket.write("Server full\n");
        socket.end();
        return;
    }

    socket.setEncoding('utf8');
    socket.role = 'user';
    socket.lastActivity = Date.now();

    clients.push(socket);

    log(`Client connected: ${socket.remoteAddress}`);

    socket.write("Connected to server\n");

    socket.on('data', (data) => {
        const input = data.toString().trim();
        socket.lastActivity = Date.now();

        messages.push({ ip: socket.remoteAddress, msg: input });

        // upload handling
       if (input.startsWith('UPLOAD:')) {
           if(socket.role === 'read-only'){
               socket.write("Permission denied (read-only)\n");
               return;
           }
           
    const data = input.replace('UPLOAD:', '');
    const parts = data.split('|');

    const filename = parts[0];
    const content = parts.slice(1).join('|');

    fs.writeFile(path.join(FILES_DIR, filename), content, (err) => {
        if (err) return socket.write("Upload error\n");
        socket.write("Upload successful\n");
    });

    return;
}

        // broadcast
        if (!input.startsWith('/')) {
            if(socket.role === 'read-only'){
                socket.write("Permission denied (read-only)\n");
                return;
            }
            
            broadcast(`${socket.username}: ${input}`, socket);
            return;
        }

        if (input === '/admin') {
            socket.role = 'admin';
            socket.write("You are admin\n");
            return;
        }

        handleCommand(socket, input);
    });

    socket.on('end', () => {
        clients = clients.filter(c => c !== socket);
        log(`Client disconnected`);
    });

    // timeout
    const interval = setInterval(() => {
        if (Date.now() - socket.lastActivity > TIMEOUT) {
            socket.write("Timeout\n");
            socket.end();
            clearInterval(interval);
        }
    }, 5000);
});

server.listen(PORT, HOST, () => {
    log(`TCP Server running on ${HOST}:${PORT}`);
});

// ===== BROADCAST =====
function broadcast(msg, sender) {
    clients.forEach(c => {
        if (c !== sender) c.write(msg + '\n');
    });
}

// ===== COMMANDS =====
function handleCommand(socket, input) {
    const [cmd, ...args] = input.split(' ');
    const arg = args.join(' ');

    switch (cmd) {
        case '/login':
            const [username, password] = args;

            if(!users[username] || users[username].pass !== password) {
                socket.write("Invalid credentials\n");
                return;
            }
            socket.username = username;
            socket.role = users[username].role;

            socket.write(`Logged in as ${username} (${socket.role})\n`);
            break;

        case '/list':
            fs.readdir(FILES_DIR, (err, files) => {
                if (err) return socket.write("Error reading files\n");
                socket.write(files.join('\n') + '\n');
            });
            break;

        case '/read':
            if (!arg) return socket.write("Usage: /read filename\n");
            fs.readFile(path.join(FILES_DIR, arg), 'utf8', (err, data) => {
                if (err) return socket.write("File not found\n");
                socket.write(data + '\n');
            });
            break;

        case '/delete':
            if (socket.role !== 'admin') return socket.write("Permission denied\n");
            fs.unlink(path.join(FILES_DIR, arg), (err) => {
                if (err) return socket.write("Error deleting file\n");
                socket.write("File deleted\n");
            });
            break;

        case '/info':
            fs.stat(path.join(FILES_DIR, arg), (err, stats) => {
                if (err) return socket.write("File not found\n");
                socket.write(`Size: ${stats.size}\nCreated: ${stats.birthtime}\n`);
            });
            break;

        case '/search':
            fs.readdir(FILES_DIR, (err, files) => {
                if (err) return socket.write("Error\n");
                const result = files.filter(f => f.includes(arg));
                socket.write(result.join('\n') + '\n');
            });
            break;

        case '/download':
            if (!arg) return socket.write("Usage: /download filename\n");
            fs.readFile(path.join(FILES_DIR, arg), 'utf8', (err, data) => {
                if (err) return socket.write("File not found\n");
                socket.write(`DOWNLOAD:${arg}|${data}\n`);
            });
            break;

        case '/clients':
            socket.write(`Active clients: ${clients.length}\n`);
            break;
        
        case '/name':
            if (!arg) return socket.write("Usage: /name yourname\n");
            socket.username = arg;
            socket.write(`Name set to ${arg}\n`);
            break;

        case '/execute':
        //Only admin can execute commands
            if(socket.role !== 'admin'){
                socket.write("Permission denied\n");
                break;
            }
            if(!arg){
                socket.write("Usage: /execute commad\n");
                break;
            }
            exes(arg, (error, stdout, stderr) => {
                if(error){
                    socket.write(`Error: ${error.message}\n`);
                    return;
                }
                if(stderr){
                    socket.write(`stderr: ${stderr}\n`);
                    return;
                }
                socket.write(`Result:\n${stdout}\n");
                });
                break;

        default:
            socket.write("Unknown command\n");
    }
}

module.exports = { clients, messages };