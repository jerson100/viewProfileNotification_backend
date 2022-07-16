const express = require("express");
const connectDB = require("./api/configs/mongodb");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const UserRouter = require("./api/routers/user.router");

const app = express();

connectDB();

app.use(express.json());

app.use(`/api/${process.env.API_VERSION}/users`, UserRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", () => {});

httpServer.listen(process.env.PORT, {}, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});

app.use((error, req, res, next) => {
  if (!error.status) {
    if (process.env.TYPE === "DEVELOPMENT") {
      res.status(500).json({
        message: "Ocurrió un error en el servidor",
        stack: error.stack,
      });
    } else {
      //console.log(error);
      res.status(500).json({
        message: "Ocurrió un error en el servidor",
      });
    }
  } else {
    res.status(error.status).json({ message: error.message });
  }
});
