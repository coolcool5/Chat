const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
app.get("/style.css", (req, res) => {
  res.sendFile(join(__dirname, "style.css"));
});
app.get("/script.js", (req, res) => {
  res.sendFile(join(__dirname, "script.js"));
});

io.on("connection", (socket) => {
  socket.on("m", function(m) {
    io.emit(m.r, {u:m.u, c:m.c, m:m.m});
  });
});

server.listen(3000);
