"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const product_1 = require("./product");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config")[env];
// const config = require("../config.js")[env];
const sequelize = new Sequelize(
//   config.db.database,
//   config.db.user,
//   config.db.password,
//   config.db.options,
config.url || process.env.DATABSE_CONNECTION_URI, config);
const db = {
    sequelize,
    Sequelize,
    Product: product_1.default(sequelize)
};
Object.keys(db).forEach((model) => {
    if (model.associate) {
        model.associate(db);
    }
});
exports.default = db;
//# sourceMappingURL=index.js.map