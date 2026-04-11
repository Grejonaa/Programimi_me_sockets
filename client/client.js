const net = require('net');
const readline = require('readline');
const fs = require('fs');

const client = new net.Socket();

client.connect(3000, '127.0.0.1', () => {
  console.log("Connected tp server");
});

client.on('data', (data) => {
  const msg = data.toString();

  if(msg.startsWith('DOWNLOAD:')){
    const parts = msg.split('|');
    const filename = parts[0].replace('DOWNLOAD:', "");
    const content = parts[1];

    fs.writeFileSync(filename, content);
    console.log("File downloaded: ", filename);
    return;
  }

  console.log(msg);
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) =>{
  if(input.startsWith('/uploaded')){
    const filename = input.split('')[1];

    if(!fs.existsSync(filename)){
      console.log("File not found");
      return;
    }

    const content = fs.readFileSync(filename, 'utf8');
    client.write('UPLOAD:${filename}|${content}');
    return;
  }

  client.write(input);
});