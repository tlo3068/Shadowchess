import { startBoard, getBoard, movePiece } from "./BoardController";
import {
  hostGame,
  joinGame,
  leaveGame,
  startGame,
  exitGame
} from "./GameController";
// import PieceController from "./PieceController";
import { newPlayer } from "./PlayerController";

export async function initSocket(socket, updateState, state) {
  try {
    socket.onopen = function(event) {
      console.log("WebSocket is now open.");
      sendData(socket, "newPlayer", null);
    };
    socket.onclose = function(event) {
      console.log("WebSocket is now closed.");
      socket.close();
    };
    socket.onerror = function(event) {
      console.error("WebSocket error observed:", event);
    };
  } catch (error) {
    console.log(error);
  }
}
export async function initSocketMessages(socket, updateState, state) {
  socket.onmessage = function(event) {
    let message = event.data;
    if (/^startBoard: /.test(message)) {
      startBoard(message, updateState, state);
    } else if (/^getBoard: /.test(message)) {
      getBoard(message, updateState, state);
    } else if (/^movePiece: /.test(message)) {
      movePiece(message, updateState, state);
    } else if (/^hostGame: /.test(message)) {
      hostGame(message, updateState);
    } else if (/^joinGame: /.test(message)) {
      joinGame(message, updateState, state);
    } else if (/^leaveGame: /.test(message)) {
      leaveGame(message, updateState, state);
    } else if (/^startGame: /.test(message)) {
      startGame(message, updateState, state);
    } else if (/^exitGame: /.test(message)) {
      exitGame(message, updateState, state);
    } else if (/^newPlayer: /.test(message)) {
      newPlayer(message, updateState);
    } else {
      console.log("message =", message);
    }
  };
}
export async function sendData(socket, method, data) {
  try {
    if (socket.readyState === 1) {
      console.log(data);
      socket.send(method + ": " + JSON.stringify(data));
    } else {
      throw Error("Socket not available for use");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function sendMessage(socket, message) {
  socket.send(`${message}`);
}

/*
// Send Data API
// Game
  sendData(socket, "endGame", data)
  sendData(socket, "getGame", data)
  sendData(socket, "hostGame", data)
  sendData(socket, "joinGame", data)
  sendData(socket, "leaveGame", data)
  sendData(socket, "startGame", data)
// Board
  sendData(socket, "getBoard", data);
  sendData(socket, "movePiece", data);
  sendData(socket, "startBoard", data);
  sendData(socket, "getPieceByLocation", data);
// Piece
  sendData(socket, "getPiece", data);
  sendData(socket, "addPiece", data);
  sendData(socket, "removePiece", data);
// Player
  sendData(socket, "getPlayer", data);
  sendData(socket, "newPlayer", data);
  sendData(socket, "deletePlayer", data);
  sendData(socket, "setTeam", data);  
*/
