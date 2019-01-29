"use strict";
module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define("Player", {
        playerID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        boardID: DataTypes.INTEGER,
        team: DataTypes.STRING
    });
    return Player;
};
//# sourceMappingURL=Player.js.map