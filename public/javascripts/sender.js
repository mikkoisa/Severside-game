const editBtn = document.querySelector('#sender');
editBtn.addEventListener('click', (evt) => {
    const namer = document.getElementById('namer').value;
    const ager = document.getElementById('ager').value;

    const myInit = { 'method': 'PUT' };    
    const editRequest = new Request('http://localhost:3000/users/' + namer + '/' + ager, myInit);
    fetch(editRequest);
});

const deleteBtn = document.querySelector('#deleter');
deleteBtn.addEventListener('click', (evt) => {
    const myInit = { 'method': 'DELETE' };    
    const deleteRequest = new Request('http://localhost:3000/users/', myInit);
    fetch(deleteRequest).then(response => response.json()).
    then(json => {
        document.querySelector('#list').innerHTML = JSON.stringify(json);
    })   
});

const listBtn = document.querySelector('#lister');
listBtn.addEventListener('click', (evt) => {
    const myInit = { 'method': 'GET' };    
    const listRequest = new Request('http://localhost:3000/users', myInit);
    fetch(listRequest).then(response => response.json()).
    then(json => {
        document.querySelector('#list').innerHTML = JSON.stringify(json);
    })   
});

