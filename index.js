const express = require('express');
const {createServer} = require('node:http');

const app = express();
const server = createServer(app);
const {join} = require('node:path');
const {Server} = require('socket.io');
const io = new Server(server);
const sqlite3 = require('sqlite3');
const {open} = require('sqlite');

async function main(){

    const db = await open({
        filename: 'chat.db',
        driver: sqlite3.Database
    });

    await db.exec('
        CREATE TABLE IF NOT EXIST messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_offset TEXT UNIQUE,
            content TEXT
        )
    
   ')
app.get('/', (req, res)=>{
    res.sendFile(join(__dirname, "/index.html"));
});

io.on('connection', async (socket)=>{
    console.log('A user is connected ...');
    socket.on('Chat Message', async (msg)=>{
        try{
            const result = await db.run("INSERT INTO messages (content) VALUES (?)", msg);
            io.emit("Chat Message", msg, result.lastID);

        } catch(e){
            console.log(e);
        }
    });
    if (!socket.recovered) {
        try{
            await db.each("SELECT id, content FROM messages WHERE id > ?", [socket.handshake.auth.serverOffset || 0], (_err, row)=>{
                socket.emit("Chat Message", row.content, row.id);
            })
        }catch(e){
            console.log(e)
        }
    }
});

server.listen(3000, ()=>{
    console.log("server is running at port 3000...");
})
}
main();