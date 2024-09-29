const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !(!!users.find(user => user.username === username))
};

const authenticatedUser = (username, password) => {
  return !!users.find(user => user.username === username && user.password === password)
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, "secretkey");
  req.session.jwt = token
  req.session.username = username
  return res.status(200).json({ message: "Logged in successfully", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.review
  const isbn = req.params.isbn
  const username = req.session.username
  if (!isbn) {
    return res.status(400).json({ message: "ISBN required" });
  }
  const book = books[isbn]
  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }

  if (book.reviews[username]) {
    book.reviews[username] = review
  }
  return res.status(200).json({ message: "Reviewed" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.username
  if (!isbn) {
    return res.status(400).json({ message: "ISBN required" });
  }
  const book = books[isbn]
  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }

  if (book.reviews[username]) {
    book.reviews[username] = undefined
  }
  return res.status(200).json({ message: "Review deleted" });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
