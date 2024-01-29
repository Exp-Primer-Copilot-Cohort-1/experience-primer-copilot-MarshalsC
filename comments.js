// Create web server
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Create a web server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Set up the static directory
app.use(express.static("public"));

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up the comments array
let comments = [];

// Set up the comments file
const commentsFile = path.join(__dirname, "data", "comments.json");

// Read the comments file
fs.readFile(commentsFile, "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    comments = JSON.parse(data);
  }
});

// Set up the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Set up the comments page
app.get("/comments", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "comments.html"));
});

// Set up the comments API
app.get("/api/comments", (req, res) => {
  res.json(comments);
});

// Set up the comments API
app.post("/api/comments", (req, res) => {
  const comment = {
    id: uuidv4(),
    name: req.body.name,
    comment: req.body.comment,
    date: new Date(),
  };
  comments.push(comment);
  const commentsJSON = JSON.stringify(comments);
  fs.writeFile(commentsFile, commentsJSON, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json(comment);
    }
  });
});

// Set up the delete comment API
app.delete("/api/comments/:id", (req, res) => {
  const id = req.params.id;
  comments = comments.filter((comment) => comment.id !== id);
  const commentsJSON = JSON.stringify(comments);
  fs.writeFile(commentsFile, commentsJSON, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json(comments);
    }
  });
});