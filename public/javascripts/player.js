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

const move = (direction) => {
    /* console.log('moving' + direction)
    moveInterval = setInterval(() => {
        console.log(slow)
        socket.emit('move object', direction, slow)
    }, 1000 / 60); */
} 
 

window.addEventListener('keydown', (event) => {
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
    socket.emit('move object', direction)

});

window.addEventListener('keyup', (event) => {
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
    socket.emit('stop object', direction)
});

$('button').on('mousedown mouseup touchstart touchend', (e) => {
    if (e.type == 'mousedown' || e.type == 'touchstart') {
        console.log(e.type)
        socket.emit('move object', e.currentTarget.id, slow)

    } else if (e.type == 'mouseup' || e.type == 'touchend') {
        socket.emit('stop object', e.currentTarget.id)
    }
});

window.addEventListener('mouseup', (event) => {
   //  clearInterval(moveInterval);
    // slow = 0
    // slow = 2;
    /* setTimeout(() => {
        console.log('clear')
        
        slow = 0;
    }, 500) */
}) 

window.addEventListener('touchend', (event) => {
    // clearInterval(moveInterval);
   // slow = 0
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
