
phina.define('TitleLogo', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        this.cnt = 0;
        this.cntMax = Random.randint(5, 10);

        this.body = PixelSprite('logo').addChildTo(this);
        this.body.scale.set(PIXEL_SCALE, PIXEL_SCALE);

        this.text = PixelSprite('text_minemine').addChildTo(this);
        this.text.position.set(
            this.body.width * PIXEL_SCALE / 2,
            this.body.height * PIXEL_SCALE / 2 + 1 * PIXEL_SCALE
            );
        this.text.origin.set(1, 0);
        this.text.scale.set(PIXEL_SCALE, PIXEL_SCALE);

        this.effect = GlitterEffectController().addChildTo(this);
        this.effect.scale.set(PIXEL_SCALE, PIXEL_SCALE);

    },

    'update': function() {
        if (!this.visible) return;
        if (++this.cnt >= this.cntMax) {
            this.cnt = 0;
            this.cntMax = Random.randint(5, 10);
            for(let i = 0; i < 2; ++i) {
                const x = Random.randint(-this.body.width / 2, this.body.width / 2);
                const y = Random.randint(-this.body.height / 2, this.body.height / 2);
                this.effect.Spawn(x, y, Random.randint(0, 2));
            }
        }

    }

})


phina.define('MenuButton', {
    'superClass': 'DisplayElement',
    'init': function(icon, text) {
        this.superInit();
        this.origin.set(0, 0.5);
        
        this.icon = PixelSprite('icons', 16, 16).addChildTo(this);
        this.icon.origin.set(0, 0.5);
        this.icon.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        
        this.iconDarker = PixelSprite(PixelSprite.MaskTexture('icons', '#888888'), 16, 16).addChildTo(this);
        this.iconDarker.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.iconDarker.blendMode = 'multiply';
        this.iconDarker.origin.set(0, 0.5);
        this.iconDarker.hide();
        
        this.label = CommonLabel({
            'text':text
        }).addChildTo(this);
        this.label.origin.set(0, 0.5);
        this.label.x = 16 * PIXEL_SCALE;
        
        this.labelDarker = CommonLabel({
            'fill':'#888888',
            'stroke':'#888888',
            'text':text
        }).addChildTo(this);
        this.labelDarker.origin.set(0, 0.5);
        this.labelDarker.x = 16 * PIXEL_SCALE;
        this.labelDarker.blendMode = 'multiply';
        this.labelDarker.hide();
        
        this.SetIcon(icon);
        
    },
    
    'SetIcon': function(icon) {
        this.icon.srcRect.set(icon.x, icon.y, 16, 16);
        this.iconDarker.srcRect.set(icon.x, icon.y, 16, 16);
    },
    
    'onpointstart': function(e) {
        if (!this.visible) return;
        
        this.labelDarker.show();
        this.iconDarker.show();
    },
    
    'onpointend': function(e) {
        if (!this.visible) return;
        
        this.labelDarker.hide();
        this.iconDarker.hide();
        if (this.hitTest(e.pointer.x, e.pointer.y)) {
            this.OnPushed();
        }
    },
    
    'OnPushed': function() {},
    
    '_static': {
        'Icon': {
            'Pickel':{'x':0, 'y':0},
            'Wakaba':{'x':16, 'y':0}
        }
    }
})

