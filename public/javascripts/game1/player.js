// const socket = io.connect('https://localhost:3000');
const socket = io.connect('https://bestgame.jelastic.metropolia.fi');

let playerId = '';

const playerList = d3.select('#playerList');
const game = document.getElementById('game').innerHTML;

// socket.emit('listUsers', document.getElementById('roomId').innerHTML);

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
    playerId = socket.id;
});

socket.on('disconnect', () => {
    socket.emit('messageleave')
});

socket.on('remove user', (msg) => {
    document.getElementById('removeMessage').innerHTML = msg;
    $('#myModal').modal()
});

socket.on('start game', msg => {
    document.getElementById('content').style.display = 'none'

    if (game == 'Ball-Game') {
        game1controls(msg);
        // d3.select('body').style('padding-top', '0px')       
    }
});

socket.on('game over', gameName => {
    $('#scoreModal').modal()
})

socket.on('after game', (gameName, to) => {
    if (to == 'game') {
        $('#scoreModal').modal('toggle');
        
    } else if (to == 'lobby') {
        $('#scoreModal').modal('toggle');
        $('.controls').css('display', 'none')
        document.getElementById('content').style.display = 'inherit'
        d3.select('body').style('padding-top', '50px');  
    }
});


const game1controls = (msg) => {
    const players = Object.keys(msg).length;
    const directions = document.getElementById('directions')

    for (let i = 0; i < players; i++) {
        if (Object.keys(msg)[i] == playerId) {
            switch (players) {    
            case 2:
                for (let j = 0; j < 4; j++) {
                    setEvents(directions.childNodes[j].id, j);
                }
                break;
                
            case 3:
                if (i == 1) {
                    setEvents(directions.childNodes[0].id, 0);
                    setEvents(directions.childNodes[3].id, 3);
                } else if (i == 2) {
                    setEvents(directions.childNodes[1].id, 1);
                    setEvents(directions.childNodes[2].id, 2);
                }
                break;

            case 4:
                if (i == 1) {
                    setEvents(directions.childNodes[0].id, 0);
                    setEvents(directions.childNodes[3].id, 3);
                }
                setEvents(directions.childNodes[i - 1].id, i - 1);
                
                break;
                
            case 5:
                setEvents(directions.childNodes[i - 1].id, i - 1);
                break;

            default:
                setEvents(directions.childNodes[i - 1].id, i - 1);
            }
        }
    }
    d3.select('body').style('padding-top', '0px');  
    document.getElementById('game1Controls').style.display = 'initial';
}


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

const submitName = () => {
    const value = d3.select('#modalInput').property("value");
    socket.emit('submit name', value)
}

const setEvents = (id, j) => {
    const directions = document.getElementById('directions')
    directions.childNodes[j].style.color = 'black';
    $('#' + id).on('mousedown mouseup touchstart touchend', (e) => {
        if (e.type == 'mousedown' || e.type == 'touchstart') {
            socket.emit('move object', e.currentTarget.id)

        } else if (e.type == 'mouseup' || e.type == 'touchend') {
            socket.emit('stop object', e.currentTarget.id)
        }
    });
}

