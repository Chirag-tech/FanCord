//for sending message
const send = document.querySelector('#send');
//for showing message in chatbox
const chatbox = document.querySelector('.chat-box');
//for setting room name
const roomName = document.querySelector('.room-name');
//for listing users who are online
const Users = document.querySelector('.users');
//getting query from form 
const { Username, Room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
const socket = io();
// users to join their corresponding room
socket.emit('JoinRoom', {Username,Room});
//sending message
send.addEventListener('submit', (e) => {
    e.preventDefault();
    var message = {
        msg: e.target.elements.msg.value,
        name: Username,
        room: Room
    }
    //sending message to server side
    socket.emit('chat', message);
    //setting value to empty in send message form
    e.target.elements.msg.value = "";
});
// recieving message from server side
socket.on('msg', (data) => {
    sendMessage(data);
    chatbox.scrollTop = chatbox.scrollHeight;
});
socket.on('notify', (data) => {
    //notifying messages whenever users leaves
    const div = document.createElement('div');
    div.classList.add('notify');
    div.innerHTML = `<p>${data.username} has left the chat..</p>`
    chatbox.appendChild(div);
});
// notify users whenever a new users join
socket.on('joins', (data) => {
    const div = document.createElement('div');
    div.classList.add('notify');
    div.innerHTML = `<p>${data}</p>`
    chatbox.appendChild(div);
});
//for listing users
socket.on('room', data => {
    roomName.innerHTML = data.room;
    Users.innerHTML = "";
    data.users.map(user => listUsers(user.username));
});
// function To send messages 
function sendMessage(data) {
    const div = document.createElement('div');
    if (data.name != Username) {
        div.classList.add('chats');
        div.innerHTML = ` <p class="name">${data.name}<span>${data.time}</span></p>
        <h6>${data.msg}</h6>`
    } else {
        div.classList.add('altchats');
        div.innerHTML = ` <p class="name">You<span>${data.time}</span></p>
        <h6>${data.msg}</h6>`;
    }
    chatbox.appendChild(div);
}
//function to list users
function listUsers(user) {
    const li = document.createElement('li');
    li.innerHTML = user;
    Users.appendChild(li);
}