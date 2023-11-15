const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const SECRET = "NothingIsMoreSecretThanThat"
let users = [{username: "omar", password: "password"}];

// Checks if the username is Valid
const isValid = (username)=>{ //returns boolean
  const foundUser = users.filter(user => user.username == username)
  if(foundUser.length == 0) return true;
  return false;
}

const authenticatedUser = (username, password)=>{ //returns boolean
  const foundUser = users.filter(user => 
    (user.username == username && 
    user.password == password)
  )

  if(foundUser.length != 0) return true;
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(!username || !password)
    return res.status(403).json({message: "Invalid format"})

  if(!authenticatedUser(username, password))
    return res.status(403).json({message: "Wrong username or password"})
 

  const accessToken = jwt.sign({username: username}, SECRET, {expiresIn: 60 * 60} )
  req.session.authorization = {
    accessToken
  }

  //Write your code here
  return res.status(200).json({message: "Logged in successfully"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if(!isbn)
    return res.status(400).json({message: "Invalid format"})
  
  if(!books[isbn])
    return res.status(400).json({message: "Book not found"})
  
  if(!books[isbn].reviews[username])
    res.json({message: "Review added"});
  else
    res.json({message: "Review modified"});
  
  books[isbn].reviews[username] = review
  return res.status(200);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  if(!isbn)
    return res.status(400).json({message: "Invalid format"})
  
  if(!books[isbn])
    return res.status(400).json({message: "Book not found"})

  delete books[isbn].reviews[username]

  return res.status(200).json({message: "Review deleted"});
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.SECRET = SECRET;