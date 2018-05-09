// const url = 'https://localhost:3000'
const url = 'https://bestgame.jelastic.metropolia.fi'

const socket = io.connect(url);
socket.emit('create');

let playerScore = '';
let teamName = 'no name'; 
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
    const rad = parseFloat(movable.attr('r'));

    cy += vy;
    cx += vx;

    if (cy > canvas._groups["0"]["0"].clientHeight - rad || cy < 0 + rad) {
        vy = -vy;
    } 

    if (cx > canvas._groups["0"]["0"].clientWidth - rad || cx < 0 + rad) {
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

const checkHighscores = (json) => {
    const scoreList = d3.select('#scoreList')

    for (let i = 0; i < json.length && i < 5; i++) {

        const listItem = scoreList.append('div');

        if (json[i].score == playerScore) {
            playerScore = '';
            listItem.style('background-color', '#554e921f');
        }

        listItem.classed('row', true);
        listItem.style('border-bottom', '1px solid #727272');
        listItem.style('margin', '0px');
        listItem.style('padding', '15px 15px 0px 15px');
        listItem.append('p').text(i + 1).
            classed('col-1', true).
            classed('text-center', true)
        listItem.append('p').text(json[i].name).
            classed('col-4', true).
            classed('text-center', true)
        listItem.append('p').text(json[i].score).
            classed('col-3', true).
            classed('text-center', true)
        listItem.append('p').text(json[i].date).
            classed('col-4', true).
            classed('text-center', true)
    }

    socket.emit('game over', 'game1');
    $('#scoreModal').modal()
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
            console.log('GAME OVER!: ' + timer)
            playerScore = timer;
            clearInterval(moveInterval);
            k = 0;
            particles = [];

            // Remove contents of canvas
            d3.select('svg').html('')

            const myInit = { 'method': 'POST' };
            const scoreRequest = new Request(url + '/scores/Ball-Game/' + teamName + '/' + playerScore, myInit)  
            fetch(scoreRequest)
            console.log('sent to db')

            fetch(new Request(url + '/scores/' + game)).then(response => response.json()).
            then(json => { 
                console.log('get from db')
                checkHighscores(json)
                
            })

        // If collision is between two particles, calculate new directions
        } else if (particle1.attr(particle2) != true || particle2.attr(particle1) != true) {
            const vx1 = (p1vx * (p1w - p2w) + 2 * p2w * p2vx) / (p1w + p2w);
            const vy1 = (p1vy * (p1w - p2w) + 2 * p2w * p2vy) / (p1w + p2w);
            const vx2 = (p2vx * (p2w - p1w) + 2 * p1w * p1vx) / (p1w + p2w);
            const vy2 = (p2vy * (p2w - p1w) + 2 * p1w * p1vy) / (p1w + p2w);

            particle1.attr(particle2.attr('id'), true);
            particle2.attr(particle1.attr('id'), true);

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
    const radius = parseInt(particle.attr('r'), 16);
    const cx = parseFloat(particle.attr('cx'));
    const cy = parseFloat(particle.attr('cy'));

    if (cx < radius) {
        particle.attr('cx', cx + radius)
    } else if (canvas._groups["0"]["0"].clientWidth - cx <= radius) {
        particle.attr('cx', cx - radius)
    }

    if (cy < radius) {
        particle.attr('cy', cy + radius)
    } else if (canvas._groups["0"]["0"].clientHeight - cy <= radius) {
        particle.attr('cy', cy - radius)
    }
    
    particles.push(particle);
}

const gameLoop = () => {
    pressUp = false;
    pressDown = false;
    pressLeft = false;
    pressRight = false;
    const counter = d3.select('#screen');
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
            player.attr('cy', y -= 3)
        } 
        if (pressDown) {
            player.attr('cy', y += 3)
        }
        if (pressLeft) {
            player.attr('cx', x -= 3)
        }
        if (pressRight) {
            player.attr('cx', x += 3)
        }
        timer += 1
        counter.text('Score: ' + timer)
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
    scoreList = d3.select('#scoreList').html('');
    if (to == 'game') {
        $('#scoreModal').modal('toggle');
        gameLoop();
    } else if (to == 'lobby') {
        $('#scoreModal').modal('toggle');
        document.getElementById('content').style.display = 'inherit'
        document.getElementById('gameContent').style.display = 'none'
    }
});

socket.on('submit name', (name) => {
    console.log('name received')
    teamName = name;
    document.getElementById('team').innerHTML = name
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
