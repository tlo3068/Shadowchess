"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, config.db.options);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
fs.readdirSync(__dirname)
    .filter((file) => file !== "index.ts")
    // .filter((file: any) => file !== "index.js")
    .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
//# sourceMappingURL=index.js.map