const app = require("express")();
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");
const config = require("./config/config");

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

// require("./routes")(app);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
require("./socketFunctions")(wss);

sequelize.sync().then(() => {
  server.listen(config.port);
  console.log(`server started on port ${config.port}`);
});
