const socket = io.connect('https://localhost:3000');

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

const btnSend = document.querySelector('#send')
btnSend.addEventListener('click', evt => {
    // send data to the room 'host'
});

$('#myModal').on('hidden.bs.modal', () => {
    window.location.href = '/'
})

// Test game commands

const move = (direction) => {
    socket.emit('move object', direction)
}

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
