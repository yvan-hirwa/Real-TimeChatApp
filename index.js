const express = require('express');
const {createServer} = require('node:http');

const app = express();
const server = createServer(app);
const {join} = require('node:path');
const {Server} = require('socket.io');
const io = new Server(server);

app.get('/', (req, res)=>{
    res.sendFile(join(__dirname, "/index.html"));
})

io.on('connection', (socket)=>{
    console.log('A user is connected ...');
    socket.on('Chat Message', (msg)=>{
        io.emit('Chat Message', msg);
    })
})

server.listen(3000, ()=>{
    console.log("server is running at port 3000...");
})