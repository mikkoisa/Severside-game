const socket = io.connect('https://localhost:3000');
// const socket = io.connect('https://bestgame.jelastic.metropolia.fi');
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
    for (playa in msg) {
        players.push(playa);
    }
    players.splice(0, 1);

    for (playa in players) {
        const massage = document.createElement("p");
        massage.innerHTML = players[playa];
        massage.id = playa;        
        screen.appendChild(massage)
    }
});


// Some test game commands

// const canvas = document.getElementById('canvas');
const canvas = d3.select('svg')

// const ctx = canvas.getContext("2d");

let x = canvas._groups["0"]["0"].clientWidth / 2;
let y = canvas._groups["0"]["0"].clientHeight / 2;

let moveInterval = ''

const dx = 2;
const dy = -2;
const speedX = 0;
const speedY = 0;

let pressUp = false;
let pressDown = false;
let pressLeft = false;
let pressRight = false;

const player = d3.select("circle").
    attr("cx", x).
    attr("cy", y).
    attr("r", 15).
    style("fill", "purple");

setInterval(() => {
    if (pressUp) {
        player.attr('cy', y -= 2)
    } 
    
    if (pressDown) {
        player.attr('cy', y += 2)
    }

    if (pressLeft) {
        player.attr('cx', x -= 2)
    }

    if (pressRight) {
        player.attr('cx', x += 2)
    }
}, 1000 / 60);

const drawBall = () => {
    /* ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.closePath();
    ctx.fill(); */

    const circle = new Path2D();
    circle.moveTo(x, y);
    circle.arc(x, y, 2, 0, Math.PI * 2);
    circle.closePath();
    ctx.fill(circle);
}

const draw = (unit, value, slow) => {
    console.log(canvas);
    /* ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (unit == 'y') {
        if (slow == 0) {
            y += value
        } else {
            y += value / slow
        }
       
    } else if (unit == 'x') {
        if (slow == 0) {
            x += value
        } else {
            x += value / slow
        }
    }
    console.log(unit + ' : ' + value);
    drawBall(); */

    moveInterval = setInterval(() => {

        if (pressUp && !pressDown && !pressLeft && !pressRight) {
            console.log('up: ' + pressUp + pressDown + pressLeft + pressRight)
            player.attr('cy', y -= 2)
        } else if (!pressUp && pressDown && !pressLeft && !pressRight) {
            console.log('down: ' + pressUp + pressDown + pressLeft + pressRight)
            player.attr('cy', y += 2)
        } else if (!pressUp && !pressDown && pressLeft && !pressRight) {
            console.log('left: ' + pressUp + pressDown + pressLeft + pressRight)
            player.attr('cx', x -= 2)
        } else if (!pressUp && !pressDown && !pressLeft && pressRight) {
            console.log('right: ' + pressUp + pressDown + pressLeft + pressRight)
            player.attr('cx', x += 2)
        }
    }, 1000 / 60);

    /* if (unit == 'y') {
        moveInterval = setInterval(() => {
            player.attr('cy', y += value)
        }, 1000 / 60);
       
    } else if (unit == 'x') {
        moveInterval = setInterval(() => {
            player.attr('cx', x += value)
        }, 1000 / 60);
    } */
    
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

socket.on('move object', (direction, slow) => {
    if (direction == 'up') {
        pressUp = true;
        // draw('y', -1, slow);
    } else if (direction == 'down') {
        pressDown = true;
        // draw('y', 1, slow);
    } else if (direction == 'left') {
        pressLeft = true;
        // draw('x', -1, slow);   
    } else if (direction == 'right') {
        pressRight = true;
        // draw('x', 1, slow);
    }
});

socket.on('stop object', (direction, slow) => {
    if (direction == 'up') {
        pressUp = false;
    } else if (direction == 'down') {
        pressDown = false;
    } else if (direction == 'left') {
        pressLeft = false;  
    } else if (direction == 'right') {
        pressRight = false;
    }
    if (pressDown == false && pressUp == false && pressLeft == false && pressRight == false) {
        clearInterval(moveInterval); 
        moveInterval = '';
    }
}); 
