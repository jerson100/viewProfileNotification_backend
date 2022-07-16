const express = require("express");
const cors = require("cors");
const connectDB = require("./api/configs/mongodb");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const UserRouter = require("./api/routers/user.router");
const AuthRouter = require("./api/routers/auth.router");
const UserController = require("./api/controllers/activeUser.controller");

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTED_URL || "*",
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(cors());

app.use(express.json());

app.use(`/api/${process.env.API_VERSION}/users`, UserRouter);
app.use(`/api/${process.env.API_VERSION}/auth`, AuthRouter);

io.on("connection", (socket) => {
  //socket.emit("connect", "bienvenido usuario");
  socket.on("login", async (data) => {
    //   almacenar en la bd el usuario como activo
    const newUser = await UserController.createActiveUser({
      idUser: data.user._id,
      room: data.room,
    });

    // socket.broadcast.emit("activeUser", newUser);

    const users = await UserController.getActiveUsers(data.user._id);

    socket.emit("getActiveUsers", users);

    for (let i = 0; i < users.length; i++) {
      socket.to(users[i].room).emit("activeUser", {
        room: data.room,
        user: data.user,
      });
    }
  });

  //   socket.on("disconnect", function () {
  //     console.log("Got disconnect!");
  //     var i = allClients.indexOf(socket.id);
  //     allClients.splice(i, 1);
  //   });

  //   socket.on("getActiveUsers", async (cb) => {
  //nos conectamos con la base de datos y obtenemos todos los registros de los usuarios activos en el sistema
  // console.log("get users");
  // cb(users);
  //   });
});

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
