const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
    console.log("New WebSocket connection.");
    socket.emit("message", "Welcome!");
    socket.broadcast.emit("message", "A new user has joined!");

    socket.on("sendMessage", (message, callback) => {
        if (new Filter().isProfane(message)) {
            return callback("Profanity is not allowed");
        }

        io.emit("message", message);
        callback();
    });

    socket.on("sendLocation", (coords, callback) => {
        io.emit(
            "message",
            `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        );
        callback();
    });

    socket.on("disconnect", () => {
        io.emit("message", "A user has left!");
    });
});

server.listen(port, () => {
    console.log(`The server is up at port ${port}.`);
});
