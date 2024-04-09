const express = require('express');
const {createServer} = require('node:http');

const app = express();
const server = createServer(app);
const {join} = require('node:path');

app.get('/', (req, res)=>{
    res.sendFile(join(__dirname, "/index.html"));
})

server.listen(3000, ()=>{
    console.log("server is running at port 3000...");
})