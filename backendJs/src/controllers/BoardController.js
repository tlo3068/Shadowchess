const { Board, Piece } = require("../models");
const { dataCompile } = require("./SocketHelpers");
module.exports = {
  async getAllBoard(req, res) {
    try {
      const board = await Board.findAll();
      if (!board) {
        throw "No board found";
      }
      return dataCompile(board);
    } catch (err) {
      return err;
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
      return dataCompile(newBoard);
    } catch (err) {
      return err;
    }
  },

  // Requires pieceID and position_x
  // Returns piece information
  async addPiece(req, res) {
    // res.send("adding piece");
    try {
      console.log("adding piece");
      const piece = await Piece.create(req);
      if (!piece) {
        throw "Could not remove piece";
      }
      return dataCompile(piece);
    } catch (err) {
      return err;
    }
  },
  // requires boardID and pieceID
  // Returns message
  async removePiece(req, res) {
    try {
      const piece = await Board.findOne({
        where: {
          boardID: req.boardID,
          pieceID: req.pieceID
        }
      });
      if (!piece) {
        throw "Could not remove piece";
      }
      piece.destroy().then(() => {});
      dataCompile(piece);
    } catch (err) {
      return err;
    }
  },
  // Requires pieceID and new position_x
  // returns new piece information
  async movePiece(req, res) {
    try {
      console.log(req);
      const piece = await Board.findOne({
        where: {
          boardID: req.boardID,
          position_x: req.i_position_x,
          position_y: req.i_position_y
        }
      });
      if (!piece) {
        throw "Could not move piece";
      }
      const pieceInfo = await Piece.findOne({
        where: {
          pieceID: piece.pieceID
        }
      });
      if (!pieceInfo) {
        throw "Could not move piece";
      }

      if (
        req.f_position_y - req.i_position_y === 0 &&
        req.f_position_x - req.i_position_x === 0
      ) {
        throw "Could not move piece";
      }

      // console.log("success ");
      console.log(pieceInfo.toJSON());
      let dist_x = req.f_position_x - req.i_position_x;
      let dist_y = req.f_position_y - req.i_position_y;
      if (pieceInfo.name === "pawn") {
        // Check movement
        if (pieceInfo.team === "white") {
          let valid = 0;
          if (dist_x === 0 && dist_y === 1) {
            valid = 1;
          }
          if (req.i_position_y === 2 && dist_x === 0 && dist_y === 2) {
            valid = 1;
          }
          const destPiece = await Board.findOne({
            where: {
              boardID: req.boardID,
              position_x: req.i_position_x + 1,
              position_y: req.i_position_y + 1
            }
          });
          if (dist_x === 1 && dist_y === 1 && destPiece) {
            valid = 1;
          }
          const destPiece2 = await Board.findOne({
            where: {
              boardID: req.boardID,
              position_x: req.i_position_x - 1,
              position_y: req.i_position_y + 1
            }
          });
          if (dist_x === -1 && dist_y === 1 && destPiece2) {
            valid = 1;
          }
          if (valid === 0) {
            throw "Could not move piece";
          }
          console.log("success");
        } else if (pieceInfo.team === "black") {
          let valid = 0;
          if (dist_x === 0 && dist_y === -1) {
            valid = 1;
          }
          if (req.i_position_y === 7 && dist_x === 0 && dist_y === -2) {
            valid = 1;
          }
          const destPiece = await Board.findOne({
            where: {
              boardID: req.boardID,
              position_x: req.i_position_x + 1,
              position_y: req.i_position_y - 1
            }
          });
          if (dist_x === 1 && dist_y === -1 && destPiece) {
            valid = 1;
          }
          const destPiece2 = await Board.findOne({
            where: {
              boardID: req.boardID,
              position_x: req.i_position_x - 1,
              position_y: req.i_position_y - 1
            }
          });
          if (dist_x === -1 && dist_y === -1 && destPiece2) {
            valid = 1;
          }
          if (valid === 0) {
            throw "Could not move piece";
          }
        }
      } else if (pieceInfo.name === "rook") {
        if (!(dist_y === 0 || dist_x === 0)) {
          throw "Could not move piece";
        }
        if (
          !(await rookmovement(
            req.i_position_x,
            req.f_position_x,
            req.i_position_y,
            req.f_position_y,
            req.boardID
          ))
        ) {
          throw "Could not move piece";
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
          throw "Could not move piece";
        }
        // Check movement
      } else if (pieceInfo.name === "bishop") {
        // Check movement
        if (
          Math.abs(req.f_position_y - req.i_position_y) !==
          Math.abs(req.f_position_x - req.i_position_x)
        ) {
          throw "Could not move piece";
        }
        if (
          !(await rookmovement(
            req.i_position_x,
            req.f_position_x,
            req.i_position_y,
            req.f_position_y,
            req.boardID
          ))
        ) {
          console.log("Move not successful");
          throw "Could not move piece";
        } else {
          console.log("Move successful");
          console.log(
            rookmovement(
              req.i_position_x,
              req.f_position_x,
              req.i_position_y,
              req.f_position_y,
              req.boardID
            )
          );
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
          throw "Could not move piece";
        }
        if (
          !(await rookmovement(
            req.i_position_x,
            req.f_position_x,
            req.i_position_y,
            req.f_position_y,
            req.boardID
          ))
        ) {
          throw "Could not move piece";
        }

        // Check movement
      } else if (pieceInfo.name === "king") {
        if (
          Math.abs(req.f_position_y - req.i_position_y) > 1 ||
          Math.abs(req.f_position_x - req.i_position_x) > 1
        ) {
          throw "Could not move piece";
        }
        // Check movement
      } else {
        throw "Could not move piece";
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
        if (!destPieceInfo) {
          throw "Could not move piece";
        }
        if (destPieceInfo.team === pieceInfo.team) {
          throw "Could not move piece";
        }
      }
      await Board.destroy({
        where: {
          boardID: req.boardID,
          position_x: req.f_position_x,
          position_y: req.f_position_y
        }
      });
      piece
        .update({
          position_x: req.f_position_x,
          position_y: req.f_position_y
        })
        .then(() => {});

      let data = {
        boardID: req.boardID,
        initial: {
          position_x: req.i_position_x,
          position_y: req.i_position_y
        },
        final: {
          position_x: req.f_position_x,
          position_y: req.f_position_y
        },
        special: null
      };
      let response = {
        OK: true,
        data
      };
      return JSON.stringify(response);
      // return dataCompile(data);
    } catch (err) {
      return err;
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
      if (!board) {
        throw "Could not start board";
      }
      // console.log(board.toJSON());
      // console.log(JSON.stringify(board));
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
      let response = {
        OK: true,
        data: newBoard
      };
      return JSON.stringify(response);
      // return dataCompile(board);
    } catch (err) {
      return err;
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
      if (!piece) {
        throw "Could not get piece by location";
      }
      return dataCompile(piece);
    } catch (err) {
      return err;
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
validPosition = (column, row) => {
  return column <= 8 && column > 0 && row <= 8 && row > 0;
};

rookmovement = async (ix, fx, iy, fy, id) => {
  try {
    let index = 1;
    let counter_x = 0;
    let counter_y = 0;
    let dist_y = fy - iy;
    let dist_x = fx - ix;
    let total_distance = Math.max(Math.abs(dist_y), Math.abs(dist_x));
    while (index < total_distance) {
      if (dist_y < 0) {
        counter_y--;
      }
      if (dist_y > 0) {
        counter_y++;
      }
      if (dist_x < 0) {
        counter_x--;
      }
      if (dist_x > 0) {
        counter_x++;
      }
      let new_pos_x = ix + counter_x;
      let new_pos_y = iy + counter_y;
      let destPiece = await Board.findOne({
        where: {
          boardID: id,
          position_x: new_pos_x,
          position_y: new_pos_y
        }
      });
      console.log("checking x: " + new_pos_x + "; y: " + new_pos_y);
      if (destPiece) {
        console.log("not null");
        return false;
      }

      index++;
    }
    return true;
  } catch (error) {
    throw error;
  }
};
