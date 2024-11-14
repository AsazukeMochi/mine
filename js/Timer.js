const Timer = (function(){
    let dt = 0;
    
    return {
        'set': function(t) {
            dt = t / 1000;
        },
        
        'deltaTime': function() {
            return dt;
        }
    };
})();
