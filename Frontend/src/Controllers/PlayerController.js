import { myJsonify } from "./Helpers";
import { sendData } from "./SocketController";

export async function initPlayer(socket) {
  sendData(socket, "newPlayer", null);
}
export async function newPlayer(message, updateState) {
  try {
    let new_message = await myJsonify(/^newPlayer: /, message);
    if (!new_message.OK) {
      throw Error("Could not create new player");
    }
    // updateState(new_message.data.playerID);
    updateState({ myID: new_message.data.playerID });
  } catch (error) {
    console.log(error);
  }
}
