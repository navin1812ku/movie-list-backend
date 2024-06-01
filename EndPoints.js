const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./routes/UserRouter');
const MoviesList = require('./routes/MoviesListRouter');
const bodyParser = require('body-parser');


const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_ATLAS_URI)
    .then(() => {
        console.log("Database connected!");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(User);
app.use(MoviesList);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
