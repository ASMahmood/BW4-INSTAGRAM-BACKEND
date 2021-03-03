const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const servicesRouter = require("./routes");
dotenv.config();
// const pass = require("./passport");
const database = require("./database");
const http = require("http");

const port = process.env.PORT || 9001;

const server = express();

//socket
const httpServer = http.createServer(server);
const io = require("socket.io")(httpServer);
module.exports = io;
const SocketManager = require("./socket.js");
io.on("connection", SocketManager);

const whitelist = [
  "http://localhost:3000",
  "http://localhost:300/login",
  "http://localhost:9001",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

server.use(cors(corsOptions));
server.use(cookieParser());

server.use(express.json());
server.use("/insta", servicesRouter);
database.sequelize.sync({ force: false }).then(() => {
  httpServer.listen(port, () => {
    console.log("running on port" + port);
  });
});
