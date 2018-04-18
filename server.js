const createError = require('http-errors');
const express = require('express');
const https = require('https');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

const randomstring = require("randomstring");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const fs = require('fs');
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')

const options = {
    "key": sslkey,
    "cert": sslcert
};

const server = https.createServer(options, app).listen(3000);
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
            socket.broadcast.to(room).emit('closeRoom', 'The room has been closed')
        } else {
            console.log('user disconnected');
            if (io.sockets.adapter.rooms[room]) {
                socket.broadcast.to(room).emit('updatePlayers', io.sockets.adapter.rooms[room].sockets)
            }
        }
        
    });

    socket.on('join', (huone) => {
        if (io.sockets.adapter.rooms[huone]) {
            console.log("Joined roooooooom")
            socket.join(huone)
            room = huone
            console.log(io.sockets.adapter.rooms[room].sockets)
            socket.broadcast.to(huone).emit('updatePlayers', io.sockets.adapter.rooms[room].sockets)
        }
    });

});


