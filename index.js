const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGO_URI;
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

// running server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

const User = require("./models/User");
const Grade = require("./models/Grade");
const Books = require("./models/Books");

// endpoint to get all the grades
app.get("/get-grades", async (req, res) => {
  try {
    const grade = await Grade.find();

    res.status(200).json(grade);
  } catch (error) {
    res.status(500).json({ message: "Error getting grades!" });
  }
});

// Add a new Grade
app.post("/add-grade", async (req, res) => {
  const { image, grade } = await req.body;

  try {
    const existingGrade = await Grade.findOne({ grade });

    if (existingGrade) {
      return res.status(400).json({ error: "Grade already exists!" });
    }

    const createdGrade = await Grade.create({ image, grade });

    return res.status(200).json(createdGrade);
  } catch (error) {
    return res.status(500).json({ error: "Error creating Grade!" });
  }
});

// Update Grade
app.put("/update-grade", async (req, res) => {
  const { image, grade, _id } = await req.body;

  try {
    const existingGrade = await Grade.findOne({ _id });

    if (existingGrade) {
      const updatedGrade = await Grade.findOneAndUpdate(
        { _id },
        { image, grade },
        { new: true }
      );
      return res.status(200).json(updatedGrade);
    } else {
      return res.status(400).json({ error: "Grade not found!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error updating Grade!" });
  }
});

// Delete Grade
app.delete("/delete-grade", async (req, res) => {
  const { _id } = await req.body;

  try {
    const existingGrade = await Grade.findOne({ _id });

    if (existingGrade) {
      const deletedGrade = await Grade.findOneAndDelete({ _id });

      return res.status(200).json(deletedGrade);
    } else {
      return res.status(400).json({ error: "Grade not found!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error deleting Grade!" });
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

// endpoint to add new book
app.post("/add-book", async (req, res) => {
  const { image, subject, description, title, author, uri, grade, slug } =
    await req.body;

  try {
    const existingBook = await Books.findOne({ slug });

    if (existingBook) {
      return res.status(400).json({ error: "Book already exists!" });
    }

    const book = await Books.create({
      image,
      subject,
      description,
      title,
      author,
      uri,
      grade,
      slug,
    });

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ error: "Error creating book!" });
  }
});

// Update book
app.put("/update-book", async (req, res) => {
  const { image, subject, description, title, author, uri, grade, slug, _id } =
    await req.body;

  try {
    const existingBook = await Books.findOne({ _id });

    if (existingBook) {
      const book = await Books.findOneAndUpdate(
        { _id },
        { image, subject, description, title, author, uri, grade, slug },
        { new: true }
      );
      return res.status(200).json(book);
    } else {
      return res.status(400).json({ error: "Book not found!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error updating book!" });
  }
});

// Delete Book Endpoint
app.delete("/delete-book", async (req, res) => {
  const { _id } = await req.body;

  try {
    const existingBook = await Books.findOne({ _id });

    if (existingBook) {
      const book = await Books.findOneAndDelete({ _id });
      return res.json(book);
    } else {
      return res.status(400).json({ error: "Book not found!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error deleting book!" });
  }
});

// Get all users
app.get("/get-users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users" });
  }
});

// get user by email
app.get("/get-user/:email", async (req, res) => {
  const { email } = req.params;
  console.log(email);
  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting user" });
  }
});

// Add a new user
app.post("/add-user", async (req, res) => {
  const { name, email } = await req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const user = await User.create({ name, email });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error creating user!" });
  }
});

// Update user
app.put("/update-user", async (req, res) => {
  const { email, name, phone, _id } = await req.body;

  try {
    const existingUser = await User.findOne({ _id });

    if (existingUser) {
      const updatedUser = await User.findOneAndUpdate(
        { _id },
        { name, phone },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } else {
      return res.status(400).json({ error: "User not found!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error updating user!" });
  }
});

// Delete user
app.delete("/delete-user", async (req, res) => {
  const { _id } = await req.body;

  try {
    const existingUser = await User.findOne({ _id });

    if (existingUser) {
      const deletedUser = await User.findOneAndDelete({ _id });

      return res.status(200).json(deletedUser);
    } else {
      return res.status(400).json({ error: "User not found!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error deleting user!" });
  }
});
