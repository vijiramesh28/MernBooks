//require dotenv
require("dotenv").config();

//require express
const express = require("express");

//initializing express to app
const app = express();

//require mongoose
const mongoose = require("mongoose");

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

const BookModel = require('./database/books');
const AuthorModel = require('./database/authors');
const PublicationModel = require('./database/publication');

//json from express
app.use(express.json());




//---------------API Generation starts here ----------------------

//Books

// Need API
//GET
//get all books
// app.get('/', (req, res) => {
//     return res.json({ books: Database.books });
// });

app.get('/', async(req,res)=>{
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

//get specific books -To get Specific books we need an id, for these books Unique id is an ISBN, so we need to pass isbn in api

app.get('/is/:isbn', async(req,res)=>{
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
    if(!getSpecificBook){
        return res.json({error: `No books found for the ISBN of ${req.params.isbn}`});
    }
    return res.json({books: getSpecificBook, status:`Books by isbn get`});
});

//get specific books based on category
app.get('/book/:category', async(req,res)=>{
    const getSpecificBookByCat = await BookModel.findOne({category: req.params.category});
    if(!getSpecificBookByCat){
        return res.json({error: `No books found for the category of ${req.params.category}`});
    }
    return res.json({books: getSpecificBookByCat})
});
// app.get('/c/:category', (req, res) => {
//     const getSpecificBooks = Database.books.filter((book) => book.category.includes(req.params.category));
//     console.log(getSpecificBooks);
//     if (getSpecificBooks.length === 0) {
//         return res.json({ error: `No books found for the category of ${req.params.category}` });
//     }
//     return res.json({ books: getSpecificBooks });
// });


//get a list of books based on author
app.get('/books/:author', async(req,res)=>{
    const getSpecificBookbyAuthor = await BookModel.findOne({authors: req.params.author});
    if(!getSpecificBookbyAuthor){
        return res.json({error:`No books found for the author of ${req.params.author}`});
    }
    return res.json({books: getSpecificBookbyAuthor});
});

// app.get('/a/:author', (req, res) => {
//     const authorid = Number(req.params.author);
//     const getBookByAuthor = Database.books.find((authors) => authors.authors.includes(Number(req.params.author)))
//     console.log(getBookByAuthor);
//     if (!getBookByAuthor) {
//         return res.json({ error: `No books found for the author of ${req.params.author}` });
//     }
//     return res.json({ books: getBookByAuthor });
// });

//POST
//Add New Books
app.post('/book/New', async(req, res) => {
    //body 
    const { Newbooks } = req.body;
    const AddNewBook =  BookModel.create(Newbooks);
    return res.json({ books: AddNewBook, Status: `New Books Added!!` });
});

//PUT
// app.put('/book/update/:isbn', (req, res) => {
//     Database.books.forEach((book) => {
//         if (book.ISBN === req.params.isbn) {
//             book.title = req.body.NewTitle;
//         }
//     });
//     return res.json({ books: Database.books })

// });


//PUT
//Update New title to books
app.put('/book/update/:isbn',async(req, res)=>{
    const UpdateNewTitle = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: req.body.updatetitle,
        },
        {
            new:true,
        }
        
        )
        return res.json({books:UpdateNewTitle, Status: `Title updated`});
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



// app.get('/is/:isbn', (req, res) => {
//     const getSpecificBook = Database.books.filter((book) => book.ISBN === req.params.isbn)
//     if (getSpecificBook.length === 0) {
//         return res.json({ error: `No books found for isbn of ${req.params.isbn}` });
//     }
//     return res.json({ book: getSpecificBook });
// });





//Author

//we need api
//get all authors
app.get('/authors', async(req,res)=>{
    const getAuthors = await AuthorModel.find();
    return res.json({authors: getAuthors, status:`Authors get Successfully`});
});
// app.get('/authors', (req, res) => {
//     return res.json({ authors: Database.authors });
// });


//POST
// Add new Author
app.post('/author/new', (req,res)=>{
    const {NewAuthor} = req.body;
    const NewAuthorCreate = AuthorModel.create(NewAuthor);
    return res.json({authors: NewAuthorCreate, status:`New Authors created`});
});
// app.post('/au/New', (req, res) => {
//     //body 
//     const { NewAuthor } = req.body;
//     Database.authors.push(NewAuthor);
//     return res.json({ authors: Database.authors, Status: `New Books Added!!` });
// });


//get specific author
app.get('/author/:id', async(req,res)=>{
    const getSpecificAuthorById = await AuthorModel.findOne({id: req.params.id});
    if(!getSpecificAuthorById){
        return res.json({error: `No authors found for the id of ${req.params.id}`});
    }
    return res.json({authors: getSpecificAuthorById});
});
// app.get('/au/:id', (req, res) => {
//     const getSpecificAuthor = Database.authors.filter((author) => author.id == req.params.id);
//     if (getSpecificAuthor.length === 0) {
//         return res.json({ error: `No authors found for the ISBN of ${req.params.id}` });
//     }
//     return res.json({ authors: getSpecificAuthor });
// });
//get list of author based on book
app.get('/au/:book', async(req,res)=>{
    const getSpecificAuthorByBook = await AuthorModel.findOne({books: req.params.book});
    if(!getSpecificAuthorByBook){
        return res.json({error: `No authors found for the book of ${req.params.book}`});
    }
    return res.json({authors: getSpecificAuthorByBook});
})
// app.get('/aut/:book', (req, res) => {
//     const getAuthorByBooks = Database.authors.filter((author) => author.books.includes(req.params.book));
//     if (getAuthorByBooks.length === 0) {
//         return res.json({ error: `No authors found for books of ${req.params.book}` });
//     }
//     return res.json({ authors: getAuthorByBooks });
// });


//Publication

//we need api
//get all Publications
app.get('/publication', async(req,res)=>{
    const getPublications = await PublicationModel.find();
    return res.json({publications: getPublications, status:`publications get succesfully`});
});
// app.get('/publications', (req, res) => {
//     return res.json({ publications: Database.publications });
// });

//POST
//Add New publications
app.post('/publications/new',async(req,res)=>{
    const {NewPubli} = req.body;
    const NewPublications = PublicationModel.create(NewPubli);
    return res.json({publications:NewPublications, status: `Publications added successfully`});
});
// app.post('/publication/New', (req, res) => {
//     const { newPublication } = req.body;
//     Database.publications.push(newPublication);
//     return res.json({ publications: Database.publications, Status: `New publications Has Added!!` });
// });

//get specific Publication
app.get('/pub/:id', async(req,res)=>{
    const getPublicationById = await PublicationModel.findOne({id: req.params.id});
    if(!getPublicationById){
        return res.json({error: `No publications found for the id of ${req.params.id}`});
    }
    return res.json({publications: getPublicationById});
});
// app.get('/pub/:id', (req, res) => {
//     const getSpecificPubli = Database.publications.filter((publication) => publication.id == req.params.id);
//     if (!getSpecificPubli) {
//         return res.json({ error: `No Books found for the id of ${req.params.id}` });
//     }
//     else {
//         return res.json({ publications: getSpecificPubli });
//     }
// });
//get list of Publication based on book
app.get('/publication/:book', async(req,res)=>{
    const getPublicationByBook = await PublicationModel.findOne({books: req.params.book});
    if(!getPublicationByBook){
        return res.json({error: `No publications found for the books of ${req.params.book}`});
    }
    return res.json({publication: getPublicationByBook});
});
// app.get('publication/:book', (req, res) => {
//     const getSpecificPubByBook = Database.publications.filter((publication) => publication.books.includes(req.params.book));
//     if (getSpecificPubByBook.length === 0) {
//         return res.json({ error: `No publications found for the books of ${req.params.book}` });
//     }
//     return res.json({ publications: getSpecificPubByBook });
// });

//start server
app.listen(3000, () => console.log('server has started'));