phina.define('TutorialWindow', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        this.pageNo = 0;
        
        this.frame = PixelSprite('button_frame96x126').addChildTo(this);
        this.frame.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        
        this.label = CommonLabel({
            'text':'',
            'fontSize':7 * PIXEL_SCALE
        }).addChildTo(this);
        this.label.position.set(
            0,
            (+126 / 2 - 32) * PIXEL_SCALE
        )
        
        this.image = PixelSprite('tutorial1').addChildTo(this);
        this.image.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.image.y = -24 * PIXEL_SCALE;

        this.nextButton = PixelSpriteButton('button_frame80x16', 'つぎへ').addChildTo(this);
        this.nextButton.position.set(
            0,
            (126 / 2 - 12) * PIXEL_SCALE
        )
        this.nextButton.onPushed = function() {
            if (this.IsLastPage(this.pageNo)) {
                this.Close();
            } else {
                this.NextPage();
                this.Quake();
            }
        }.bind(this);
        
        
        this.ApplyPage(0);
        
    },
    
    'Open': function() {
        if (this.visible) return;
        
        this.show();
        
        this.tweener.to({'x':CANVAS_WIDTH / 2}, 300, 'swing').play();
        this.x = -CANVAS_WIDTH / 2;
        
        this.pageNo = 0;
        this.ApplyPage(this.pageNo);
        
    },
    
    'ApplyPage': function(n) {
        let scenario = TutorialWindow.Scenario[n];
        this.label.text = scenario.text;
        this.image.image = scenario.image;
        
        if (this.IsLastPage(n)) {
            this.nextButton.label.text = 'とじる';
        } else {
            this.nextButton.label.text = 'つぎへ';
        }
    },
    
    'NextPage': function() {
        this.pageNo++;
        this.ApplyPage(this.pageNo);
    },
    
    'Close': function() {
        this.tweener.to({'x':-CANVAS_WIDTH / 2}, 300, 'swing')
            .set({'visible':false}).play();
    },
    
    'IsLastPage': function(n) {
        return n === TutorialWindow.Scenario.length - 1;
    },
    
    'Quake': function() {
        this.tweener.set({'y':this.y + (2 * PIXEL_SCALE)}).wait(50)
                .set({'y':this.y}).wait(50).play();
    },
    
    '_static': {
        'Scenario': [
            {
                'image': 'tutorial1',
                'text':'←↓↑→で、\n地面を掘る！',
            },
            {
                'image': 'tutorial2',
                'text':'鉱石をたくさん集めよう！',
            },
            {
                'image': 'tutorial3',
                'text':'制限時間40秒！\n時間になったら脱出だ！',
            },
            {
                'image': 'tutorial4',
                'text':'たくさん集めて、\nめざせ！ダイヤモンド級！',
            },
            
        ]
    }
})

