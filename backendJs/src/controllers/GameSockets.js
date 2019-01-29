const { Game } = require("../models");
const { myJsonify } = require("./SocketHelpers");
const GameController = require("./GameController");

module.exports = {
  async joinGame(wss, ws, message) {
    try {
      var jsonObject = myJsonify(/^joinGame: /, message);
      let data = {
        playerID: jsonObject.playerID,
        boardID: jsonObject.boardID
      };
      let response = await GameController.joinGame(data);
      if (!response) {
        throw "Game not found";
      }
      wss.clients.forEach(client => {
        client.send(`joinGame: ${response}`);
      });
    } catch (error) {
      console.log(error);
      ws.send(`joinGame: {OK: false, error: "${error}"}`);
    }
  },

  async hostGame(wss, ws, message) {
    try {
      var jsonObject = myJsonify(/^hostGame: /, message);
      let data = {
        playerID: jsonObject.playerID
      };
      let response = await GameController.hostGame(data);
      if (!response) {
        throw "Could not create new lobby";
      }
      ws.send("hostGame: " + response);
    } catch (error) {
      console.log(error);
      ws.send(`hostGame: {OK: false, error: "${error}"}`);
    }
  },
  async startGame(wss, ws, message) {
    try {
      var jsonObject = myJsonify(/^startGame: /, message);
      let data = {
        boardID: jsonObject.boardID
      };
      let response = await GameController.startGame(data);
      console.log(response);
      if (!response) {
        throw "Could not start game";
      }
      // ws.send("hostGame: " + response);
      wss.clients.forEach(client => {
        client.send(`startGame: ${response}`);
      });
    } catch (error) {
      console.log(error);
      ws.send(`startGame: {OK: false, error: "${error}"}`);
    }
  },
  async leaveGame(wss, ws, message) {
    try {
      var jsonObject = myJsonify(/^leaveGame: /, message);
      let data = {
        playerID: jsonObject.playerID,
        boardID: jsonObject.boardID
      };
      let response = await GameController.leaveGame(data);
      console.log(response);
      if (!response) {
        throw "Could not leave game";
      }
      // ws.send("hostGame: " + response);
      wss.clients.forEach(client => {
        if (client != ws) {
          client.send(`joinGame: ${response}`);
        }
      });
      ws.send(`leaveGame: ${response}`);
    } catch (error) {
      console.log(error);
      ws.send(`leaveGame: {OK: false, error: "${error}"}`);
    }
  },

  async exitGame(wss, ws, message) {
    try {
      var jsonObject = myJsonify(/^exitGame: /, message);
      let data = {
        playerID: jsonObject.playerID,
        boardID: jsonObject.boardID
      };
      let response = await GameController.endGame(data);
      console.log(response);
      if (!response) {
        throw "Could not leave game";
      }
      // ws.send("hostGame: " + response);
      wss.clients.forEach(client => {
        // if (client != ws) {
        client.send(`exitGame: ${response}`);
        // }
      });
      // ws.send(`exitGame: ${response}`);
    } catch (error) {
      console.log(error);
      ws.send(`exitGame: {OK: false, error: "${error}"}`);
    }
  }
};
