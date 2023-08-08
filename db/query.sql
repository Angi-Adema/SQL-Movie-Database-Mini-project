SELECT movies.movie_name AS title, reviews.review
FROM reviews
LEFT JOIN movies
ON reviews.movie_id = movies.id
WHERE movie_name
LIKE '%${req.params.movie}%'
ORDER BY reviews.id DESC;