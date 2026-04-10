console.log("Server file started");
const net = require("net");

const PORT = 3000;
const HOST = "0.0.0.0";

const server = net.createServer((socket) => {
  console.log("Client connected:", socket.remoteAddress);

  socket.on("data", (data) => {
    const message = data.toString();
    console.log("Received:", message);

    // përgjigje klientit
    socket.write("Server received: " + message);
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.log("Error:", err.message);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});