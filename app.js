const express = require("express");
const http = require("http");
const fs = require("fs");

const app = express();

const hostname = "0.0.0.0";
const port = 3000;

const PUBLIC_DIR = __dirname + "/public";

function getClientIP(req) {
  return (
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown"
  );
}

app.use((req, res, next) => {

  const ip = getClientIP(req);
  const userAgent = req.headers["user-agent"];
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();

  const log = `[${timestamp}] IP:${ip} URL:${url} UA:${userAgent}\n`;

  console.log(log.trim());

  fs.appendFile("logs.txt", log, (err) => {
    if (err) console.error("Erreur log:", err);
  });

  next();
});

app.use(express.static(PUBLIC_DIR));

app.get("*", (req, res) => {
  res.sendFile("index.html", { root: PUBLIC_DIR });
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});