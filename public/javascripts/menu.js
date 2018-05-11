// const url = 'https://localhost:3000/'
const url = 'https://bestgame.jelastic.metropolia.fi/'

$('button').on("click", (e) => {
    fetch(url + 'lobby/' + e.currentTarget.id + '/' + e.currentTarget.innerText)
    window.location.href = 'lobby/' + e.currentTarget.id + '/' + e.currentTarget.innerText
});

