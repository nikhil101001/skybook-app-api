const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = "mongodb://127.0.0.1:27017/SkyBooks";
    return mongoose.connect(uri);
  }
}

mongooseConnect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Error Connecting to MongoDB");
  });

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

const User = require("./models/User");
const Grade = require("./models/Grade");
const Books = require("./models/Books");

// endpoint to get all the grades
app.get("/get-grade", async (req, res) => {
  try {
    const grade = await Grade.find();

    res.status(200).json(grade);
  } catch (error) {
    res.status(500).json({ message: "Error getting grades!" });
  }
});

// endpoint to get all the books
app.get("/get-books", async (req, res) => {
  try {
    const books = await Books.find();

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error getting books!" });
  }
});

// Add a new user
app.post("/add-user", async (req, res) => {
  const { name, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Update user
app.put("/update-user", async (req, res) => {
  const { email, name, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const user = await User.findOneAndUpdate(
        { email },
        { name, phone },
        { new: true }
      );
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// Get all users
app.get("/get-user", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users" });
  }
});
