//create users
var users=[];
// add users to keep traclk of it
function addUsers(id,username,room) {
    var user = { id, username, room }
    users.push(user);
    return user;
}
//return list of users which belong to partivular room 
function getUsers(room) {
    return users.filter(user => user.room == room);
}
//remove user from users array if he/she leaves
function RemoveUser(id) {
    const user = users.findIndex(user => user.id == id);
    if (user != -1)
        return users.splice(user, 1)[0];
}

module.exports = {
    addUsers,
    getUsers,
    RemoveUser
}