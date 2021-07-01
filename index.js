//require dotenv
require('dotenv').config();

//require express
const express = require('express');

//initializing express to app
const app = express();

//require mongoose
const mongoose = require('mongoose');

//Establish Database connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log('connection established'));
;

//require database file
const Database = require('./database/database');

//json from express
app.use(express.json());




//---------------API Generation starts here ----------------------

//Books

// Need API
//GET
//get all books
app.get('/', (req, res) => {
    return res.json({ books: Database.books });
});

//POST
//Add New Books
app.post('/book/New', (req, res) => {
    //body 
    const { Newbooks } = req.body;
    Database.books.push(Newbooks);
    return res.json({ books: Database.books, Status: `New Books Added!!` });
});

//PUT
//Update New title to books
app.put('/book/update/:isbn', (req, res) => {
    Database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.NewTitle;
        }
    });
    return res.json({ books: Database.books })

});

//PUT
//Update/Add New Authors to books
app.put('/book/author/update/:isbn', (req, res) => {
    Database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.authors.push(req.body.NewAuth);
        }
    });
    Database.authors.forEach((author) => {
        if (author.id === req.body.NewAuth) {
            return author.books.push(req.params.isbn);
        }
    });
    return res.json({ books: Database.books, authors: Database.authors, Status: `Update/add authors!!!` });
})

//DELETE
//Delete New Books


//get specific books -To get Specific books we need an id, for these books Unique id is an ISBN, so we need to pass isbn in api
app.get('/is/:isbn', (req, res) => {
    const getSpecificBook = Database.books.filter((book) => book.ISBN === req.params.isbn)
    if (getSpecificBook.length === 0) {
        return res.json({ error: `No books found for isbn of ${req.params.isbn}` });
    }
    return res.json({ book: getSpecificBook });
});

//get specific books based on category

app.get('/c/:category', (req, res) => {
    const getSpecificBooks = Database.books.filter((book) => book.category.includes(req.params.category));
    console.log(getSpecificBooks);
    if (getSpecificBooks.length === 0) {
        return res.json({ error: `No books found for the category of ${req.params.category}` });
    }
    return res.json({ books: getSpecificBooks });
});
//get a list of books based on author
app.get('/a/:author', (req, res) => {
    const authorid = Number(req.params.author);
    const getBookByAuthor = Database.books.find((authors) => authors.authors.includes(Number(req.params.author)))
    console.log(getBookByAuthor);
    if (!getBookByAuthor) {
        return res.json({ error: `No books found for the author of ${req.params.author}` });
    }
    return res.json({ books: getBookByAuthor });
});

//Author

//we need api
//get all authors
app.get('/authors', (req, res) => {
    return res.json({ authors: Database.authors });
});


//POST
// Add new Author
app.post('/au/New', (req, res) => {
    //body 
    const { NewAuthor } = req.body;
    Database.authors.push(NewAuthor);
    return res.json({ authors: Database.authors, Status: `New Books Added!!` });
});


//get specific author
app.get('/au/:id', (req, res) => {
    const getSpecificAuthor = Database.authors.filter((author) => author.id == req.params.id);
    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No authors found for the ISBN of ${req.params.id}` });
    }
    return res.json({ authors: getSpecificAuthor });
});
//get list of author based on book
app.get('/aut/:book', (req, res) => {
    const getAuthorByBooks = Database.authors.filter((author) => author.books.includes(req.params.book));
    if (getAuthorByBooks.length === 0) {
        return res.json({ error: `No authors found for books of ${req.params.book}` });
    }
    return res.json({ authors: getAuthorByBooks });
});


//Publication

//we need api
//get all Publications
app.get('/publications', (req, res) => {
    return res.json({ publications: Database.publications });
});

//POST
//Add New publications
app.post('/publication/New', (req, res) => {
    const { newPublication } = req.body;
    Database.publications.push(newPublication);
    return res.json({ publications: Database.publications, Status: `New publications Has Added!!` });
});

//get specific Publication
app.get('/pub/:id', (req, res) => {
    const getSpecificPubli = Database.publications.filter((publication) => publication.id == req.params.id);
    if (!getSpecificPubli) {
        return res.json({ error: `No Books found for the id of ${req.params.id}` });
    }
    else {
        return res.json({ publications: getSpecificPubli });
    }
});
//get list of Publication based on book
app.get('/:book', (req, res) => {
    const getSpecificPubByBook = Database.publications.filter((publication) => publication.books.includes(req.params.book));
    if (getSpecificPubByBook.length === 0) {
        return res.json({ error: `No publications found for the books of ${req.params.book}` });
    }
    return res.json({ publications: getSpecificPubByBook });
});

//start server
app.listen(3000, () => console.log('server has started'));