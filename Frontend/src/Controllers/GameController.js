import { myJsonify } from "./Helpers";
import { sendData } from "./SocketController.js";

export async function initLobby(socket, data) {
  sendData(socket, "hostGame", data);
}

export async function hostGame(message, updateState) {
  try {
    let new_message = await myJsonify(/^hostGame: /, message);
    if (!new_message.OK) {
      throw Error("Could not create new lobby");
    }
    updateState({
      lobbyID: new_message.data.boardID,
      playerAID: new_message.data.playerAID,
      playerBID: new_message.data.playerBID,
      visible: "lobby"
    });
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

export async function joinLobby(socket, data) {
  sendData(socket, "joinGame", data);
}
export async function joinGame(message, updateState, state) {
  try {
    console.log(message);
    let new_message = await myJsonify(/^joinGame: /, message);
    if (!new_message.OK) {
      throw Error("Could not join game");
    }
    // If playerAID or playerBID is your current id
    console.log(state.myID);
    if (
      new_message.data.playerAID === state.myID ||
      new_message.data.playerBID === state.myID
    ) {
      updateState({
        lobbyID: new_message.data.boardID,
        playerAID: new_message.data.playerAID,
        playerBID: new_message.data.playerBID,
        visible: "lobby"
      });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function leaveLobby(socket, data) {
  sendData(socket, "leaveGame", data);
}

export async function leaveGame(message, updateState, state) {
  try {
    console.log(message);
    let new_message = await myJsonify(/^leaveGame: /, message);
    if (!new_message.OK) {
      throw Error("Could not leave game");
    }
    // If playerAID or playerBID is your current id
    if (
      new_message.data.playerAID === state.myID ||
      new_message.data.playerBID === state.myID
    ) {
      updateState({
        lobbyID: new_message.data.boardID,
        playerAID: new_message.data.playerAID,
        playerBID: new_message.data.playerBID
        // visible: "lobby"
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function exitLobby(socket, data) {
  sendData(socket, "exitGame", data);
}

export async function exitGame(message, updateState, state) {
  try {
    console.log(message);
    let new_message = await myJsonify(/^exitGame: /, message);
    if (!new_message.OK) {
      throw Error("Could not exit game");
    }
    // If playerAID or playerBID is your current id
    if (
      new_message.data.playerAID === state.myID ||
      new_message.data.playerBID === state.myID
    ) {
      updateState({
        lobbyID: null,
        playerAID: null,
        playerBID: null,
        visible: "home"
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function startLobby(socket, data) {
  sendData(socket, "startGame", data);
}

export async function startGame(message, updateState, state) {
  try {
    console.log(message);
    let new_message = await myJsonify(/^startGame: /, message);
    if (!new_message.OK) {
      throw Error("Could not start game");
    }
    // If playerAID or playerBID is your current id
    if (
      new_message.data.playerAID === state.myID ||
      new_message.data.playerBID === state.myID
    ) {
      updateState({
        visible: "game",
        running: new_message.data.running,
        turn: new_message.data.turn
      });
    }
  } catch (error) {
    console.log(error);
  }
}
