const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user (username &/ password are not provided)"});
});

// Wrap the asynchronous operation in a Promise
const getallBooks = new Promise((resolve, reject) => {
    if (Object.keys(books).length > 0) {
      resolve(books);
    } else {
      reject(new Error("Books Database is empty"));
    }
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getallBooks.then(function(books) {
    return res.status(300).json({message: JSON.stringify(books, null, 4)});
  }).catch(function(err) {
    return res.status(500).json({error: err.message});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  getallBooks.then(function (books) {
    let isbn = req.params.isbn;
    // Check if the book exists in the books object
    if (isbn in books) {
      return res.status(300).json(books[isbn]);
    } else {
      // If the book doesn't exist, return a 404 error
      return res.status(404).send('Book not found with the given ISBN');
    }

  }).catch(function (err) {
    return res.status(500).json({error: err.message});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = [];

  // Create a new promise
  const getBooksbyauthor = new Promise(function(resolve, reject) {
    // Loop through each book in the books object
    for (const isbn in books) {
      const book = books[isbn];

      // If the book's author property matches the search term, add it to the results
      if (book.author === author) {
        booksByAuthor.push(book);
      }
    }

    // Check if any books were found
    if (booksByAuthor.length > 0) {
        // Resolve the promise with the booksByAuthor array
        resolve(booksByAuthor);
      } else {
        // Reject the promise with an error message
        reject(`No books found for author '${author}'`);
      }
    });
  
    // Handle the promise result
    getBooksbyauthor
        .then(function(result) {
          // The booksByAuthor array now contains all books with the specified author
          return res.status(200).json({message: result});
        })
        .catch(function(error) {
          return res.status(404).json({error: error});
        });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = [];

  const getBooksByTitle = new Promise(function(resolve, reject) {

    for (const isbn in books) {
      const book = books[isbn];
      if (book.title === title) {
        booksByTitle.push(book);
      }
    }
    if (booksByTitle.length > 0) {

      resolve(booksByTitle);
    } else {
      reject(`No books found with Title '${title}'`);
    }
  });

  // Handle the promise result
  getBooksByTitle
      .then(function(result) {
        // The booksByTitle array now contains all books with the specified title
        return res.status(200).json({message: result});
      })
      .catch(function(error) {
        return res.status(404).json({error: error});
      });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    const getBooks = new Promise(resolve => resolve(res.status(200).json(books)));
    getBooks.then(() => console.log('Promise Task 10 complete'));
  });
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn', function (req, res) {
    const getBook = new Promise((resolve, reject) => {
      const isbn = req.params.isbn;
  
      if (books[isbn]) {
        resolve(res.status(200).json(books[isbn]));
      } else {
        reject(res.status(404).json({ message: `The book is not found by ISBN: ${isbn}` }));
      }
    });
    getBook
      .then(() => console.log('Promise Task 11 complete'))
      .catch(() => console.log('Promise Task 11 complete'));
  });
  
  // Get book details based on author
  public_users.get('/author/:author', (req, res) => {
    const getBooks = new Promise((resolve, reject) => {
      const author = req.params.author;
      const booksOfAuthor = Object.values(books).filter(book => book.author === author);
  
      if (booksOfAuthor.length > 0) {
        resolve(res.status(200).json(booksOfAuthor));
      } else {
        reject(res.status(404).json({ message: `The books are not found by author: ${author}` }));
      }
    });
    getBooks
      .then(() => console.log('Promise Task 12 complete'))
      .catch(() => console.log('Promise Task 12 complete'));
  });
  
  // Get all books based on title
  public_users.get('/title/:title', (req, res) => {
    const getBooks = new Promise((resolve, reject) => {
      const title = req.params.title;
      const booksWithTitle = Object.values(books).filter(book => book.title === title);
  
      if (booksWithTitle.length > 0) {
        resolve(res.status(200).json(booksWithTitle));
      } else {
        reject(res.status(404).json({ message: `The books are not found by title: ${title}` }));
      }
    });
    getBooks
      .then(() => console.log('Promise Task 13complete'))
      .catch(() => console.log('Promise Task 13 complete'));
  });



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn= req.params.isbn
  // Check if the book exists in the books object
  if (isbn in books) {
    const reviews = books[isbn].reviews;
    return res.status(300).json(reviews);
  } else {
    // If the book doesn't exist, return a 404 error
    return res.status(404).send('Book not found');
  }
});

module.exports.general = public_users;
