const game = document.getElementById('gameName').innerText
const title = document.getElementById('title').innerText
console.log(game)


const btnCreate = document.querySelector('#create')
btnCreate.addEventListener('click', evt => {
    window.location.href = '/game/' + game + '/' + title;
})

const btnJoin = document.querySelector('#join')
btnJoin.addEventListener('click', evt => {
    $('#joinModal').modal()
})

const confirm = () => {
    console.log('clickk')
    window.location.href = '/player/' + game + '/' + title + '/' + document.getElementById('roominput').value;
}
