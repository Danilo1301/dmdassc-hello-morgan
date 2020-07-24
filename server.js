const express = require('express'), path = require('path'), app = express(), http = require('http').Server(app), io = require('socket.io')(http), cookieParser = require('cookie-parser');

const settings = {port: 3000, ip: "127.0.0.1"};

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static(__dirname + "/resources"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/views/game.html"));
});

app.get("/js/index.js", function(req, res) {
  res.sendFile(path.join(__dirname, "/game/Preload.js"));
});

app.get("/game/*", function(req, res) {
  var name = req.originalUrl.split("?")[0];
  res.sendFile(path.join(__dirname, name));
});

http.listen(settings.port, settings.ip, function() {
  console.log("[server.js] Listening on port " + settings.port);
});

require("./game/Game.js");
