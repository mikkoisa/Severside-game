const express = require('express');
const moment = require('moment')
const router = express.Router();
const DB = require('../modules/database');
const Score = DB.getSchema('Score');

/* GET home page. */

router.get('/', (req, res, next) => {
    // Score.collection.drop();
    res.render('menu')
});

router.get('/lobby/:game/:name', (req, res, next) => {
    res.render('lobby', { 'title': req.params.name, 'game': req.params.game });
});

router.get('/game/:game/:name', (req, res, next) => {
    res.render(req.params.game + '/game', { 'game': req.params.name, 'title': req.params.game });
});

router.get('/player/:game/:name/:room', (req, res, next) => {
    res.render(req.params.game + '/player', { 'roomId': req.params.room, 'game': req.params.name });
});


// Database stuff
router.get('/scores/:game/', (req, res, next) => {
    Score.find().
        where('game').
        equals(req.params.game).
        sort({ 'score': 'descending' }).
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