phina.define('DeveloperWindow', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        this.favoNo = -1;
        
        this.background = RectangleShape({
            'fill':'#000',
            'width':CANVAS_WIDTH,
            'height': CANVAS_HEIGHT,
            'stroke':null,
            'strokeWidth':0,
            'padding':0
            
        }).addChildTo(this);
        this.background.alpha = 0.8;
        this.background.origin.set(0, 0);
        this.background.setInteractive(true);
        this.background.onpointend = function(e) {
            if (this.visible && !this.frame.hitTest(e.pointer.x, e.pointer.y)) {
                this.hide();
            }
            return false;
        }.bind(this);
        
        this.title = PixelSprite('text_credits').addChildTo(this);
        this.title.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.title.position.set(
            CANVAS_WIDTH / 2, 
            CANVAS_HEIGHT / 2 - 48 * PIXEL_SCALE
        );
        
        this.frame = PixelSprite('button_frame96x80').addChildTo(this);
        this.frame.scale.set(PIXEL_SCALE, PIXEL_SCALE);
         this.frame.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        
        //<開発>
        this.developerLabel = Label({
            'text':'【開発】',
            'fontFamily': 'PixelMplus',
            'fontSize': 6 * PIXEL_SCALE,
            'fill': '#444',
            'align':'left',
        }).addChildTo(this);
        this.developerLabel.position.set(
            CANVAS_WIDTH / 2 - 42 * PIXEL_SCALE, 
            CANVAS_HEIGHT / 2 - 30 * PIXEL_SCALE 
        );
        
        
        //アイコン
        this.mouseIcon = PixelSprite('mouse').addChildTo(this);
        this.mouseIcon.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.mouseIcon.position.set(
            CANVAS_WIDTH / 2 - 30 * PIXEL_SCALE, 
            CANVAS_HEIGHT / 2 - 12 * PIXEL_SCALE
        );
        
        //「あさづけ」
        this.nameLabel = Label({
            'text':'あさづけ',
            'fontFamily': 'PixelMplus',
            'fontSize': 6 * PIXEL_SCALE,
            'fill': '#444',
            'align':'left',
        }).addChildTo(this);
        this.nameLabel.position.set(
            CANVAS_WIDTH / 2 - 18 * PIXEL_SCALE, 
            CANVAS_HEIGHT / 2 - 20 * PIXEL_SCALE
        );
        
        //好きな＊＊＊
        this.favoLabel = Label({
            'text':'',
            'fontFamily': 'PixelMplus',
            'fontSize': 5.5 * PIXEL_SCALE,
            'fill': '#444',
            'align':'left',
        }).addChildTo(this);
        this.favoLabel.position.set(
            CANVAS_WIDTH / 2 - 18 * PIXEL_SCALE, 
            CANVAS_HEIGHT / 2 - 8 * PIXEL_SCALE
        );
        
        //「Twitterを見る！」
        this.twitterButton = PixelSpriteButton('twitter_frame64x16', 'Twitterを見る！').addChildTo(this);
        this.twitterButton.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10 * PIXEL_SCALE);
        this.twitterButton.label.fontSize = 6 * PIXEL_SCALE;
        this.twitterButton.onPushed = function() {
            if (!this.visible) return;
            location.href = "https://twitter.com/AsazukeMochi";
        }.bind(this);
        
        //ほかのゲーム
        this.gamesButton = PixelSpriteButton('button_frame80x16', 'ほかのゲームで遊ぶ！').addChildTo(this);
        this.gamesButton.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 28 * PIXEL_SCALE);
        this.gamesButton.label.fontSize = 6 * PIXEL_SCALE;
        this.gamesButton.onPushed = function() {
            if (!this.visible) return;
            location.href = "../portal";
        }.bind(this);
    },
    
    'RotFavorite': function() {
        let favos = DeveloperWindow.Favos;
        
        //連続で同じのが出ないようにする
        let no = Random.randint(0, favos.length - 1);
        while(this.favoNo == no) {
            no = Random.randint(0, favos.length - 1);
        }
        this.favoNo = no;
        
        let favo = favos[this.favoNo];
        
        this.favoLabel.text = favo;
        
    },
    
    '_static': {
        'Favos': [
            '好きな食べもの：\n梅干し',
            '好きな食べもの：\nダブルチーズバーガー',
            '好きな寿司ネタ:\n生しらす',
            '好きな飲みもの：\nコーラゼロ',
            '好きな飲みもの：\nブラックコーヒー',
            '好きな飲みもの：\n甘酒',
            '好きな季節：\n冬',
            '好きな歌：\nダイヤモンドハッピー',
            '好きな魔法カード：\n融合派兵',
            '好きなブキ：\nドライブワイパー',
            '好きなブキ：\nヴァリアブルローラー',
            '好きな文芸部員：\nSayori',
            '好きなシャウト：\n揺るぎ無き力',
        ]
    }
})

