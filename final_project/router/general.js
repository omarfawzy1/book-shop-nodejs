const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require("axios");


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!isValid(username))
    res.status(400).json({message: "Username already exists"});

  let user = {username: username, password: password}
  users.push(user)

  return res.status(200).json({message: "Register completed"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn]
  if(!book)
    return res.status(200).json({message: "Book not found"});
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let result = {} // collects the books that matches the query
  for([isbn, book] of Object.entries(books)){
    if(book.author == author)
      result[isbn] = book // matching the same format
  }
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result = {} // collects the books that matches the query
  for([isbn, book] of Object.entries(books)){
    if(book.title == title)
      result[isbn] = book // matching the same format
  }
  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn]
  if(!book)
    return res.status(200).json({message: "Book not found"});
  return res.status(200).json(book.reviews);
});

// Task 10
function getAllBooks(){
  axios.get("http://localhost:5000/").then(
    result => {
      console.log(result)
    }
  ).catch(
    err => console.log(err.msg)
  )
}

// Task 11
function getBookbyIsbn(isbn){
  axios.get("http://localhost:5000/" + isbn).then(
      result => {
        console.log(result.data)
      }
  ).catch(
      err => console.log(err.msg)
  )
}

// Task 12
function getBookbyAuthor(author){
  axios.get("http://localhost:5000/author/" + author).then(
    result => {
      console.log(result.data)
    }
  ).catch(
    err => console.log(err.msg)
  )
}

// Task 13
function getBookbyTitle(title){
  axios.get("http://localhost:5000/title/" + title).then(
    result => {
      console.log(result.data)
    }
  ).catch(
    err => console.log(err.msg)
  )
}

module.exports.general = public_users;
