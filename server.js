const createError = require('http-errors');
const express = require('express');
const https = require('https');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config()
const app = express();

const DB = require('./modules/database');

const randomstring = require("randomstring");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const fs = require('fs');
let server = ''
app.enable('trust proxy');
console.log(process.env.MODE)

if (process.env.MODE == 'local') {
    const sslkey = fs.readFileSync('ssl-key.pem');
    const sslcert = fs.readFileSync('ssl-cert.pem')

    const options = {
        "key": sslkey,  
        "cert": sslcert
    };
    server = https.createServer(options, app).listen(3000);
    
} else if (process.env.MODE == 'cloud') {
    server = app.listen(3000);
}


app.use((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
        next();
    } else {
      // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});
  

const io = require('socket.io').listen(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ "extended": false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/modules', express.static('node_modules'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err)
  // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Socket.io functions
io.on('connection', socket => {
    let room = ''
    let host = ''
    console.log('server: connection!');

    socket.on('create', () => {
        room = randomstring.generate(5);
        console.log('room created: ' + room);
        host = socket.id
        socket.join(room);
        socket.emit('created', room)
    });

    socket.on('disconnect', () => {
        if (socket.id == host) {
            console.log('host disconnected');
            socket.broadcast.to(room).emit('remove user', 'The room has been closed')
        } else {
            console.log('user disconnected');
            if (io.sockets.adapter.rooms[room]) {
                socket.leave(room);
                socket.broadcast.to(room).emit('updatePlayers', io.sockets.adapter.rooms[room].sockets)
            }
        }
        room = '';   
    });

    socket.on('join', (huone) => {
        if (io.sockets.adapter.rooms[huone]) {
            console.log("Joined roooooooom")
            socket.join(huone)
            room = huone
            console.log(io.sockets.adapter.rooms[room].sockets)
            socket.broadcast.to(huone).emit('updatePlayers', io.sockets.adapter.rooms[room].sockets, socket.id)
        }
    });

    socket.on('listUsers', (huone) => {
        console.log('sending list: ' + huone)
        socket.broadcast.to(huone).emit('listPlayers', io.sockets.adapter.rooms[room].sockets);
    });

    socket.on('room full', (player) => {
        socket.to(player).emit('remove user', 'The room is full')
    });

    socket.on('start game', () => {
        io.sockets.in(room).emit('start game', io.sockets.adapter.rooms[room].sockets);
    });

    socket.on('game over', (game) => {
        socket.broadcast.to(room).emit('game over', game);
    });

    socket.on('after game', (game, to) => {
        io.sockets.in(room).emit('after game', game, to);
    })

    socket.on('move object', (direction) => {
        console.log('moving' + direction)
        socket.broadcast.to(room).emit("move object", direction);
    });

    socket.on('stop object', (direction) => {
        socket.broadcast.to(room).emit("stop object", direction);
    });

    socket.on('submit name', (value) => {
        socket.broadcast.to(room).emit('submit name', value);
    });

});

DB.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':27017/score', app);

