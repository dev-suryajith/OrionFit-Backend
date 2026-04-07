const mongoose = require("mongoose");

mongoose.connect(process.env.DataBase)
  .then(() => {
    console.log("MongoDB connected successfully");
    console.log("Connected Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
