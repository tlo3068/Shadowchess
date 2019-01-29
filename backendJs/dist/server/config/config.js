"use strict";
module.exports = {
    db: {
        database: process.env.DB_NAME || "shadowchess",
        user: process.env.DB_USER || "shadowchess",
        password: process.env.DB_PASS || "shadowchess",
        options: {
            dialect: process.env.DIALECT || "sqlite",
            host: process.env.HOST || "localhost",
            storage: "./shadowchess.sqlite"
        }
    }
};
//# sourceMappingURL=config.js.map