//URLパラメータを管理
const URLParam = (function(){
    
    const params = (function() {
        // "?id=123&value=999" => ["id=123", "value=999"]
        let split = location.search.slice(1).split('&');
        
        let tmp = {};
        for (let s of split) {
            //"id=123" => ["id", "123"];
            let ss = s.split('=');
            tmp[ss[0]] = ss[1];
        }
        return tmp;
    })();
    
    return {
        
        //まとめて取得
        'GetAll': function() {
            return params;
        },
        
        //keyのパラメータがあるか確認
        'Has': function(key) {
            return params[key] !== undefined;
        },
        
        //keyのパラメータを取得
        'Get': function(key) {
            return params[key];
        },
        
        //keyのパラメータをStringで取得 (Getと同じ)
        'GetString': function(key) {
            return this.Get(key);
        },
        
        //keyのパラメータをNumberで取得
        'GetNumber': function(key) {
            return Number(this.Get(key));
        }
    }
    
})();