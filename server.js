const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8086;

// Replace with your actual MongoDB connection string
//const mongoDB = 'mongodb://localhost:27017/booksDatabase';
const mongoDB = 'mongodb://127.0.0.1:27017/booksDatabase';
mongoose.connect(mongoDB);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema for your book data
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  publishedDate: Date
});

// Create a model from the schema
const Book = mongoose.model('Book', bookSchema);

app.use(express.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.render('index', { files: books });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: "Error loading the book data." });
    }
});

app.get('/api/file_tempo', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching data from the database" });
    }
});

app.post('/api/file_tempo/add', async (req, res) => {
    try {
        const newBook = new Book(req.body); // Create a new book with the request body
        const savedBook = await newBook.save(); // Save the book
        res.json({ message: "Data added successfully", book: savedBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving data to the database" });
    }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
