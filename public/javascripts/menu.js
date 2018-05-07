const url = 'https://localhost:3000/'

$('button').on("click", (e) => {
    fetch(url + 'lobby/' + e.currentTarget.innerHTML)
    window.location.href = 'lobby/' + e.currentTarget.innerHTML
});


