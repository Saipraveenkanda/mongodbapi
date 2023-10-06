const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  /*username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sample: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    required: true,
  },*/
});

const User = mongoose.model("logins", userSchema);
module.exports = User;

//dto
