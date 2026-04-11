console.log("Client started");

const net = require("net");

const PORT = 3000;
const HOST = "127.0.0.1"; // ose IP e serverit

const client = net.createConnection(PORT, HOST, () => {
  console.log("Connected to server");

  // dërgo një mesazh
  client.write("Hello Server!");
});

client.on("data", (data) => {
  console.log("Server says:", data.toString());

  // mbylle lidhjen pas përgjigjes
  client.end();
});

client.on("end", () => {
  console.log("Disconnected from server");
});

client.on("error", (err) => {
  console.log("Client error:", err.message);
});
