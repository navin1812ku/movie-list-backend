const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Movies = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: String, required: true },
    id: { type: String, required: true },
    poster: { type: String, require: true }
});

const MovieList = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'User' },
    name: { type: String, required: true },
    movies: [Movies],
    isPublic: { type: Boolean, default: false },
});

module.exports = mongoose.model('movieList', MovieList);
