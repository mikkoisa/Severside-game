const express = require('express');
const moment = require('moment')
const router = express.Router();

/* GET home page. */

router.get('/', (req, res, next) => {
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

module.exports = router;
