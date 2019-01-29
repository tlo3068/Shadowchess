const { Game } = require("../models");

module.exports = {
  // Requires boardID
  // Gets current instance of game
  async getAllGame(req, res) {
    const game = await Game.findAll();
    if (!game) {
      return res.status(403).send({
        error: "No game found"
      });
    } else {
      res.send(game);
    }
  },
  // Requires boardID
  // Gets current instance of game
  async getGame(req, res) {
    console.log("attempting to get game info");
    const game = await Game.findOne({
      where: {
        boardID: req.query.boardID
      }
    });
    console.log("game", game.toJSON());
    if (!game) {
      return res.status(403).send({
        error: "No game found"
      });
    } else {
      res.send(game);
    }
  },
  // requires playerAID
  // Returns a game instance
  async hostGame(req, res) {
    try {
      console.log("Starting new game");
      console.log("host req body = ", req);
      let data = {
        playerAID: req.playerAID
      };
      const game = await Game.create(data);
      const gameJson = game.toJSON();
      console.log(gameJson);
      res.send(gameJson);
    } catch (err) {
      console.log("error found");
      res.status(400).send({
        error: "Could not start a new game"
      });
    }
  },
  // Requires boardID and playerID
  // returns updated game instance
  async joinGame(req, res) {
    console.log("attempting to join game");
    console.log(req);
    const game = await Game.findOne({
      where: {
        boardID: req.boardID,
        playerBID: null
      }
    });
    // const game = await Game.findAll();
    console.log("Game = ", game);
    if (!game) {
      return res.status(403).send({
        error: "No game found"
      });
    } else {
      console.log("game", game.toJSON());
      console.log("req body", req);
      game
        .update({
          playerBID: req.playerID
        })
        .then(() => {});
      console.log(game.toJSON());
      const gameJson = game.toJSON();
      res.send({
        game: gameJson
      });
    }
    // res.send("joining game");
  },
  // Requires playerBID
  // returns game instance
  async leaveGame(req, res) {
    console.log("attempting to leave game");
    const { boardID } = req;
    const game = await Game.findOne({
      where: {
        boardID: boardID
      }
    });
    console.log("game", game.toJSON());
    if (!game) {
      return res.status(403).send({
        error: "No game found"
      });
    } else {
      game
        .update({
          playerBID: null
        })
        .then(() => {});
      console.log(game.toJSON());
      const gameJson = game.toJSON();
      res.send({
        game: gameJson
      });
    }
  },
  // Requires boardID
  // Returns game instance
  async startGame(req, res) {
    // res.send("starting game");
    console.log("attempting to start game");
    const { boardID } = req;
    const game = await Game.findOne({
      where: {
        boardID: boardID
      }
    });
    console.log("game", game.toJSON());
    if (!game) {
      return res.status(403).send({
        error: "No game found"
      });
    } else if (game.playerBID === null) {
      return res.status(403).send({
        error: "Cannot start game"
      });
    } else {
      game
        .update({
          running: true,
          turn: "white"
        })
        .then(() => {});
      console.log(game.toJSON());
      const gameJson = game.toJSON();
      res.send(gameJson);
    }
  },
  // Requires boardID
  // returns message
  async endGame(req, res) {
    // res.send("deleting game");
    const { boardID } = req;
    const game = await Game.findOne({
      where: {
        boardID: boardID
      }
    });
    console.log("game", game.toJSON());
    if (!game) {
      return res.status(403).send({
        error: "No game found"
      });
    } else {
      game.destroy().then(() => {});
      res.send({
        message: "Game destroyed"
      });
    }
  }
};
