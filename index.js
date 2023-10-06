const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");
const cors = require("cors");

app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/userdata");
/*mongoose.connect(url, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
-----> These (objects) options are not required as the latest mongo db is already having these values as true
*/

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected Successfully");
});

app.use(Router);
app.listen(3002, () => {
  console.log("Server is running at port 3002");
});
