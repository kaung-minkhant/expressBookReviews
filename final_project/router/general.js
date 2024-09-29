const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username not valid" });
  }
  const user = users.find(user => user.username === username);
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({username, password})
  return res.status(200).json({ message: "Registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(400).json({ message: "ISBN required" });
  }
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ message: book });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  if (!author) {
    return res.status(400).json({ message: "Author required" });
  }
  const book = Object.entries(books).find((book) => book[1].author === author);
  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ message: book[1] });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  if (!title) {
    return res.status(400).json({ message: "Title required" });
  }
  const book = Object.entries(books).find((book) => book[1].title === title);
  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ message: book[1] });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(400).json({ message: "Isbn required" });
  }
  const book = books[isbn]
  if (!book) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ message: book.reviews });
});

module.exports.general = public_users;
