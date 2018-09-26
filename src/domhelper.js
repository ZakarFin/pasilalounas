
export function createListItem(value, insertBreaks) {
  var li = document.createElement("li");
  var t = document.createTextNode(value);
  li.appendChild(t);
  if(insertBreaks) {
      li.appendChild(document.createElement("br"));
      li.appendChild(document.createElement("br"));
  }
  return li;
}
export function createLinkItem(href, text) {
  var li = document.createElement("li");
  var link = document.createElement("a");
  link.setAttribute('href', href);
  link.setAttribute('target', '_blank');
  var t = document.createTextNode(text);
  link.appendChild(t);
  li.appendChild(link);
  return li;
}

export default function getPopupContent(restaurant, menuService, day) {
    var content = '<h4>' + restaurant.title + '</h4>';
    // currentDay == global from HTML
    day = day || currentDay;
    var menu = menuService.getMenu(restaurant.id, day);
    
    if (!menu) {
      content = content + createListItem('Listaa ei saatu ladattua.', true).innerHTML +
      createLinkItem(restaurant.url,'Katso ravintolan sivuilta >>').innerHTML;
      
    } else {
        var list = document.createElement("ul");
        // currentDay is inlined as global in HTML
        menu.forEach(function(menuItem) {
          if (menuItem && menuItem.trim()) {
            list.appendChild(createListItem(menuItem));
          }
        });
        content = content + list.innerHTML;
    }
    return content;
}