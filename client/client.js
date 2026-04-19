const net = require("net");
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = net.createConnection(3000, "127.0.0.1", () => {
  console.log("Connected to server");
  console.log("Set name: /name yourname");
  rl.setPrompt("> ");
  rl.prompt();
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

    const path = require("path");
    const fs = require("fs");

    const savePath = path.join(__dirname, "downloads", filename);

    if(!fs.existsSync(path.join(__dirname, "downloads"))){
      fs.mkdirSync(path.join(__dirname, "downloads"));
    }

    fs.writeFileSync(savePath, content);
    console.log("File downloaded: ", savePath);
  }
});

rl.on("line", (input) =>{
  rl.prompt();

  if(input.startsWith("/upload")){
    const filename = input.split(" ")[1];

    if(!fs.existsSync(filename)){
      console.log("File not found");
      return;
    }

    const content = fs.readFileSync(filename, "utf8");
    client.write(`UPLOAD:${filename}|${content}`);
    return;
  }

  client.write(input);
});
