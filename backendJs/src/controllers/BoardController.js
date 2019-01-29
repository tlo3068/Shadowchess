const { Board, Piece } = require("../models");

module.exports = {
  async getAllBoard(req, res) {
    console.log("attempting to get game info");
    const board = await Board.findAll();
    console.log("board", board);
    if (!board) {
      return res.status(403).send({
        error: "No board found"
      });
    } else {
      res.send(board);
    }
  },
  // Requires boardID
  // Gets board details
  async getBoard(req, res) {
    try {
      const board = await Board.findAll({
        where: {
          boardID: req.query.boardID
        }
      });
      if (!board) {
        throw Error("No board found");
      }
      const pieces = await Promise.all(
        board.map(piece => Piece.findOne({ where: { pieceID: piece.pieceID } }))
      );
      const newBoard = board.map(piece => {
        const pieceData = pieces.find(p => p.pieceID === piece.pieceID);
        return {
          boardID: piece.boardID,
          position_x: piece.position_x,
          position_y: piece.position_y,
          pieceData: {
            team: pieceData.team,
            name: pieceData.name
          }
        };
      });
      res.send(newBoard);
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  },

  // Requires pieceID and position_x
  // Returns piece information
  async addPiece(req, res) {
    // res.send("adding piece");
    try {
      console.log("adding piece");
      const piece = await Piece.create(req);
      const pieceJson = piece.toJSON();
      console.log(pieceJson);
      res.send(pieceJson);
    } catch (err) {
      res.status(400).send({
        error: "Could not create piece"
      });
    }
  },
  // requires boardID and pieceID
  // Returns message
  async removePiece(req, res) {
    const piece = await Board.findOne({
      where: {
        boardID: req.boardID,
        pieceID: req.pieceID
      }
    });
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
  // Requires pieceID and new position_x
  // returns new piece information
  async movePiece(req, res) {
    console.log("moving piece");
    const piece = await Board.findOne({
      where: {
        boardID: req.boardID,
        position_x: req.i_position_x,
        position_y: req.i_position_y
      }
    });
    // console.log("piece", piece.toJSON());
    if (!piece) {
      return res.status(403).send({
        error: "No piece found"
      });
    } else {
      const pieceInfo = await Piece.findOne({
        where: {
          pieceID: piece.pieceID
        }
      });
      // Movement depends on
      // Piece type
      // Valid move (within new position_x)
      // Valid move (checked)
      // Valid move (another piece blocking)

      // Special cases
      // En passant
      // Castle

      // console.log(pieceInfo.name, pieceInfo.team);
      // console.log(
      //   req.f_position_y,
      //   req.i_position_y,
      //   req.f_position_x,
      //   req.i_position_x,
      //   req.f_position_y - req.i_position_y,
      //   req.f_position_x - req.i_position_x
      // );
      if (
        req.f_position_y - req.i_position_y === 0 &&
        req.f_position_x - req.i_position_x === 0
      ) {
        return res.status(403).send({
          error: "cannot move piece"
        });
      }
      if (pieceInfo.name === "pawn") {
        // Check movement
        if (pieceInfo.team === "white") {
          if (
            !(
              req.f_position_x - req.i_position_x === 0 &&
              req.f_position_y - req.i_position_y === 1
            )
          ) {
            return res.status(403).send({
              error: "cannot move piece"
            });
          }
        } else if (pieceInfo.team === "black") {
          if (
            !(
              req.f_position_x - req.i_position_x === 0 &&
              req.f_position_y - req.i_position_y === -1
            )
          ) {
            return res.status(403).send({
              error: "cannot move piece"
            });
          }
        }
      } else if (pieceInfo.name === "rook") {
        if (
          !(
            req.f_position_y - req.i_position_y === 0 ||
            req.f_position_x - req.i_position_x === 0
          )
        ) {
          return res.status(403).send({
            error: "cannot move piece"
          });
        }
        // Check movement
      } else if (pieceInfo.name === "knight") {
        if (
          !(
            knightmovement(
              req.i_position_x,
              req.f_position_x,
              req.i_position_y,
              req.f_position_y,
              2,
              1
            ) ||
            knightmovement(
              req.i_position_x,
              req.f_position_x,
              req.i_position_y,
              req.f_position_y,
              1,
              2
            )
          )
        ) {
          return res.status(403).send({
            error: "cannot move piece"
          });
        }
        // Check movement
      } else if (pieceInfo.name === "bishop") {
        // Check movement
        if (
          Math.abs(req.f_position_y - req.i_position_y) !==
          Math.abs(req.f_position_x - req.i_position_x)
        ) {
          return res.status(403).send({
            error: "cannot move piece"
          });
        }
      } else if (pieceInfo.name === "queen") {
        if (
          !(
            req.f_position_y - req.i_position_y === 0 ||
            req.f_position_x - req.i_position_x === 0 ||
            Math.abs(req.f_position_y - req.i_position_y) ===
              Math.abs(req.f_position_x - req.i_position_x)
          )
        ) {
          return res.status(403).send({
            error: "cannot move piece"
          });
        }

        // Check movement
      } else if (pieceInfo.name === "king") {
        if (
          Math.abs(req.f_position_y - req.i_position_y) > 1 ||
          Math.abs(req.f_position_x - req.i_position_x) > 1
        ) {
          return res.status(403).send({
            error: "Cannot move piece"
          });
        }
        // Check movement
      } else {
        return res.status(403).send({
          error: "Cannot move piece"
        }); // false
      }
      const destPiece = await Board.findOne({
        where: {
          boardID: req.boardID,
          position_x: req.f_position_x,
          position_y: req.f_position_y
        }
      });
      if (destPiece) {
        const destPieceInfo = await Piece.findOne({
          where: {
            pieceID: destPiece.pieceID
          }
        });
        console.log(destPieceInfo.team, pieceInfo.team);
        if (destPieceInfo.team === pieceInfo.team) {
          return res.status(403).send({
            error: "Cannot move piece"
          });
        }
      }
      await Board.destroy({
        where: {
          boardID: req.boardID,
          position_x: req.f_position_x,
          position_y: req.f_position_y
        }
      });

      console.log(piece.toJSON());
      piece
        .update({
          position_x: req.f_position_x,
          position_y: req.f_position_y
        })
        .then(() => {});
      console.log("moved piece");
      console.log(piece.toJSON());
      res.send(piece);
    }
  },
  // requires boardID
  // Returns message
  async startBoard(req, res) {
    try {
      // White pieces
      const board = await Board.bulkCreate([
        {
          boardID: req.boardID,
          pieceID: 1,
          position_x: 1,
          position_y: 2
        },
        {
          boardID: req.boardID,
          pieceID: 1,
          position_x: 2,
          position_y: 2
        },
        {
          boardID: req.boardID,
          pieceID: 1,
          position_x: 3,
          position_y: 2
        },
        {
          boardID: req.boardID,
          pieceID: 1,
          position_x: 4,
          position_y: 2
        },
        {
          boardID: req.boardID,
          pieceID: 1,
          position_x: 5,
          position_y: 2
        },
        {
          boardID: req.boardID,
          pieceID: 1,
          position_x: 6,
          position_y: 2
        },
        {
          boardID: req.boardID,
          pieceID: 1,
          position_x: 7,
          position_y: 2
        },
        {
          boardID: req.boardID,
          pieceID: 1,
          position_x: 8,
          position_y: 2
        },
        {
          boardID: req.boardID,
          pieceID: 3,
          position_x: 1,
          position_y: 1
        },
        {
          boardID: req.boardID,
          pieceID: 3,
          position_x: 8,
          position_y: 1
        },
        {
          boardID: req.boardID,
          pieceID: 5,
          position_x: 2,
          position_y: 1
        },
        {
          boardID: req.boardID,
          pieceID: 5,
          position_x: 7,
          position_y: 1
        },
        {
          boardID: req.boardID,
          pieceID: 7,
          position_x: 3,
          position_y: 1
        },
        {
          boardID: req.boardID,
          pieceID: 7,
          position_x: 6,
          position_y: 1
        },
        {
          boardID: req.boardID,
          pieceID: 9,
          position_x: 4,
          position_y: 1
        },
        {
          boardID: req.boardID,
          pieceID: 11,
          position_x: 5,
          position_y: 1
        },
        // Black pieces
        {
          boardID: req.boardID,
          pieceID: 2,
          position_x: 1,
          position_y: 7
        },
        {
          boardID: req.boardID,
          pieceID: 2,
          position_x: 2,
          position_y: 7
        },
        {
          boardID: req.boardID,
          pieceID: 2,
          position_x: 3,
          position_y: 7
        },
        {
          boardID: req.boardID,
          pieceID: 2,
          position_x: 4,
          position_y: 7
        },
        {
          boardID: req.boardID,
          pieceID: 2,
          position_x: 5,
          position_y: 7
        },
        {
          boardID: req.boardID,
          pieceID: 2,
          position_x: 6,
          position_y: 7
        },
        {
          boardID: req.boardID,
          pieceID: 2,
          position_x: 7,
          position_y: 7
        },
        {
          boardID: req.boardID,
          pieceID: 2,
          position_x: 8,
          position_y: 7
        },
        {
          boardID: req.boardID,
          pieceID: 4,
          position_x: 1,
          position_y: 8
        },
        {
          boardID: req.boardID,
          pieceID: 4,
          position_x: 8,
          position_y: 8
        },
        {
          boardID: req.boardID,
          pieceID: 6,
          position_x: 2,
          position_y: 8
        },
        {
          boardID: req.boardID,
          pieceID: 6,
          position_x: 7,
          position_y: 8
        },
        {
          boardID: req.boardID,
          pieceID: 8,
          position_x: 3,
          position_y: 8
        },
        {
          boardID: req.boardID,
          pieceID: 8,
          position_x: 6,
          position_y: 8
        },
        {
          boardID: req.boardID,
          pieceID: 10,
          position_x: 4,
          position_y: 8
        },
        {
          boardID: req.boardID,
          pieceID: 12,
          position_x: 5,
          position_y: 8
        }
      ]);
      res.send(board);
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: "Could not create piece"
      });
    }
  },
  // Requires pieceID and position_x
  // Returns piece information
  async getPieceByLocation(req, res) {
    console.log("adding piece");
    try {
      const piece = await Board.findOne({
        where: {
          position_x: req.query.position_x,
          position_y: req.query.position_y,
          boardID: req.query.boardID
        }
      });
      res.send(piece);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        error: "Could not find piece"
      });
    }
  }
};

knightmovement = (ix, fx, iy, fy, x, y) => {
  if (Math.abs(fy - iy) === y && Math.abs(fx - ix) === x) {
    return true;
  } else {
    return false;
  }
};
