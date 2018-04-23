// const socket = io.connect('https://localhost:3000');
const socket = io.connect('https://bestgame.jelastic.metropolia.fi');

let moveInterval = '';

socket.on('connect', () => {
    socket.emit('join', document.getElementById('roomId').innerHTML)
});

socket.on('disconnect', () => {
    console.log("user left")
    socket.emit('messageleave')
});

socket.on('closeRoom', (msg) => {
    console.log(msg)
    $('#myModal').modal()
});

$('#myModal').on('hidden.bs.modal', () => {
    window.location.href = '/'
})

// Test game commands

let slow = 0

const move = (direction) => {
    console.log('moving' + direction)
    moveInterval = setInterval(() => {
        console.log(slow)
        socket.emit('move object', direction, slow)
    }, 10);
}

window.addEventListener('mouseup', (event) => {
    clearInterval(moveInterval);
    slow = 0
    // slow = 2;
    /* setTimeout(() => {
        console.log('clear')
        
        slow = 0;
    }, 500) */
})

window.addEventListener('touchend', (event) => {
    clearInterval(moveInterval);
    slow = 0
    // slow = 2;
    /* setTimeout(() => {
        console.log('clear')
        
        slow = 0;
    }, 500) */
})


/* const moveup = () => {
    socket.emit('move object', 'up')
}

const movedown = () => {
    socket.emit('move object', 'down')
}

const moveleft = () => {
    socket.emit('move object', 'left')
}

const moveright = () => {
    socket.emit('move object', 'right')
} */
