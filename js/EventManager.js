const EventManager = (function() {
    
    let listeners = {};
    
    return {
        
        'AddEventListener': function(name, object) {
            if (!listeners[name]) {
                listeners[name] = [];
            }
            
            listeners[name].push(object);
        },
        
        'Fire': function(name, params) {
            if (!listeners[name]) return;
            for (let l of listeners[name]) {
                if (!l[name]) continue;
                l[name](params);
            }
        }
        
    };
    
})();