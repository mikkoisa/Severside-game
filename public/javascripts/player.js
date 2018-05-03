const socket = io.connect('https://localhost:3000');
// const socket = io.connect('https://bestgame.jelastic.metropolia.fi');


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
    /* console.log('moving' + direction)
    moveInterval = setInterval(() => {
        console.log(slow)
        socket.emit('move object', direction, slow)
    }, 1000 / 60); */
} 
 

/* window.addEventListener('keydown', (event) => {
    console.log('keydown')
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
    move(direction)
});

window.addEventListener('keyup', (event) => {
    clearInterval(moveInterval);
}); */

$('button').on('mousedown mouseup', (e) => {
    if (e.type == 'mousedown') {

        /* d3.select('p').transition().
        duration(2000).
        style('background-color', 'red')
        attr('height', 250) */

        /* moveInterval = setInterval(() => {
            console.log(slow)
            socket.emit('move object', e.currentTarget.id, slow)
        }, 1000 / 60); */

        socket.emit('move object', e.currentTarget.id, slow)


    } else if (e.type == 'mouseup') {
        console.log('end hold')
        // clearInterval(moveInterval);
        socket.emit('stop object', e.currentTarget.id)
    }
});

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


// Svg test 

const svgContainer = d3.select("body").append("svg").
    attr("width", 200).
    attr("height", 200).
    style("border", "1px solid black").
    style('background-color', 'white').
    append("circle").
    attr("cx", äx).
    attr("cy", 25).
    attr("r", 25).
    style("fill", "purple");


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
