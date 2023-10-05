const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");

app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/userdata", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected Successfully");
});

app.use(Router);
app.listen(3002, () => {
  console.log("Server is running at port 3002");
});
