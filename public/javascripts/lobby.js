const btnCreate = document.querySelector('#create')
btnCreate.addEventListener('click', evt => {
   //  socket.emit('create');
    window.location.href = '/game'
})

const btnJoin = document.querySelector('#join')
btnJoin.addEventListener('click', evt => {
    // socket.emit('join');
    window.location.href = '/player/' + document.getElementById('roominput').value
})
