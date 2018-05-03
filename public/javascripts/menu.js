const url = 'https://localhost:3000/'

const game1 = document.getElementById('game1');
game1.addEventListener('click', evt => {
    fetch(url + 'lobby/' + game1.innerText)
    window.location.href = 'lobby/' + game1.innerText 
});
