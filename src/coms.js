import io from 'socket.io-client';

export default (service) => {

    const socket = io();
    socket.on('places', (msg) => {
        service.setPlaces(msg);
        // addPlaces(places);
    });
    
    socket.on('menu', (msg) => {
        service.addMenu(msg.id, msg.menu);
        if(service.hasMenusForAllPlaces()) {
            // got all the menus -> disconnect
            socket.close();
            console.log('Close socket');
        }
        /*
        if(!msg.menu || !msg.menu[currentDay]) {
            return;
        }
        var list = document.createElement("ul");
        // currentDay is inlined as global in HTML
        msg.menu[currentDay].forEach(function(menuItem) {
            if(menuItem && menuItem.trim()) {
                list.appendChild(createListItem(menuItem));
            }
        });
        menus[msg.id] = list;
        console.log('menu for ' + msg.name, msg);
        receivedMenu();
        */
    });
    
    setTimeout(() => {
        if(!service.hasMenusForAllPlaces()) {
            socket.close();
            console.log('Closing socket after a minute of waiting for menus. ' + counter + ' menus didnt load.');
        }
    }, 60000);
}
