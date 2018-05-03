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
    res.render('game', { 'game': req.params.game });
});

router.get('/player/:game/:room', (req, res, next) => {
    res.render('player', { 'roomId': req.params.room, 'game': req.params.game });
});

module.exports = router;
