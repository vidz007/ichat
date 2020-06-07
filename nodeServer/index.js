const express = require("express");
const socket = require("socket.io");
const http = require("http");
const app = express();
const path = require("path");

const server = http.createServer(app);

const publicFolder = path.join(__dirname,"./client");

app.use(express.static(publicFolder));

const port = process.env.PORT || 8000
server.listen(port, () => {
  console.log("listening on port 8000");
});

app.get("/", (req, res) => {
  res.send("index.html");
});

//Node server which will handle socket io connections
const io = socket(server);

const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name)
    });
    socket.on('send', message =>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
    });

})