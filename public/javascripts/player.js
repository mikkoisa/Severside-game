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
    // TODO: Add popup before redirecting 
    window.location.href = '/'
});

const btnSend = document.querySelector('#send')
btnSend.addEventListener('click', evt => {
    // send data to the room 'host'
});
