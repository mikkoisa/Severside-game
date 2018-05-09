const express = require('express');
const moment = require('moment')
const router = express.Router();
const DB = require('../modules/database');
const Score = DB.getSchema('Score');

/* GET home page. */

router.get('/', (req, res, next) => {
    Score.collection.drop();
    res.render('menu')
});

router.get('/lobby/:game', (req, res, next) => {
    res.render('lobby', { 'title': req.params.game });
});

router.get('/game/:game', (req, res, next) => {
    // Check which game
    switch (req.params.game) {    
    case 'Ball-Game':
        res.render('game', { 'game': req.params.game });
        break;

    case 'Game 2':
        res.render('game2', { 'game': req.params.game });
        break;
    default:
    }
});

router.get('/player/:game/:room', (req, res, next) => {
    res.render('player', { 'roomId': req.params.room, 'game': req.params.game });
});


// Database stuff
router.get('/scores/:game/', (req, res, next) => {
    Score.find().sort({ 'score': 'descending' }).
        then(scores => {
            res.send(scores);
        });
});

router.post('/scores/:game/:name/:score', (req, res, next) => {
    const time = new Date().toJSON().
        slice(0, 10).
        replace(/-/g, '/');

    Score.create(new Score({
        'game': req.params.game,
        'name': req.params.name,
        'score': req.params.score,
        'date': time
    }))

    console.log('saved to db')
});

module.exports = router;
