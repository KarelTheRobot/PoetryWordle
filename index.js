const express = require('express');
const app = express();
const http = require('http');
const server_ = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server_);
const path = require("path");

app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/css", express.static(path.join(__dirname, "css")));

var io_client = require("socket.io-client");
var socket_client = io_client.connect("http://localhost:8080", {reconnect: true});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit("test123", {"a": 3});
  socket.on("request", (msg) => {
    socket_client.emit("server_req", msg, (res, err) => {
      if (err) {
        console.log(err);
      }
      io.emit("response", res);
      console.log(res);
    });
    //console.log(msg);
  });
  socket.on("use_all_request", (msg) => {
    socket_client.emit("use_all_server_req", msg, (res, err) => {
      if (err) {
        console.log(err);
      }
      io.emit("use_all_response", res);
      console.log(res);
    });
  })
});

server_.listen(3000, () => {
  console.log('listening on *:3000');
});