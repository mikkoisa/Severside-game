const socket = io.connect('https://localhost:3000');

socket.emit('create');

socket.on('connect', () => {
    console.log('Host connected');
});

socket.on('disconnect', () => {
    console.log('Host disconnected!');
});

socket.on('created', msg => {
    document.getElementById('room').innerHTML = 'Room password: ' + msg
});

socket.on('updatePlayers', msg => {
    const screen = document.getElementById('screen'); 
    while (screen.hasChildNodes()) {   
        screen.removeChild(screen.firstChild);
    }

    const players = [];
    for (player in msg) {
        players.push(player);
    }
    players.splice(0, 1);

    for (player in players) {
        const massage = document.createElement("p");
        massage.innerHTML = players[player];
        massage.id = player;        
        screen.appendChild(massage)
    }
    
});
