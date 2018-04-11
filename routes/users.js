const express = require('express');
const router = express.Router();

let users = [
    {
        'id': 0,
        'name': "user",
        'age': 20
    },
    {
        'id': 1,
        'name': "tester",
        'age': 23
    }
]


/* GET users listing. */
router.get('/:userid', (req, res, next) => {
    for (user in users) {
        if (user == req.params.userid) {
            res.send(users[user]);
        }
    }
    
});

router.get('/', (req, res, next) => {
    console.log("showwww")
    res.send(users);
});

router.post('/', (req, res, next) => {
    for (user in users) {
        if (users[user].id == req.body.id) {
            users[user].name = req.body.newName
        }
    }
    res.send(users);
});

router.put('/:name/:age', (req, res, next) => {
    users.push({
        'id': users.length,
        'name': req.params.name,
        'age': req.params.age
    })
    res.send(users);
});

router.delete('/', (req, res, next) => {
    console.log('deleteeeeee')
    users = users.filter(item => item.id !== users.length - 1)
    res.send(users)
})


module.exports = router;
