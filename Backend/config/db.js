const mongoose = require("mongoose");
require("dotenv").config({ path: "var.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true
    });
    console.log("Db connected");
  } catch (error) {
    console.log("Hubo un error", error);
    process.exit(1);
  }
};

module.exports = connectDB;
