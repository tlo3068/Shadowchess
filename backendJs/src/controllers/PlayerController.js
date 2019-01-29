const { Player } = require("../models");

module.exports = {
  // requires playerID
  // Returns player information
  async getAllPlayer(req, res) {
    // res.send("getting player info");
    console.log("attempting to get player info");
    const player = await Player.findAll();
    console.log("player", player.toJSON());
    if (!player) {
      return res.status(403).send({
        error: "No player found"
      });
    } else {
      const playerJson = player.toJSON();
      res.send({
        player: playerJson
      });
      // res.send("getting game");
    }
  },
  // requires playerID
  // Returns player information
  async getPlayer(req, res) {
    // res.send("getting player info");
    console.log("attempting to get player info");
    const player = await Player.findOne({
      where: {
        playerID: req.query.playerID
      }
    });
    console.log("player", player.toJSON());
    if (!player) {
      return res.status(403).send("No player found");
    } else {
      res.send(player);
      // res.send("getting game");
    }
  },
  // Requires nothing
  // Returns a new player
  async newPlayer(req, res) {
    // res.send("new player");
    try {
      console.log("Creating new player");
      const player = await Player.create();
      // const playerJson = player.toJSON();
      // console.log(playerJson);
      io.emit("message", playerJson);
      // res.send(playerJson);
      res.send(player);
    } catch (err) {
      res.status(400).send("Could not create new player");
    }
  },
  // requires playerID and new team
  // Returns team instance
  async setTeam(req, res) {
    // res.send("setting Team");
    const player = await Player.findOne({
      where: {
        playerID: req.body.playerID
      }
    });
    console.log("player", player.toJSON());
    if (!player) {
      return res.status(403).send({
        error: "No player found"
      });
    } else {
      player
        .update({
          boardID: req.body.boardID,
          team: req.body.team
        })
        .then(() => {});
      const playerJson = player.toJSON();
      res.send({
        player: playerJson
      });
    }
  },
  // Requires playerID
  // returns destroy message
  async deletePlayer(req, res) {
    // res.send("deleting player");
    const { playerID } = req.body;
    const player = await Player.findOne({
      where: {
        playerID: playerID
      }
    });
    console.log("player", player.toJSON());
    if (!player) {
      return res.status(403).send({
        error: "No player found"
      });
    } else {
      player.destroy().then(() => {});
      res.send({
        message: "Player destroyed"
      });
    }
  }
};
