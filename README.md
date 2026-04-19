# TCP Socket Project

## Description
Ky projekt implementon një arkitekturë klient-server duke përdorur Node.js dhe protokollin TCP. Sistemi është i dizajnuar për të menaxhuar komunikimin simultan, transferimin e skedarëve dhe monitorimin e performancës në kohë reale përmes një ndërfaqeje HTTP.

├── client/
│   └── client.js       Logjika e terminalit të klientit 
├── server/
│   ├── tcpServer.js     Serveri kryesor(Port 1337)
│   └── httpServer.js    Monitorimi HTTP (Port 3000)
├── files/               Depoja e skedarëve
├── logs/                Regjistrimi i eventeve në kohë reale
├── package.json         Varësitë
└── README.md            Dokumentacioni teknik

## Features
- Multi-client TCP server (max 4 clients): Serveri menaxhon deri në 4 klientë simultanë duke përdorur asinkronizmin e Node.js, duke siguruar që asnjë klient të mos bllokojë tjetrin.
- Broadcast messaging: Mundësi për dërgimin e mesazheve te të gjithë klientët e lidhur ose komunikimin specifik mes tyre.
- File management (list, read, delete, search): Sistemi lejon listimin(list), leximin e përmbajtjes (read), fshirjen e sigurt(delete) dhe kërkimin e shpejtë të skedarëve(search) brenda direktorisë /files.
- Upload and download files: Implementim i transferit të të dhënave në format "Stream", që lejon dërgimin e skedarëve pa mbingarkuar memorien RAM.
- Admin role: Sistem i integruar rolesh ku komandat kritike(si fshirja apo ekzekutimi i sistemit) janë të kufizuara vetëm për përdoruesin me rolin admin.
- Timeout handling: Monitorim automatik i lidhjeve; serveri ndërpret socket-et joaktive për të kursyer resurset e sistemit.
- HTTP monitoring (/stats): Një dashboard i integruar (Express) i aksesueshëm në rrugën /stats, që shfaq statistikat e serverit dhe statusin e klientëve.

## Commands
/list - Liston emrat e të gjithë skedarëve të disponueshëm në server.
/read filename - Shfaq përmbajtjen tekst të një skedari direkt në terminal.
/delete filename (admin) - (Vetëm admin) Fshin skedarin e specifikuar nga sistemi.
/info filename - Shfaq metadata për skedarin(madhësia, data e krijimit).
/search keyword - Kërkon për skedarë që përmbajnë fjalën kyqe në emrin e tyre.
/upload filename - Transferon një skedar nga pajisja lokale e klientit te serveri.
/download filename - Shkarkon skedarin nga serveri në memorien e klientit.
/admin - Komandë për kalimin në modalitetin e administratorin(kërkon vërtetim).

## Run
npm install

Server:
node server/tcpServer.js

HTTP:
node server/httpServer.js

Client:
node client/client.js
