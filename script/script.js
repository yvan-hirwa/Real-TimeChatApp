const socket = io(); 

const form = document.getElementById('form');
const input = document.getElementById('input')
const messages = document.getElementById('messages');
const toggleBtn = document.getElementById('toggle-btn');

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(input.value){
        socket.emit('Chat Message', input.value)
        input.value = "";
    }
});

toggleBtn.addEventListener('click', ()=>{
    if (socket.connected) {
        socket.disconnect();
        toggleBtn.textContent = "Connect";
    }
    else{
        socket.connect();
        toggleBtn.textContent = "Disconnect";
    }
});

socket.on('Chat Message', (msg)=>{
    const item = document.createElement('li');
    item.textContent = msg;
    messages.insertAdjacentElement('beforeend', item);
    window.scrollTo(0, document.body.scrollHeight);
})