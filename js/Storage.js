//LocalStorage管理
const Storage = (function() {
    
    return {
        
        'Set' : function(key, value) {
            let v = (function() {
                //文字列に変換
                switch (typeof value) {
                    case 'string': return value;
                    case 'boolean':return value.toString();
                    case 'number': return value.toString();
                    case 'object': return JSON.stringify(value);
                    default: break;
                }
            })();
            
            localStorage.setItem(key, v);
        },
        
        'Get': function(key) {
            return localStorage.getItem(key);
        },
        
        'GetNumber': function(key) {
            return Number(this.Get(key));
        },
        
        'GetObject': function(key) {
            return JSON.parse(this.Get(key));
        },
        
        'GetString': function(key) {
            return this.Get(key);
        },
        
        'Has': function(key) {
            return localStorage.getItem(key) !== null;
        }
    }
        
})();