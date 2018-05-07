const socket = io.connect('https://localhost:3000');
// const socket = io.connect('https://bestgame.jelastic.metropolia.fi');
socket.emit('create');

const canvas = d3.select('svg')
let x = canvas._groups["0"]["0"].clientWidth / 2;
let y = canvas._groups["0"]["0"].clientHeight / 2;
const r = 15;
let moveInterval = '';
let player = '';
let k = 0;
let timer = '';
let pressUp = false;
let pressDown = false;
let pressLeft = false;
let pressRight = false;
let particles = [];


const drawMove = (movable) => {
    let cy = parseFloat(movable.attr('cy'));
    let cx = parseFloat(movable.attr('cx'));
    let vy = parseFloat(movable.attr('vy'));
    let vx = parseFloat(movable.attr('vx'));

    cy += vy;
    cx += vx;

    if (cy > canvas._groups["0"]["0"].clientHeight || cy < 0) {
        vy = -vy;
    } else { 
        // vy += g; 
    }
    if (cx > canvas._groups["0"]["0"].clientWidth || cx < 0) {
        vx = -vx;
    }

    movable.
        attr('cy', cy).
        attr('cx', cx).
        attr('vy', vy).
        attr('vx', vx)

}

const calculateCollision = (particle1, particle2) => {
    const absx = Math.abs(parseFloat(particle2.attr('cx')) - parseFloat(particle1.attr('cx')));
    const absy = Math.abs(parseFloat(particle2.attr('cy')) - parseFloat(particle1.attr('cy')));

    let distance = absx * absx + absy * absy;
    distance = Math.sqrt(distance);

    if (distance < parseFloat(particle1.attr('r')) + parseFloat(particle2.attr('r'))) {
        return true;
    }
    return false;
    
}

const chekcCollision = (particle1, particle2, isPalyer) => {
    const p1x = parseFloat(particle1.attr('cx'));
    const p1y = parseFloat(particle1.attr('cy'));
    const p2x = parseFloat(particle2.attr('cx')); 
    const p2y = parseFloat(particle2.attr('cy')); 
    
    const p1vx = parseFloat(particle1.attr('vx')); 
    const p1vy = parseFloat(particle1.attr('vy')); 
    const p2vx = parseFloat(particle2.attr('vx')); 
    const p2vy = parseFloat(particle2.attr('vy'));

    const p1w = parseFloat(particle1.attr('weight')); 
    const p2w = parseFloat(particle2.attr('weight')); 
    
    if (calculateCollision(particle1, particle2)) {
        // If player touches a particle
        if (isPalyer == true) {
            console.log('GAME OVER!')
            clearInterval(moveInterval);
            k = 0;
            particles = [];
            timer = 0;

            // Remove contents of canvas
            d3.select('svg').html('')

            socket.emit('game over', 'game1');
            $('#scoreModal').modal()

        // If collision is between two particles, calculate new directions
        } else if (particle1.attr(particle2) != true || particle2.attr(particle1) != true) {
            const vx1 = (p1vx * (p1w - p2w) + 2 * p2w * p2vx) / (p1w + p2w);
            const vy1 = (p1vy * (p1w - p2w) + 2 * p2w * p2vy) / (p1w + p2w);
            const vx2 = (p2vx * (p2w - p1w) + 2 * p1w * p1vx) / (p1w + p2w);
            const vy2 = (p2vy * (p2w - p1w) + 2 * p1w * p1vy) / (p1w + p2w);

            particle1.attr(particle2.attr('id'), true);
            particle2.attr(particle1.attr('id'), true);

            console.log(particle1.attr(particle2.attr('id')) + ' and ' + particle2.attr(particle1.attr('id')))
            // set velocities for both balls
            particle1.attr('vx', vx1);
            particle1.attr('vy', vy1);
            particle2.attr('vx', vx2);
            particle2.attr('vy', vy2);

            while (calculateCollision(particle1, particle2)) { 
                drawMove(particle1);
                drawMove(particle2);

            }
            particle1.attr(particle2.attr('id'), null);
            particle2.attr(particle1.attr('id'), null);
        } 
    }
}

const moveParticle = (particle) => {
    let movable = '';

    if (typeof particle == 'string') {
        movable = particles[particle];
    } else {
        movable = particle;
    }

    chekcCollision(player, movable, true);
    
    for (let j = 0; j < particles.length; j++) {
        if (j != particle) {
            chekcCollision(movable, particles[j], false);
        }
    }

    drawMove(movable);
}

const addParticle = () => {
    const weight = Math.floor(Math.random() * (60 - 10 + 1)) + 10;
    const particle = d3.select('svg').append('circle').
        attr('cx', Math.random() * canvas._groups["0"]["0"].clientWidth).
        attr("cy", Math.random() * canvas._groups["0"]["0"].clientHeight).
        attr('vx', Math.random() * 10 - 5).
        attr('vy', Math.random() * 10 - 5).
        attr('r', 2 + weight).
        attr('id', 'particle' + k).
        attr('weight', weight).
        style('fill', 'white');
    k++;
    particles.push(particle);
}

const gameLoop = () => {
    timer = 0;
    x = canvas._groups["0"]["0"].clientWidth / 2;
    y = canvas._groups["0"]["0"].clientHeight / 2;

    player = d3.select('svg').append("circle").
        attr("cx", x).
        attr("cy", y).
        attr("r", r).
        style("fill", "purple");

    moveInterval = setInterval(() => {
        if (timer == 0 ||
            timer == 500 ||
            timer == 1000 ||
            timer == 2000 ||
            timer == 3000 ||
            timer == 4000 ||
            timer == 5000) {
            addParticle();
        }
        for (particle in particles) {
            moveParticle(particle);
        }

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
        timer += 1
    }, 1000 / 60);
}

// Socket stuff here
socket.on('connect', () => {
    console.log('Host connected');
});

socket.on('disconnect', () => {
    console.log('Host disconnected!');
});

socket.on('created', msg => {
    document.getElementById('roomId').innerHTML = 'Room password: ' + msg
});


socket.on('updatePlayers', msg => {
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
        massage.className = 'col-8 offset-2'
        massage.innerHTML = 'Player: ' + players[playa];
        massage.id = playa;        
        screen.appendChild(massage)
    }  
});


socket.on('start game', msg => {
    console.log('game starting');
    document.getElementById('content').style.display = 'none'
    document.getElementById('gameContent').style.display = 'inherit'
    gameLoop();
});

socket.on('after game', (game, to) => {
    if (to == 'game') {
        $('#scoreModal').modal('toggle');
        gameLoop();
    } else if (to == 'lobby') {
        $('#scoreModal').modal('toggle');
        document.getElementById('content').style.display = 'inherit'
        document.getElementById('gameContent').style.display = 'none'
    }
});

socket.on('move object', (direction, slow) => {
    if (direction == 'up') {
        pressUp = true;
    } else if (direction == 'down') {
        pressDown = true;
    } else if (direction == 'left') {
        pressLeft = true;
    } else if (direction == 'right') {
        pressRight = true;
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
}); 