phina.define('RoomDecoration', {
    'superClass': 'DisplayElement',
    'init': function(spot) {
        this.superInit();

        this.items = [];
        this.index = 0;
        this.spot = spot;
        
        
        this.body = PixelSprite('deco_wall_clock').addChildTo(this);
        this.body.setInteractive(true);
        this.body.onpointend = function(e) {
            if (!this.visible) return;
            if (this.body.hitTest(e.pointer.x, e.pointer.y)) {
                this.Next();
            }
        }.bind(this);

        this.body.hide();
    },

    'SetItems': function(items) {
        this.items = items;
        if (this.index >= items.length) {
            this.index = 0;
            this.body.hide();
        } else {
            this.body.show();
        }
    },
    
    'Next': function() {
        if (this.items.length <= 1) return;
        
        this.index++;
        if (this.index >= this.items.length) {
            this.index = 0;
        }
        this.Change(this.index);
    },
    
    'Change': function(index) {
        
        this.index = index;
        if (this.index < 0) {
            this.index = 0;
        }
        if (this.index >= this.items.length) {
            this.index = this.items.length - 1;
        }
        
        let d = this.items[this.index];
        
        this.body.image = d.image;
        this.body.x = d.x;
        this.body.y = d.y;
        this.body.width = d.w;
        this.body.height = d.h;
        
        EventManager.Fire('OnDecorationChanged', this);
    },

    '_static' : {
        'Spot': { 'Wall':0, 'Table':1, 'Left':2, 'Right':3 },

        'items': [
            {'image':'deco_wall_clock', 'spot':0, 'x':0, 'y':0, 'w':13, 'h':13},
            {'image':'deco_right_bed', 'spot':3, 'x':-4, 'y':1, 'w':25, 'h':12},
            {'image':'deco_left_chest','spot':2, 'x':0, 'y':0, 'w':14, 'h':23},
            {'image':'deco_table_lunch', 'spot':1, 'x':0, 'y':5, 'w':13, 'h':5},
            {'image':'deco_wall_shelf', 'spot':0,'x':0, 'y':0, 'w':32, 'h':17},
            {'image':'deco_table_flower', 'spot':1, 'x':0, 'y':0, 'w':9, 'h':14},
            {'image':'deco_left_pot','spot':2, 'x':0, 'y':-3, 'w':12, 'h':29},
            {'image':'deco_right_ores', 'spot':3, 'x':0, 'y':0, 'w':18, 'h':14},
            {'image':'deco_table_pc', 'spot':1, 'x':0, 'y':4, 'w':14, 'h':7},
            {'image':'deco_wall_poster','spot':0, 'x':0, 'y':0, 'w':14, 'h':18},
        ],

        'GetItem': function(index) {
            return RoomDecoration.items[index];
        },

        'GetIndex': function(item) {
            const spot = item.spot;
            let index = 0;

            for (let i = 0; i < RoomDecoration.items.length; ++i) {
                let tmp = RoomDecoration.GetItem(i);
                if (item === tmp) {
                    break;
                }
                else if (tmp.spot === item.spot) {
                    index++;
                }
            }

            return index;
        }
    }
})

phina.define('TitlePlayer', {
    'superClass': 'PixelSprite',
    'init': function() {
        this.superInit('mog_sit', 64, 64);
        
        this.skillEffect = SkillEffect().addChildTo(this);
        this.skillEffect.position.set(-5, -14);
        
        this.animator = Animator().AttachTo(this);
        this.animator.Add('idle', 0, 0, 64, 64, 8, [0, 0, 1, 2, 2, 3], true);
        this.animator.Add('fine', 0, 0, 64, 64, 1, [0, 0], true);
        this.animator.Add('fall', 0, 0, 64, 64, 1, [0, 0], true);
        this.animator.Add('pick', 0, 0, 64, 64, 2, [0, 1, 2, 3, 4], false);
        this.animator.Add('coffee', 0, 0, 64, 64, 8, [0, 1], true);
        this.animator.Add('sit', 0, 0, 64, 64, 1, [0, 0], true);
        
        this.animator.Play('idle');
    },
    
    'ChangeAction': function(room_y) {
        switch(Random.randint(0, 2)) {
            //椅子に座る
            case 0:
                this.position.set(
                    PIXEL_CANVAS_WIDTH / 2 + 13,
                    room_y + 20
                );
                this.scale.x = -1;
                this.image = 'mog_sit';
                this.animator.Play('sit');
                break;
                
            //コーヒー飲む
            case 1:
                this.position.set(PIXEL_CANVAS_WIDTH / 2 + (Random.randbool() ? +7 : -20), room_y + 25);
                this.scale.x = Random.randbool() ? 1 : -1;
                this.image = 'mog_coffee';
                this.animator.Play('coffee');
                break;
                
            //アイドル状態
            case 2:
                this.position.set(PIXEL_CANVAS_WIDTH / 2 + (Random.randbool() ? +7 : -20), room_y + 25);
                this.scale.x = Random.randbool() ? 1 : -1;
                this.image = 'mog_idle';
                this.animator.Play('idle');
                break;
        }
    },
    
    'update': function() {
        this.animator.Update();
    }
})