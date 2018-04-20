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


// Some test game commands

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
const dx = 2;
const dy = -2;
const speedX = 0;
const speedY = 0;

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

const draw = (unit, value) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (unit == y) {
        y += value
    } else {
        x += value
    }
    drawBall();
    
}


/* const moveup = () => {
    draw(y, -5); 
}

const movedown = () => {
    draw(y, 5); 
    // myGamePiece.speedY += 1; 
}

const moveleft = () => {
    draw(x, -5); 
    // myGamePiece.speedX -= 1;
}

const moveright = () => {
    draw(x, 5); 
   // myGamePiece.speedX += 1;
} */

socket.on('move object', (direction) => {
    if (direction == 'up') {
        draw(y, -5);
    } else if (direction == 'down') {
        draw(y, 5);
    } else if (direction == 'left') {
        draw(x, -5);   
    } else if (direction == 'right') {
        draw(x, 5);
    }
});

