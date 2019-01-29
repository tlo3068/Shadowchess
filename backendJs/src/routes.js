const BoardController = require("./controllers/BoardController");
const GameController = require("./controllers/GameController");
const PieceController = require("./controllers/PieceController");
const PlayerController = require("./controllers/PlayerController");

module.exports = app => {
  // Board
  app.get("/board", BoardController.getBoard);
  app.get("/board/all", BoardController.getAllBoard);
  app.get("/board/location", BoardController.getPieceByLocation);

  app.post("/board", BoardController.addPiece);
  app.post("/board/start", BoardController.startBoard);
  app.put("/board", BoardController.movePiece);
  app.delete("/board", BoardController.removePiece);

  // Game
  app.get("/game/all", GameController.getAllGame);
  app.get("/game", GameController.getGame);
  app.post("/game", GameController.hostGame);
  app.put("/game", GameController.joinGame);
  app.put("/game/leave", GameController.leaveGame);
  app.delete("/game", GameController.endGame);
  app.put("/game/start", GameController.startGame);

  // Piece
  app.get("/piece/all", PieceController.getAllPiece);
  app.get("/piece", PieceController.getPiece);
  app.post("/piece", PieceController.addPiece);
  app.delete("/piece", PieceController.removePiece);

  // Player
  app.get("/player/all", PlayerController.getAllPlayer);
  app.get("/player", PlayerController.getPlayer);
  app.post("/player", PlayerController.newPlayer);
  app.put("/player", PlayerController.setTeam);
  app.delete("/player", PlayerController.deletePlayer);
};
