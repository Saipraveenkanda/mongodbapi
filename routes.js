const express = require("express");
const userModel = require("./post");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const app = express();

app.post("/newuser", async (request, response) => {
  const client = new MongoClient("mongodb://localhost:27017");
  const requestArray = request.body;
  console.log(requestArray);
  requestArray.map((each) => {
    const { username, email, name, age } = each;
    console.log(each);
    client
      .db("userdata")
      .collection("users")
      .insertMany([{ name: name, email: email, username: username, age: age }])
      .then((res) => {
        //response.send(res);
        console.log(res);
        client.close();
      })
      .catch((err) => response.send(err));
  });
});

app.get("/users", async (request, response) => {
  const users = await userModel.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/allusers", async (request, response) => {
  const User = await mongoose.model("users", new mongoose.Schema()).find({});
  try {
    response.send(User);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/deleteuser", async (request, response) => {
  const client = new MongoClient("mongodb://localhost:27017");
  client
    .db("userdata")
    .collection("users")
    .deleteOne({ username: "bha" })
    .then((res) => {
      console.log(res);
      response.send(res);
      client.close();
    })
    .catch((err) => console.log(err));
});

app.put("/updateuser", async (request, response) => {
  const { username, email } = request.body;
  const client = new MongoClient("mongodb://localhost:27017");
  client
    .db("userdata")
    .collection("users")
    .updateOne({ username: username }, { $set: { email: email } })
    .then((res) => {
      response.send(res);
      client.close();
    })
    .catch((err) => console.log(err));
});

module.exports = app;
