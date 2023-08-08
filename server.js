const express = require('express');

const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'movie_db'
    },
    console.log(`Connected to the movie_db database.`)
);

// Get request to render all the movies in the database.
app.get('/api/movies', (req, res) => {
    const sql = 'SELECT id, movie_name AS title FROM movies';

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success!',
            data: rows
        });
    });
});

// Get request to render one movie.
app.get('/api/movies/:id', (req, res) => {
    // Can write this either way (storing data in the const variable as seen commented out below or through a template literal).

    // const sql = 'SELECT movie_name FROM movies WHERE id = ?';
    // const params = [req.params.id];

    db.query(`SELECT * FROM movies where id = ${req.params.id};`, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success!',
            data: result
        });
    });
});

// Search by movie name by entering a partial movie name and return the result in descending order.
app.get('/api/reviews/:movie', (req, res)=>{
    db.query(`SELECT reviews.id, movies.movie_name AS title, reviews.review FROM reviews 
    LEFT JOIN movies ON reviews.movie_id = movies.id WHERE movie_name LIKE '%${req.params.movie}%' ORDER BY reviews.id DESC; `, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success!',
            data: result
        });
    });
})

// Post request to add a movie to the database.
app.post('/api/movies', ({ body }, res) => {
    const sql = 'INSERT INTO movies (movie_name) VALUE (?)';

    const nameParam = [body.movie_name]; 

    db.query(sql, nameParam, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success!',
            data: body
        });
    });
});

// Put request to update a movie in the database.
app.put('/api/update/:id', (req, res) => {
    const sql = 'UPDATE movies SET movie_name = ? WHERE id = ?';
    
    const params = [req.body.movie, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Movie not found!'
            });
        } else {
            res.json({
                message: 'Success!',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// Delete route to delete any movies in the database.
app.delete('/api/delete/:id', (req, res) => {
    const sql = 'DELETE FROM movies WHERE id = ?';

    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result) {
            res.json({
                message: 'Movie not found!'
            });
        } else {
            res.json({
                message: 'Deleted!',
                data: req.body,
                changes: result
            });
        }
    });
});

// Get route to get all the reviews in the database.
app.get('/api/reviews', (req, res) => {
    const sql = 'SELECT * FROM reviews';

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success!',
            data: rows
        });
    });
});

// Put route to update a review in the database.
app.put('/api/reviews/:id', (req, res) => {
    const sql = 'UPDATE reviews SET review = ? WHERE id = ?';
    
    const params = [req.body.review, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Review not found!'
            });
        } else {
            res.json({
                message: 'Success!',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});