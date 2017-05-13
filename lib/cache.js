
var store = {};
// 30mins
var defaultExpiry = 30*60*1000;
function checkExpiry(key) {
    var item = store[key];
    if(!item) {
        return true;
    }
    var expired = item.ts < new Date().getTime() - item.expiry;
    if(expired) {
        store[key] = undefined;
        delete store[key];
        return true;
    }
    return false;
}


module.exports = {
    get : function(key) {
        checkExpiry(key);
        var item = store[key];
        if(!item) {
            return undefined;
        }
        return item.value;
    },
    set: function(key, value, time) {
        store[key] = {
            ts : new Date().getTime(),
            expiry : time || defaultExpiry,
            value : value
        };
    }
};
