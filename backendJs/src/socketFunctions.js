const BoardSockets = require("./controllers/BoardSockets");
const GameSockets = require("./controllers/GameSockets");
const PieceSockets = require("./controllers/PieceSockets");
const PlayerSockets = require("./controllers/PlayerSockets");
const SocketHelper = require("./controllers/SocketHelpers");

module.exports = wss => {
  wss.on("connection", ws => {
    //connection is up, let's add a simple simple event
    console.log("new connection");
    ws.on("open", () => {
      ws.send("open");
    });
    ws.on("message", message => {
      //log the received message and send it back to the client
      console.log("received: %s", message);
      if (/^startBoard\:/.test(message)) {
        BoardSockets.startBoard(wss, ws, message);
      } else if (/^getBoard\:/.test(message)) {
        BoardSockets.getBoard(wss, ws, message);
      } else if (/^movePiece\:/.test(message)) {
        BoardSockets.movePiece(wss, ws, message);
      } else if (/^joinGame\:/.test(message)) {
        GameSockets.joinGame(wss, ws, message);
      } else if (/^exitGame\:/.test(message)) {
        GameSockets.exitGame(wss, ws, message);
      } else if (/^startGame\:/.test(message)) {
        GameSockets.startGame(wss, ws, message);
      } else if (/^leaveGame\:/.test(message)) {
        GameSockets.leaveGame(wss, ws, message);
      } else if (/^hostGame\:/.test(message)) {
        GameSockets.hostGame(wss, ws, message);
      } else if (/^newPlayer\:/.test(message)) {
        PlayerSockets.newPlayer(wss, ws, message);
      } else if (/^broadcast\:/.test(message)) {
        SocketHelper.broadcast(wss, ws, message);
      } else {
        ws.send(`-> ${message}`);
      }
    });
    //send immediatly a feedback to the incoming connection
    ws.send("Hi there, I am a WebSocket server");
  });
};
