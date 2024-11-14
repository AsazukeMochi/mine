function Animator() {
    
//    [
//        {
//            'name':'idle',
//            'x':0,
//            'y':0,
//            'width':16,
//            'height':32,
//            'cnt':4,
//            'indexes':[0, 1, 2],
//            'loop':true
//        },
//        
//    ]
    
    let animations = {};
    
    let target = null;
    
    let current = null;
    let index = 0;
    let count = 0;
    let play = false;
    
    return {
        
        //アニメーション追加
        //name:名前
        //x, y, width, height: 切り取る位置、サイズ
        //cnt: 更新フレーム数
        //indexes:配列で
        //loop:ループフラグ
        'Add': function(name, x, y, width, height, cnt, indexes, loop = true, next) {
            animations[name] = {
                'name': name,
                'x':x,
                'y':y,
                'width':width,
                'height':height,
                'indexes':indexes,
                'cnt':cnt,
                'loop':loop,
                'next':next
            };
            return this;
        },
        
        'Play': function(name) {
            current = animations[name];
            count = 0;
            index = 0;
            target.srcRect.set(current.x, current.y, current.width, current.height);
            target.width = current.width;
            target.height = current.height;
            play = true;
            return this;
        },
        
        'Stop': function() {
            play = false;
            return this;
        },
        
        'Update': function() {
            if (!play || !current || !target) return false;
            if (++count >= current.cnt) {
                count = 0;
                if (++index >= current.indexes.length) {
                    index = 0;
                }
                let frame = current.indexes[index];
                target.srcRect.set(current.width * frame + current.x, current.y, current.width, current.height)
                
                if (index + 1 === current.indexes.length) {
                    if (current.next) {
                        this.Play(current.next);
                    } else if (!current.loop) {
                        this.Stop();
                    }
                }
                
//                if (!current.loop && index + 1 === current.indexes.length) {
//                    this.Stop();
//                }
            }
        },
        
        'Release': function() {
            target = null;
            return this;
        },
        
        'AttachTo': function(t) {
            target = t;
            return this;
        }
        
    }
    
}