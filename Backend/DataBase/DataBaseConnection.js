const mongoose = require("mongoose");

const connect = () => {
  mongoose.connect("mongodb://localhost:27017/StreamSphere", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Connected to database");
  }).catch((err) => {
    console.error("Database connection error:", err);
  });
};

module.exports = connect;
