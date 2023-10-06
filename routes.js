const express = require("express");
const userModel = require("./post");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

//API FOR INSERTING MULTIPLE REQ OBJECTS INTO DATABASE
app.post("/newusers", async (request, response) => {
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

//API FOR REGISTERING THE USER
app.post("/newuser", async (request, response) => {
  const client = new MongoClient("mongodb://localhost:27017");
  const { username, email, name, age, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 1);
  client
    .db("userdata")
    .collection("logins")
    .insertOne({
      name: name,
      email: email,
      username: username,
      age: age,
      password: hashedPassword,
    })
    .then((res) => {
      response.send(res);
      console.log(res);
      client.close();
    })
    .catch((err) => response.send(err));
});

//API FOR LOGGING IN THE USER
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const client = new MongoClient("mongodb://localhost:27017/");
  client
    .db("userdata")
    .collection("logins")
    .findOne({ username: username })
    .then(async (data) => {
      if (data === null) {
        response.status(400).json({ errorMsg: "Invalid user" });
      } else {
        const isPasswordMatched = await bcrypt.compare(password, data.password);
        if (isPasswordMatched === true) {
          const payload = {
            username: username,
          };
          const jwtToken = jwt.sign(payload, "SECRET_TOKEN");
          console.log(jwtToken);
          response.send({ jwtToken });
        } else {
          response.status(400);
          response.json({ errorMsg: "Invalid Password" });
        }
      }
    })
    .catch((err) => response.send(err));

  /*try {
    if (dbObject === null) {
      response.send("Invalid User");
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbPass);
      if (isPasswordMatched === true) {
        const payload = {
          username: username,
        };
        const jwtToken = jwt.sign(payload, "SECRET_TOKEN");
        console.log(jwtToken);
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.json({ message: "Invalid Password" });
      }
    }
  } catch (error) {
    response.status(500);
    response.send(error);
  }*/

  /*const userObject = await userModel.findOne({ username: username });
  console.log(userObject);
  const dbPassword = userObject.password;
  console.log(dbPassword);
  try {
    if (userObject === null) {
      response.status(400).send("Invalid User");
    } else {
      console.log(userObject["password"]);
      console.log(password);
      const passwordMatch = await bcrypt.compare(password, userObject.password);
      console.log(passwordMatch);
      if (passwordMatch === true) {
        const payload = {
          username: username,
        };
        const jwtToken = jwt.sign(payload, "SECRET_TOKEN");
        console.log(jwtToken);
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.json({ message: "Invalid Password" });
      }
    }
  } catch (error) {
    response.status(500).send(error);
  }*/
});

//API FOR GETTING ALL USERS IN THE DATABASE Method 1
app.get("/users", async (request, response) => {
  const users = await userModel.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/allusers", async (request, response) => {
  const client = new MongoClient("mongodb://localhost:27017");
  client
    .db("userdata")
    .collection("users")
    .find()
    .then((res) => {
      response.send(res);
    })
    .catch((err) => {
      response.send(err);
    });
});

//API FOR DELETING USER FROM DB Need to be implemented from request body
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

//API FOR UPDATING USER DATA BASED ON USERNAME Need to be updated from request body
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
