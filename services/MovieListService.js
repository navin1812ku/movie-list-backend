const axios = require('axios');
const MovieList = require("../models/MovieList");


const MovieListService = {
    search: async (query) => {
        try {
            console.log(query)
            const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&type=${"movie"}&s=${query}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            return { error: 'Movie search failed' };
        }
    },
    creatMovieList: async (userId, movieListDetails) => {
        try {
            const movieList = {
                userId: userId,
                name: movieListDetails.name,
                movies: [],
                isPublic: movieListDetails.isPublic
            }
            const list = await MovieList.findOne({ name: movieListDetails.name });
            if (list.userId !== userId) {
                return { message: "Movie list name already exists, please try another name" }
            }
            else {
                await MovieList.create(movieList);
                return { message: "Movie list created successfully" };
            }
        } catch (error) {
            return { error: 'Failed to create movie list' };
        }
    },
    getMovieLists: async (userId, movieListId) => {
        try {
            console.log(userId, " ", movieListId);
            const lists = await MovieList.findOne({
                _id: movieListId,
                userId: userId
            });
            console.log(lists);
            if (lists) {
                return {
                    success: true,
                    movieList: lists
                };
            }
            else {
                return {
                    success: false,
                    message: "Given movie list does not exists"
                };
            }

        } catch (error) {
            return {
                success: false,
                error: 'Failed to get movie lists'
            };
        }
    },
    addMovieToList: async (userId, movieListId, movieDetails) => {
        try {
            const list = await MovieList.findOne({
                _id: movieListId,
                userId: userId
            });

            const movie = {
                title: movieDetails.Title,
                year: movieDetails.Year,
                id: movieDetails.imdbID,
                poster: movieDetails.Poster
            }

            list.movies.push(movie);

            await list.save();
            return list;
        } catch (error) {
            return { error: 'Failed to add movie to list' };
        }
    },
    getMovie: async (id) => {
        try {
            const movieList = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&type=${"movie"}&i=${id}`);
            return movieList;
        } catch (error) {
            return { error: 'Failed to access movie' };
        }
    },
    getMovieListById: async (userId, id) => {
        try {
            const movieList = await MovieList.findById(id);
            console.log(movieList);
            if (!movieList.isPublic && movieList.userId.toString() !== userId) {
                return {
                    success: false,
                    message: "The movie list your are trying to access is private only the list owner can see that"
                }
            }
            else {
                return {
                    success: true,
                    movieList: movieList
                };
            }
        }
        catch (error) {
            return {
                message: "The movie list does not exists"
            }
        }
    },
    deleteMovieList: async (id) => {
        try {
            await MovieList.findOneAndDelete({
                _id: id
            });
            return {
                success: true
            }
        } catch (error) {
            return {
                success: false
            }
        }
    },
    getAllMovieLists: async (userId) => {
        try {
            const allmovieList = await MovieList.find({
                userId: userId
            });
            return allmovieList;
        }
        catch (error) {
            return {
                message: "Failed to delete movie list"
            }
        }
    },
    searchMovieLists: async (userId, name) => {
        try {
            const lowerCasedName = name.toLowerCase();
            const regexName = new RegExp(`^${lowerCasedName}$`, 'i');
            const lists = await MovieList.find({ name: regexName });

            const filteredLists = lists.filter(list => {
                return list.isPublic || list.userId.toString() === userId;
            });

            console.log(lists, filteredLists);

            if (filteredLists.length == 0) {
                return {
                    success: false,
                    message: "Given movie list does not exists"
                }
            }

            return {
                success: true,
                movieLists: filteredLists
            };
        }
        catch (error) {
            return {
                success: false,
                message: "Failed to delete movie list"
            }
        }
    }
}

module.exports = MovieListService;