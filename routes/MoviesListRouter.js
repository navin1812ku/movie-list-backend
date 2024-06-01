const express = require('express');
const MovieListService = require('../services/MovieListService');
const { verifyToken } = require('../middleware/Authentication');

const router = express.Router();


// Get movie lists
router.get('/movieLists/:id', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const moviesList = await MovieListService.getMovieLists(userId, id);
    res.json(moviesList);
});

// Create movie list
router.post('/movieLists', verifyToken, async (req, res) => {
    const movieListDetails = req.body;
    const userId = req.user.userId;
    console.log(userId, movieListDetails);
    const movieeList = await MovieListService.creatMovieList(userId, movieListDetails);
    res.json(movieeList);
});

// Add movie to movie list
router.post('/movieLists/:id/:movieListId', verifyToken, async (req, res) => {
    const { id, movieListId } = req.params;
    const userId = req.user.userId;
    const movieDetails = await MovieListService.getMovie(id);
    const movieList = await MovieListService.addMovieToList(userId, movieListId, movieDetails.data);
    res.json(movieList);
});

// Search movies (using OMDB API)
router.get('/search/:query', verifyToken, async (req, res) => {
    const { query } = req.params;
    console.log(query, req.user.userId);
    const movies = await MovieListService.search(query);
    res.json(movies);
});

//Accessing movie list
router.get('/movieListById/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    console.log(id, userId);
    const movieList = await MovieListService.getMovieListById(userId, id);
    res.json(movieList);
});

//Deleteing movie list
router.delete('/moviesList/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const message = await MovieListService.deleteMovieList(id);
    res.json(message);
})

//Get All movie list
router.get('/allMoviesList', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const movieList = await MovieListService.getAllMovieLists(userId);
    res.json(movieList);
});

router.get('/searchMovieList/:name', verifyToken, async (req, res) => {
    const { name } = req.params;
    const userId = req.user.userId;
    const movieLists = await MovieListService.searchMovieLists(userId, name);
    res.json(movieLists);
})


module.exports = router;
