const { Player } = require("../models");
const PlayerController = require("./PlayerController");

module.exports = {
  async newPlayer(wss, ws, message) {
    try {
      let response = await PlayerController.newPlayer();
      if (!response) {
        throw "Could not create new player";
      }
      ws.send("newPlayer: " + response);
    } catch (error) {
      ws.send(`newPlayer: {OK: false, error: "${error}"}`);
    }
  }
};
