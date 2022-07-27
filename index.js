const express = require("express");
const cors = require("cors");
const connectDB = require("./api/configs/mongodb");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const UserRouter = require("./api/routers/user.router");
const AuthRouter = require("./api/routers/auth.router");
const ActiveUserController = require("./api/controllers/activeUser.controller");
const VisitedProfileController = require("./api/controllers/visitedProfile.controller");

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
    await ActiveUserController.createActiveUser({
      idUser: data.user._id,
      room: data.room,
    });

    const users = await ActiveUserController.getActiveUsers(data.user._id);

    for (let i = 0; i < users.length; i++) {
      socket.to(users[i].room).emit("newActiveUser", {
        room: data.room,
        user: data.user,
      });
    }
  });

  socket.on("getActiveUsers", async (idUser, cb) => {
    const users = await ActiveUserController.getActiveUsers(idUser);
    cb(users);
  });

  socket.on("disconnect", async () => {
    const deletedActiveUser = await ActiveUserController.deleteByRoomActiveUser(
      socket.id
    );
    if (deletedActiveUser) {
      socket.broadcast.emit("deletedActiveUser", deletedActiveUser);
    }
  });

  socket.on("disconnectedUser", async () => {
    const deletedActiveUser = await ActiveUserController.deleteByRoomActiveUser(
      socket.id
    );
    if (deletedActiveUser) {
      socket.broadcast.emit("deletedActiveUser", deletedActiveUser);
    }
  });

  socket.on("visitedProfile", async (idUser, username) => {
    const newVisitedProfile =
      await VisitedProfileController.createVisitedProfile(idUser, username);
    //emitimos a todos los usuarios activios para el idUser, que pueden
    //tener la cuenta abierta en más de un navegador
    const users = await ActiveUserController.getActiveUsers(
      newVisitedProfile.visitedUser._id,
      false
    );
    for (let i = 0; i < users.length; i++) {
      socket.to(users[i].room).emit("addVisitedUser", newVisitedProfile);
    }
  });
  socket.on("allVisitedUsers", async (idUser, cb) => {
    const newVisitedProfile =
      await VisitedProfileController.getUsersWhoVisitedMyProfile(idUser);
    cb(newVisitedProfile);
  });
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
