const path = require('path');
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const app = express();
const server = http.createServer(app);
const moment = require('moment');
const io = socket(server);
const { addUsers, getUsers,RemoveUser } = require('./public/js/users');
app.use(express.static(path.join(__dirname, 'public')));
//runs whenever a user connects
io.on('connection', (skt) => {
    //on means recieving message 
    skt.on('JoinRoom', ({ Username, Room }) => {
        const user = addUsers(skt.id, Username, Room);
        //joining corresponding room
        skt.join(user.room);
          //brodcast means sending an event to everybody except who has joined
        skt.broadcast.to(user.room).emit('joins', `${Username} has joined the chat..`);
        //sending room users
        io.to(user.room).emit('room', {
            room: user.room,
            users: getUsers(user.room)
        });
        //sending welcome msg to every new user
        skt.emit('msg', {name:'ChatBot',msg:`Welcome to FanCord,${Username}`,time:moment().format('LT')});
    });
    //getting messages from client side
    skt.on('chat', data => {
        data.time = moment().format('LT');
        //sending messages to corresponding room users
        io.to(data.room).emit('msg', data);
    });
    //runs whenever a user leave the server
    skt.on('disconnect', () => {
        //Notify Users if somebody leaves
        var user = RemoveUser(skt.id);
        if (user)
            io.to(user.room).emit('notify', user);
        //listing users after a user leaves
        if (user) {
            io.to(user.room).emit('room', {
                room: user.room,
                users: getUsers(user.room)
            });
        }
    });
})
//starting the server
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));