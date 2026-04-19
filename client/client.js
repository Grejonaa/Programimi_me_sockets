const net = require("net");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let client;
let isRetrying = false;

function connect() {
  client = net.createConnection(3000, "127.0.0.1", () => {
  console.log("[LIDHUR] U lidhet me serverin.");
  isRetrying = false;
  rl.setPrompt("> ");
  rl.prompt();
});

client.on("close", () => {
  if (!isRetrying) {
    console.log("\n[SHKEPUTUR] Lidhja humbi. Duke provuar rilidhjen cdo 5 sekonda...");
    isRetrying = true;
  }
  setTimeout(connect, 5000);
});

client.on("error", (err) => {

});

client.on("data", (data) => {
  const message = data.toString();
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);

  console.log("\nSERVER:", message);
  rl.prompt();

  if(message.startsWith("DOWNLOAD:")){
    const parts = message.split("|");
    const filename = parts[0].replace("DOWNLOAD:", "");
    const content = parts.slice(1).join("|");

    const savePath = path.join(__dirname, "downloads", filename);
    if(!fs.existsSync(path.join(__dirname, "downloads"))){
      fs.mkdirSync(path.join(__dirname, "downloads"));
    }

    fs.writeFileSync(savePath, content);
    console.log("\n[FILE] File downloaded: ", savePath);
  }else{
    console.log("\nSERVER:", message);
  }
  rl.prompt();
  });
}

rl.on("line", (input) =>{
  
  if(client.destroyed) {
    console.log("Nuk ka lidhje me serverin. Ju lutem pritni...");
    return;
  }

  if(input.startsWith("/upload")){
    const filename = input.split(" ")[1];

    if(!fs.existsSync(filename)){
      console.log("File not found");
      rl.prompt();
      return;
    }

    const content = fs.readFileSync(filename, "utf8");
    client.write(`UPLOAD:${filename}|${content}`);
    return;
  }

  client.write(input);
  rl.prompt();
});

connect();
