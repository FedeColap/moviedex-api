require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies.json')



const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    console.log('validate bearer token middleware')
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

function handleGetMovies(req, res) {
    // res.send('Here is one movie')
    let response = MOVIES;
    if (req.query.country) {
        response = response.filter(movie =>
          // case insensitive searching
          movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }
    if (req.query.genre) {
        response = response.filter(movie =>
          // case insensitive searching
          movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    } 
    if (req.query.avg_vote) {
        response = response.filter(movie =>
          // case insensitive searching
          movie.avg_vote >= req.query.avg_vote
        )
    }

    res.json(response)
}

app.get('/movies', handleGetMovies)

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
