"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { sequelize } = require("./db/models");
// import * as sequelize from "./models";
const config = require("./db/config");
const app = express();
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
    //connection is up, let's add a simple simple event
    console.log("new connection");
    ws.on("open", () => {
        console.log("open");
        ws.send("open");
    });
    ws.on("message", (message) => {
        //log the received message and send it back to the client
        console.log("received: %s", message);
        if (/^joinGame\:/.test(message)) {
            joinGame(ws, message);
        }
        else if (/^broadcast\:/.test(message)) {
            broadcast(ws, message);
        }
        else {
            ws.send(`-> ${message}`);
        }
    });
    //send immediatly a feedback to the incoming connection
    ws.send("Hi there, I am a WebSocket server");
});
//start our server
sequelize.sync().then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on port 5000 :)`);
        console.log(process.env.PORT);
    });
});
function joinGame(ws, message) {
    console.log("Join Game function called");
    console.log(message);
    let new_message = message.replace(/^joinGame: /, "");
    console.log("new message = ", new_message);
    var jsonObject = JSON.parse(String(new_message));
    console.log(JSON.stringify(jsonObject));
    console.log("roomID = ", jsonObject.roomID);
    let data = {
        myID: "myID",
        roomID: "roomID",
        OK: true
    };
    // console.log(message);
    ws.send("joinGame: " + JSON.stringify(data));
}
exports.joinGame = joinGame;
function broadcast(ws, message) {
    //send back the message to the other clients
    wss.clients.forEach(client => {
        if (client != ws) {
            client.send(`Hello, broadcast message -> ${message}`);
        }
    });
}
exports.broadcast = broadcast;
//# sourceMappingURL=server.js.map