module.exports = (sequelize, DataTypes) => {
  const Piece = sequelize.define("Piece", {
    pieceID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    team: {
      type: DataTypes.STRING
    },
    name: DataTypes.STRING
  });
  return Piece;
};
