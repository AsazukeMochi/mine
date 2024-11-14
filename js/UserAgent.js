
//navigator.userAgentでユーザーの動作環境を確認するクラス
const UserAgent = (function(){
    
    return {
        
        //動作環境確認
        'Check': function() {
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                return this.iOS;
            } else if (navigator.userAgent.match(/Android/i)) {
                return this.Android;
            } else {
                return this.PC;
            }
        },
        
        //引数の動作環境かどうか判定
        'Is': function(ua) {
            return this.Check() === ua;
        },
        
        'PC':0,
        'Android':1,
        'iOS':2
    }
    
})();
