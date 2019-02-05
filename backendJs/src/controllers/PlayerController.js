const { Player } = require("../models");
const { dataCompile } = require("./SocketHelpers");
module.exports = {
  // requires playerID
  // Returns player information
  async getAllPlayer(req, res) {
    // res.send("getting player info");
    try {
      const player = await Player.findAll();
      if (!player) {
        throw "Could not get all players";
      }
      return dataCompile(player);
    } catch (err) {
      return err;
    }
  },
  // requires playerID
  // Returns player information
  async getPlayer(req, res) {
    // res.send("getting player info");
    try {
      const player = await Player.findOne({
        where: {
          playerID: req.query.playerID
        }
      });
      if (!player) {
        throw "Could not get player";
      }
      return dataCompile(player);
    } catch (err) {
      return err;
    }
  },
  // Requires nothing
  // Returns a new player
  async newPlayer(req, res) {
    // res.send("new player");
    try {
      console.log("Creating new player");
      const player = await Player.create();
      if (!player) {
        throw "Could not create player";
      }
      return dataCompile(player);
    } catch (err) {
      return err;
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
