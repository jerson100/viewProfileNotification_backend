const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {});
    console.log("Base de datos activa");
  } catch (e) {
    console.log("No se pudo connectar a la base de datos de mongodb");
  }
};

module.exports = connectDB;
