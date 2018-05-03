const game = document.getElementById('title').innerText

const btnCreate = document.querySelector('#create')
btnCreate.addEventListener('click', evt => {
    window.location.href = '/game/' + game;
})

const btnJoin = document.querySelector('#join')
btnJoin.addEventListener('click', evt => {
    $('#joinModal').modal()
})

const confirm = () => {
    console.log('clickk')
    window.location.href = '/player/' + game + '/' + document.getElementById('roominput').value;
}
