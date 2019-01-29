const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

fs.readdirSync(__dirname)
  .filter(file => file !== "index.js")
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

//Models/tables
// db.board = require("./Board.js")(sequelize, Sequelize);
// db.game = require("./Game.js")(sequelize, Sequelize);
// db.piece = require("./Piece.js")(sequelize, Sequelize);
// db.player = require("./Player.js")(sequelize, Sequelize);

//Relations
// db.board.belongsTo(db.game);
// db.game.hasMany(db.board);

// db.piece.belongsTo(db.board);
// db.board.hasMany(db.piece);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
