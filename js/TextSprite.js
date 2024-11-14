
//charが数字かどうか判定する
function IsNumber(char) {
    let c = char.charCodeAt(0);
    return '0'.charCodeAt(0) <= c && c <= '9'.charCodeAt(0);
}

//charがアルファベットかどうか判定する
function IsAlphabet(char) {
    let c = char.charCodeAt(0);
    return 'A'.charCodeAt(0) <= c && c <= 'Z'.charCodeAt(0);
}


function GetCharIndex(char) {
    if (IsNumber(char)) {
        return char.charCodeAt(0) - '0'.charCodeAt(0);
    } else if (IsAlphabet(char)) {
        return char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    } else {
        
    }
    return - 1;
}



phina.define('TextSprite', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        function GetCharWidth(char) {
            
            let data = [
                7,4,8,7,7,7,7,7,8,7, //0123456789
                8,8,8,8,7,7,8, //ABCDEFG
                8,4,8,8,7, 10,8, //HIJKLMN
                8,8,8,8,8,7,8, //OPQRSTU
                8,9,9,8,8, //VWXYZ
                4 //!
            ]
            
            let index = GetCharIndex(char);
            let x = (function(l){
                
                let w = 0;
                
                for (let i = 0; i < l; ++i) {
                    w += data[i];
                }
                return w;
                
            })(index);
            
            return {'x':x, 'width': data[index]};
            
        }
        
        let text = '065';
        text = text.toUpperCase();
        let xx = 0;
        
        for (let i = 0; i < text.length; ++i) {
            let sprite = PixelSprite('text').addChildTo(this);
            let da = GetCharWidth(text[i]);
            sprite.origin.set(0, 0);
            sprite.srcRect.set(da.x, 0, da.width, 10);
            sprite.width = da.width;
            sprite.height = 10;
            sprite.position.set(xx, 0);
            xx += da.width - 1;
        }
        
    },
    
})