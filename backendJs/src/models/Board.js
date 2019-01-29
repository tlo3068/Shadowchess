module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define("Board", {
    boardID: {
      type: DataTypes.INTEGER
    },
    pieceID: {
      type: DataTypes.INTEGER
    },
    // Position x corresponds to the A-Z values
    position_x: DataTypes.INTEGER,
    position_y: DataTypes.INTEGER
  });

  return Board;
};
