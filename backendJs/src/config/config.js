module.exports = {
  port: process.env.PORT || 5000,
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
