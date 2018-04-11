const express = require('express');
const moment = require('moment')
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    const param1 = req.path;
    const queryparams = req.query;
    console.log('Time: ' + moment().format('LLL') + '\n' +
    'Got to the root with path: ' + param1 + '\n' +
    'with query params: ' + JSON.stringify(queryparams) + '\n' +
    'IP: ' + JSON.stringify(req.ip) + '\n' +
    'User agent: ' + req.headers['user-agent']);
    res.render('index', { "title": 'Project' });
});

module.exports = router;
