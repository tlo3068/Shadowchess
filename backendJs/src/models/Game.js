module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define("Game", {
    boardID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    playerAID: {
      type: DataTypes.INTEGER
    },
    playerBID: {
      type: DataTypes.INTEGER
    },
    turn: DataTypes.STRING,
    running: DataTypes.BOOLEAN
  });
  return Game;
};
