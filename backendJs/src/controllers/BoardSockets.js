const { Board, Piece } = require("../models");
const { myJsonify } = require("./SocketHelpers");
const BoardController = require("./BoardController");
module.exports = {
  async startBoard(wss, ws, message) {
    try {
      var jsonObject = myJsonify(/^startBoard: /, message);
      let data = {
        boardID: jsonObject.boardID
      };
      let response = await BoardController.startBoard(data);
      console.log(response);
      if (!response) {
        throw "Could not start board";
      }
      //   ws.send("startBoard: " + response);
      wss.clients.forEach(client => {
        client.send(`startBoard: ${response}`);
      });
    } catch (error) {
      console.log(error);
      ws.send(`startBoard: {OK: false, error: "${error}"}`);
    }
  },
  async getBoard(wss, ws, message) {
    try {
      var jsonObject = myJsonify(/^getBoard: /, message);
      let data = {
        boardID: jsonObject.boardID
      };
      let response = await BoardController.getBoard(data);
      console.log(response);
      if (!response) {
        throw "Could not start game";
      }
      ws.send("getBoard: " + response);
      //   wss.clients.forEach(client => {
      //     client.send(`getBoard: ${response}`);
      //   });
    } catch (error) {
      console.log(error);
      ws.send(`getBoard: {OK: false, error: "${error}"}`);
    }
  },
  async movePiece(wss, ws, message) {
    try {
      var jsonObject = myJsonify(/^movePiece: /, message);
      let data = {
        boardID: jsonObject.boardID,
        i_position_x: jsonObject.i_position_x,
        i_position_y: jsonObject.i_position_y,
        f_position_x: jsonObject.f_position_x,
        f_position_y: jsonObject.f_position_y
      };
      let response = await BoardController.movePiece(data);
      console.log(response);
      if (!response) {
        throw "Could not move Piece";
      }
      // ws.send("movePiece: " + response);
      wss.clients.forEach(client => {
        client.send(`movePiece: ${response}`);
      });
      //   wss.clients.forEach(client => {
      //     client.send(`getBoard: ${response}`);
      //   });
    } catch (error) {
      console.log(error);
      ws.send(`getBoard: {OK: false, error: "${error}"}`);
    }
  }
};
