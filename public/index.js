var socket = io();
var main = document.getElementById('main');

socket.on('places', function(msg) {
    console.log('places', msg);
});
socket.on('menu', function(msg) {
    var container = document.getElementById('place_' + msg.id);
    var list = container.querySelector('.panel-body ul');
    list.removeChild(list.childNodes[0]);
    console.log('menu for ' + msg.name, msg);
    // currentDay is inlined as global in HTML
    msg.menu[currentDay].forEach(function(menuItem) {
        list.appendChild(createListItem(menuItem));
    });
});

function createListItem(value) {
    var li = document.createElement("li");
    var t = document.createTextNode(value);
    li.appendChild(t);
    return li;
}
