const { Game } = require("../models");
const { dataCompile } = require("./SocketHelpers");

module.exports = {
  // Requires boardID
  // Gets current instance of game
  async getAllGame(req, res) {
    try {
      const game = await Game.findAll();
      if (!game) {
        throw "Could not get all games";
      }
      return dataCompile(game);
    } catch (err) {
      return err;
    }
  },
  // Requires boardID
  // Gets current instance of game
  async getGame(req, res) {
    try {
      const game = await Game.findOne({
        where: {
          boardID: req.query.boardID
        }
      });
      console.log("game", game.toJSON());
      if (!game) {
        throw "Could not get game";
      }
      return dataCompile(game);
    } catch (err) {
      return err;
    }
  },
  // requires playerAID
  // Returns a game instance
  async hostGame(req, res) {
    try {
      const game = await Game.create({
        playerAID: req.playerID
      });
      if (!game) {
        throw "Could not host game";
      }
      return dataCompile(game);
    } catch (err) {
      return err;
    }
  },
  // Requires boardID and playerID
  // returns updated game instance
  async joinGame(req, res) {
    try {
      const game = await Game.findOne({
        where: {
          boardID: req.boardID,
          playerBID: null
        }
      });
      if (!game) {
        throw "No game found";
      }
      game
        .update({
          playerBID: req.playerID
        })
        .then(() => {});
      return dataCompile(game);
    } catch (err) {
      return err;
    }
  },
  // Requires playerBID
  // returns game instance
  async leaveGame(req, res) {
    try {
      const game = await Game.findOne({
        where: {
          boardID: req.boardID
        }
      });
      if (!game) {
        throw "Could not leave game";
      }
      game
        .update({
          playerBID: null
        })
        .then(() => {});
      return dataCompile(game);
    } catch (err) {
      return err;
    }
  },
  // Requires boardID
  // Returns game instance
  async startGame(req, res) {
    try {
      const game = await Game.findOne({
        where: {
          boardID: req.boardID
        }
      });
      if (!game) {
        throw "Could not start game";
      }
      if (game.playerBID === null) {
        throw "Could not start game";
      }
      game
        .update({
          running: true,
          turn: "white"
        })
        .then(() => {});
      return dataCompile(game);
    } catch (err) {
      return err;
    }
  },
  // Requires boardID
  // returns message
  async endGame(req, res) {
    // res.send("deleting game");
    try {
      const game = await Game.findOne({
        where: {
          boardID: req.boardID
        }
      });
      if (!game) {
        throw "Could not end game";
      }
      game.destroy().then(() => {});
      return dataCompile(game);
    } catch (err) {
      return err;
    }
  }
};
