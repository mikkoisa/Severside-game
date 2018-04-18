const express = require('express');
const moment = require('moment')
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { 'title': 'Project' });
});

router.get('/game', (req, res, next) => {
    res.render('game')
});

router.get('/player/:room', (req, res, next) => {
    res.render('player', { 'roomId': req.params.room })
});

module.exports = router;
