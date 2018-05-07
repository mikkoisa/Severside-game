const socket = io.connect('https://localhost:3000');
// const socket = io.connect('https://bestgame.jelastic.metropolia.fi');

const playerList = d3.select('#playerList');
const game = document.getElementById('game').innerHTML;

socket.emit('listUsers', document.getElementById('roomId').innerHTML);

// Check which controls to display

$('#startGame').on('click touchstart', (e) => {
    socket.emit('start game');
    
    // Check which game this is
    /* if (game == 'Ball-Game') {
        document.getElementById('game1Controls').style.display = 'initial';
    } */

});

socket.on('connect', () => {
    socket.emit('join', document.getElementById('roomId').innerHTML)
});

socket.on('disconnect', () => {
    socket.emit('messageleave')
});

socket.on('closeRoom', (msg) => {
    $('#myModal').modal()
});

socket.on('start game', msg => {
    document.getElementById('content').style.display = 'none'
    if (game == 'Ball-Game') {
        document.getElementById('game1Controls').style.display = 'initial';
    }
});

socket.on('game over', gameName => {
    $('#scoreModal').modal()
})

/*
socket.on('listPlayers', msg => {
    console.log('whaaaattttttttttttttttttttt')
    const screen = document.getElementById('playerList'); 
    while (screen.hasChildNodes()) {   
        screen.removeChild(screen.firstChild);
    }

    const players = [];
    for (playa in msg) {
        players.push(playa);
    }
    players.splice(0, 1);

    for (playa in players) {
        const massage = document.createElement('li');
        massage.innerHTML = players[playa];
        massage.id = playa;        
        screen.appendChild(massage)
    }
}); */

$('#myModal').on('hidden.bs.modal', () => {
    window.location.href = '/'
})


const restart = () => {
    socket.emit('after game', game, 'game')
}

const toLobby = () => {
    socket.emit('after game', game, 'lobby')
    // window.location.href = '/game/' + document.getElementById('game').innerHTML
    /* $('.controls').css('display', 'none')

    document.getElementById('content').style.display = 'inherit' */
}

socket.on('after game', (gameName, to) => {
    if (to == 'game') {
        $('#scoreModal').modal('toggle');
        // gameLoop();
    } else if (to == 'lobby') {
        $('#scoreModal').modal('toggle');
        $('.controls').css('display', 'none')
        document.getElementById('content').style.display = 'inherit'
    }
});


// Game1 commands

/* window.addEventListener('keydown', (event) => {
    const key = event.keyCode;
    let direction = '';
    if (key == 37) {
        direction = 'left'
    } else if (key == 38) {
        direction = 'up'
    } else if (key == 39) {
        direction = 'right'
    } else if (key == 40) {
        direction = 'down'
    }
    socket.emit('move object', direction)

}); 

window.addEventListener('keyup', (event) => {
    const key = event.keyCode;
    let direction = '';
    if (key == 37) {
        direction = 'left'
    } else if (key == 38) {
        direction = 'up'
    } else if (key == 39) {
        direction = 'right'
    } else if (key == 40) {
        direction = 'down'
    }
    socket.emit('stop object', direction)
}); */

$('.mover').on('mousedown mouseup touchstart touchend', (e) => {
    if (e.type == 'mousedown' || e.type == 'touchstart') {
        socket.emit('move object', e.currentTarget.id)

    } else if (e.type == 'mouseup' || e.type == 'touchend') {
        socket.emit('stop object', e.currentTarget.id)
    }
});

// Game2 commands here


