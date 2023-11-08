const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const db = require('./connection/connection')
const response = require('./utils/response');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to my API server!');
});

app.get('/book', (req, res) => {
    const query = 'SELECT * FROM books';
    db.query(query, (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error getting books data');
        } else {
            response(200, result, "Success getting books data", res);
        }
    });
});

app.get('/book/:id', (req, res) => {
    const  id  = req.params.id;
    const query = `SELECT * FROM books WHERE id = ${id}`
    db.query(query, (err, result) => {
        if ( err ) {
            console.error(err.message);
            res.status(err.code).send('Error getting books specific data')
        } else {
            response(200, result, "Success getting books specific data", res)
        }
    });
});

app.post('/book', (req, res) => {
    const book = req.body;
    const dataBook = {
        nama: book.nama,
        penulis: book.penulis,
        penerbit: book.penerbit,
        tahun: book.tahun,
        halaman: book.halaman,
    }
    const query = "INSERT INTO books SET ?"
    db.query(query, dataBook, (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error creating books row');
        } else {
            response(201, result, "Success creating books data", res);
        }
    });
});

app.put('/book/:id', (req, res) => {
    const id = req.params.id;
    const newBook = req.body;
    const newDataBook = {
        nama: newBook.nama,
        penulis: newBook.penulis,
        penerbit: newBook.penerbit,
        tahun: newBook.tahun,
        halaman: newBook.halaman,
    }
    const query = `UPDATE books SET ? WHERE id = ${id}`;
    db.query(query, newDataBook, (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error updating books data');
        } else {
            response(201, result, "Success updating books data with id " + id, res);
        }
    });
});

app.delete('/book/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM books WHERE id = ${id}`;
    db.query(query, (err, result) => {
        if ( err ) {
            console.error(err.message);
            res.status(err.code).send('Error deleting books data with id: ' + id);
        } else {
            response(200, result, "Success deleting books data with id " + id, res);
        }
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
