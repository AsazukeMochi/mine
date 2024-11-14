
//仮想キー
//リソースは、「通常」「押下」「無効化(グレースケールなど)」の順に横に並べてね
phina.define('VirtualKey', {
    'superClass': 'PixelSprite',
    'init': function(src, width, height) {
        this.superInit(src, width, height);
        this.pushFlag = false;
        this.enableFlag = false;
        this.attachKeys = [];
        
        if (UserAgent.Is(UserAgent.PC)) {
            this.keyboard = Keyboard(document);
            this.keyboard.on('keydown', function(e) {
                this.flare('keydown', {'keyCode':e.keyCode});
            }.bind(this));        
            this.keyboard.on('keyup', function(e) {
                this.flare('keyup', {'keyCode':e.keyCode});
            }.bind(this));        
            this.on('enterframe', function() {
                this.keyboard.update();
            })
        }
        
        this.Enable();
    },
    
    'update' : function(app) {
        if (this.pushFlag) {
            this.onPush();
        }
    },
    
    'onpointstart': function(e) {
        this.srcRect.x = this.width * 1;
        this.pushFlag = true;
        this.onPushStart();

        console.log(this.width, this.height);
    },
    
    'onpointend': function(e) {
        this.srcRect.x = this.width * 0;
        this.pushFlag = false;
        if (this.hitTest(e.pointer.x, e.pointer.y)) {
            this.onPushEnd();
        }
    },
    
    'onkeydown': function(e) {
        if (!this.enableFlag) return;
        if (this.pushFlag) return;
        
        for (const key of this.attachKeys) {
            if (e.keyCode === key) {
                this.srcRect.x = this.width * 1;
                this.pushFlag = true;
                this.onPushStart();
                this.onPush();
                break;
            }
        }
    },
    
    'onkeyup': function(e) {
        if (!this.enableFlag) return;
        if (!this.pushFlag) return;
        
        for (const key of this.attachKeys) {
            if (e.keyCode === key) {
                this.srcRect.x = this.width * 0;
                this.pushFlag = false;
                this.onPushEnd();
                break;
            }
        }
        
    },
    
    'Enable': function() {
        this.enableFlag = true;
        this.setInteractive(true);
        this.pushFlag = false;
        this.srcRect.x = this.width * 0;
    },
    
    'Disable': function() {
        this.enableFlag = false;
        this.setInteractive(false);
        this.pushFlag = false;
        this.srcRect.x = this.width * 2;
    },
    
    'IsEnable': function() {
        return this.enableFlag;
    },
    
    'AttachKeyboard': function(keyname) {
        let key = Keyboard.KEY_CODE[keyname];
        this.attachKeys.push(key);
    },
    
    'onPushStart': function(){}, //押したとき
    'onPush': function(){}, //押している間
    'onPushEnd': function(){} //押して離したとき
    
    
})