const { Piece } = require("../models");
const { dataCompile } = require("./SocketHelpers");
module.exports = {
  // Returns piece instance
  async getAllPiece(req, res) {
    console.log("attempting to get piece info");
    const piece = await Piece.findAll();
    if (!piece) {
      return res.status(403).send({
        error: "No piece found"
      });
    } else {
      res.send(piece);
    }
  },
  // Requires pieceID
  // Returns piece instance
  async getPiece(req, res) {
    // res.send("getting piece");
    console.log("attempting to get piece info");
    const piece = await Piece.findOne({
      where: {
        pieceID: req.query.pieceID
      }
    });

    if (!piece) {
      console.log("no piece here");
      return res.status(403).send({
        error: "No piece found"
      });
    } else {
      console.log("piece", piece.toJSON());
      res.send(piece);
    }
  },
  //   async promotePiece(req, res) {
  //     res.send("promoting piece");
  //   },
  // Requires pieceID
  // Returns delete message
  async removePiece(req, res) {
    // res.send("removing piece");
    const { pieceID } = req.body;
    const piece = await Piece.findOne({
      where: {
        pieceID: pieceID
      }
    });
    console.log("piece", piece.toJSON());
    if (!piece) {
      return res.status(403).send({
        error: "No piece found"
      });
    } else {
      piece.destroy().then(() => {});
      res.send({
        message: "Piece destroyed"
      });
    }
  },
  // Requires team, name
  // Returns piece information
  async addPiece(req, res) {
    try {
      console.log("creating new piece");
      const piece = await Piece.create(req.body);
      const pieceJson = piece.toJSON();
      console.log(pieceJson);
      res.send(pieceJson);
    } catch (err) {
      res.status(400).send({
        error: "Could not create a new piece"
      });
    }
  }
};
