phina.define('ResultController', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        this.scores = {
            'ironCnt': 0,
            'ironRate': 0,
            'ironScore': 0,
            'goldCnt': 0,
            'goldRate': 0,
            'goldScore': 0,
            'diamondCnt':0,
            'diamondRate':0,
            'diamondScore':0,
            'total':0,
        };
        
        this.phase = ResultController.Phases.Start;
        this.effects = [];
        this.quakeTweener = Tweener().attachTo(this);
        this.quakeTweener.wait(1).play();
        
        this.bg = RectangleShape({
            'width': CANVAS_WIDTH,
            'height': CANVAS_HEIGHT + (12 * PIXEL_SCALE),
            'stroke': null,
            'padding':0,
            'fill': '#000',
        }).addChildTo(this);
        this.bg.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        
        //鉄アイコン
        this.ironIcon = PixelSprite('ore_iron').addChildTo(this);
        this.ironIcon.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.ironIcon.position.set(
            CANVAS_WIDTH / 2 - (40 * PIXEL_SCALE),
            CANVAS_HEIGHT / 2 - (64 * PIXEL_SCALE),
        );
        
        //「1 x」
        this.ironRateLabel = CommonLabel({
            'text':this.scores.ironRate + ' ×',
            'fontSize':8 * PIXEL_SCALE
        }).addChildTo(this);
        this.ironRateLabel.position.set(
            this.ironIcon.x + (16 * PIXEL_SCALE),
            this.ironIcon.y
        );
        
        //鉄の獲得数
        this.ironCountLabel = CommonLabel({
            'text':'0',
            'fontSize':10 * PIXEL_SCALE
        }).addChildTo(this);
        this.ironCountLabel.position.set(
            this.ironRateLabel.x + (32 * PIXEL_SCALE),
            this.ironRateLabel.y
        );
        this.ironCountLabel.origin.set(1, 0.5);
        
        //「=」
        this.ironEqualLabel = CommonLabel({
            'text':'=',
            'fontSize':8 * PIXEL_SCALE
        }).addChildTo(this);
        this.ironEqualLabel.position.set(
            this.ironCountLabel.x + (8 * PIXEL_SCALE),
            this.ironCountLabel.y
        );
        
        //鉄の合計スコア
        this.ironScoreLabel = CommonLabel({
            'text':'0',
            'fontSize':10 * PIXEL_SCALE,
        }).addChildTo(this);
        this.ironScoreLabel.position.set(
            this.ironEqualLabel.x + (30 * PIXEL_SCALE),
            this.ironEqualLabel.y
        );
        this.ironScoreLabel.origin.set(1, 0.5);
        
        //金アイコン
        this.goldIcon = PixelSprite('ore_gold').addChildTo(this);
        this.goldIcon.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.goldIcon.position.set(
            this.ironIcon.x,
            this.ironIcon.y + (16 * PIXEL_SCALE)
        );
        
        //「5 x」
        this.goldRateLabel = CommonLabel({
            'text': this.scores.goldRate + ' ×',
            'fontSize':8 * PIXEL_SCALE
        }).addChildTo(this);
        this.goldRateLabel.position.set(
            this.goldIcon.x + (16 * PIXEL_SCALE),
            this.goldIcon.y
        );
        
        //金の獲得数
        this.goldCountLabel = CommonLabel({
            'text':'0',
            'fontSize':10 * PIXEL_SCALE
        }).addChildTo(this);
        this.goldCountLabel.position.set(
            this.goldRateLabel.x + (32 * PIXEL_SCALE),
            this.goldRateLabel.y
        );
        this.goldCountLabel.origin.set(1, 0.5);
        
        //「=」
        this.goldEqualLabel = CommonLabel({
            'text':'=',
            'fontSize':8 * PIXEL_SCALE
        }).addChildTo(this);
        this.goldEqualLabel.position.set(
            this.goldCountLabel.x + (8 * PIXEL_SCALE),
            this.goldCountLabel.y
        );
        
        //金の合計スコア
        this.goldScoreLabel = CommonLabel({
            'text':'0',
            'fontSize':10 * PIXEL_SCALE,
        }).addChildTo(this);
        this.goldScoreLabel.position.set(
            this.goldEqualLabel.x + (30 * PIXEL_SCALE),
            this.goldEqualLabel.y
        );
        this.goldScoreLabel.origin.set(1, 0.5);
        
        //ダイヤアイコン
        this.diamondIcon = PixelSprite('ore_diamond').addChildTo(this);
        this.diamondIcon.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.diamondIcon.position.set(
            this.goldIcon.x,
            this.goldIcon.y + (16 * PIXEL_SCALE)
        );
        
        //「5 x」
        this.diamondRateLabel = CommonLabel({
            'text': this.scores.goldRate + ' ×',
            'fontSize':8 * PIXEL_SCALE
        }).addChildTo(this);
        this.diamondRateLabel.position.set(
            this.diamondIcon.x + (16 * PIXEL_SCALE),
            this.diamondIcon.y
        );
        
        //金の獲得数
        this.diamondCountLabel = CommonLabel({
            'text':'0',
            'fontSize':10 * PIXEL_SCALE
        }).addChildTo(this);
        this.diamondCountLabel.position.set(
            this.diamondRateLabel.x + (32 * PIXEL_SCALE),
            this.diamondRateLabel.y
        );
        this.diamondCountLabel.origin.set(1, 0.5);
        
        //「=」
        this.diamondEqualLabel = CommonLabel({
            'text':'=',
            'fontSize':8 * PIXEL_SCALE
        }).addChildTo(this);
        this.diamondEqualLabel.position.set(
            this.diamondCountLabel.x + (8 * PIXEL_SCALE),
            this.diamondCountLabel.y
        );
        
        //金の合計スコア
        this.diamondScoreLabel = CommonLabel({
            'text':'0',
            'fontSize':10 * PIXEL_SCALE,
        }).addChildTo(this);
        this.diamondScoreLabel.position.set(
            this.diamondEqualLabel.x + (30 * PIXEL_SCALE),
            this.diamondEqualLabel.y
        );
        this.diamondScoreLabel.origin.set(1, 0.5);
        
        
        //「SCORE」
        this.totalNameLabel = PixelSprite('text_score').addChildTo(this);
        this.totalNameLabel.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.totalNameLabel.position.set(
            CANVAS_WIDTH / 2 - (4 * PIXEL_SCALE),
            this.goldIcon.y + (32 * PIXEL_SCALE)
        );
        
        this.highScoreText = PixelSprite('text_hiscore').addChildTo(this);
        this.highScoreText.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.highScoreText.position.set(this.totalNameLabel.x + 8 * PIXEL_SCALE, this.totalNameLabel.y + 10 * PIXEL_SCALE);
        this.highScoreText.hide();
        
        
        //合計スコア
        this.totalScoreLabel = CommonLabel({
            'text':'0',
            'fontSize':12 * PIXEL_SCALE
        }).addChildTo(this);
        this.totalScoreLabel.position.set(
            this.goldScoreLabel.x,
            this.totalNameLabel.y
        );
        this.totalScoreLabel.origin.set(1, 0.5);
        
        this.totalFlashLabel = FlashLabel({
            'text':'0',
            'fontSize':12 * PIXEL_SCALE,
        }).addChildTo(this.totalScoreLabel);
        this.totalFlashLabel.label.origin.set(1, 0.5);
        this.totalFlashLabel.hide();
        
        //「ランク」
        this.rankNameLabel = CommonLabel({
            'text':'ランク',
            'fontSize':8 * PIXEL_SCALE
        }).addChildTo(this);
        this.rankNameLabel.position.set(
            CANVAS_WIDTH / 2 - (32 * PIXEL_SCALE),
            this.totalNameLabel.y + (24 * PIXEL_SCALE)
        );
        
        //ランク名
        this.rankValueLabel = CommonLabel({
            'text':'モグラ級',
            'fontSize':12 * PIXEL_SCALE
        }).addChildTo(this);
        this.rankValueLabel.position.set(
            CANVAS_WIDTH / 2,
            this.rankNameLabel.y + (16 * PIXEL_SCALE)
        );
        
        //twitterシェアボタン
        this.twitterButton = PixelSpriteButton('twitter_frame64x16', 'Twitterでシェア！').addChildTo(this);
        this.twitterButton.position.set(
            CANVAS_WIDTH / 2,
            this.rankValueLabel.y + (32 * PIXEL_SCALE)
        );
        this.twitterButton.label.fontSize = 8 * PIXEL_SCALE;
        this.twitterButton.onPushed = function() {
            const score = this.scores.total;
            const rank = ResultController.GetRank(score).name;
            Twitter.Share("スコア:" + score + " ランク「" + rank + "」を獲得！\n地面を掘って鉱石をたくさん集めよう！Twitter上で手軽に遊べるミニゲーム！");
            GA.SendEvent('share');
        }.bind(this);
        this.twitterButton.setInteractive(false);

        //リザルト閉じるボタン
        this.exitButton = PixelSpriteButton('button_frame32x16', 'OK').addChildTo(this);
        this.exitButton.position.set(
            CANVAS_WIDTH - (32 / 2 * PIXEL_SCALE),
            CANVAS_HEIGHT - (16 / 2 * PIXEL_SCALE)
        )
        this.exitButton.onPushed = function() {
            this.NextPhase();
        }.bind(this);
        
        for (let i = 0; i < ResultController.FlashMax; ++i) {
            let flash = FlashEffect().addChildTo(this);
            flash.scale.set(PIXEL_SCALE, PIXEL_SCALE);
            flash.hide();
            this.effects.push(flash);
        }
        
        this.Reset();
    },
    
    'update': function(app) {

        if (ResultController.Phases.Iron <= this.phase && this.phase <= ResultController.Phases.Total) {
            if (app.pointer.getPointingStart() || this.AnyKey(app.keyboard)) {
                this.NextPhase();
                return;
            }
        }
        
        switch (this.phase) {
            case ResultController.Phases.Iron: {
                let score = Number(this.ironScoreLabel.text);
                score += 4;
                this.ironScoreLabel.text = score.toString();
                if (score >= this.scores.ironScore) {
                    this.NextPhase();
                }
                break;
            }
            case ResultController.Phases.Gold: {
                let score = Number(this.goldScoreLabel.text);
                score += 1;
                this.goldScoreLabel.text = score.toString();
                if (score >= this.scores.goldScore) {
                    this.NextPhase();
                }
                
                break;
            }
            case ResultController.Phases.Diamond: {
                let score = Number(this.diamondScoreLabel.text);
                score += 1;
                this.diamondScoreLabel.text = score.toString();
                if (score >= this.scores.diamondScore) {
                    this.NextPhase();
                }
                
                break;
            }
            case ResultController.Phases.Total: {
                let cnt = Number(this.totalScoreLabel.text);
                cnt += 6;
                this.totalScoreLabel.text = cnt.toString();
                if (cnt >= this.scores.total) {
                    this.NextPhase();
                }
                
            }
                break;
        }
        
        
        
    },
    
    'NextPhase': function() {
        
        this.phase++;
        
        switch(this.phase) {
            case ResultController.Phases.Iron:
                
                this.ironIcon.show();
                this.ironRateLabel.show();
                this.ironRateLabel.text = this.scores.ironRate + ' x';
                this.ironCountLabel.show();
                this.ironCountLabel.text = this.scores.ironCnt;
                this.ironEqualLabel.show();
                this.ironScoreLabel.show();
                this.ironScoreLabel.text = '0';
                
                break;
                
            case ResultController.Phases.Gold:
                
                this.Quake();
                
                this.ironScoreLabel.text = this.scores.ironScore.toString();
                
                this.SpawnEffect(
                    this.ironScoreLabel.x - (24* PIXEL_SCALE),
                    this.ironScoreLabel.y + (4 * PIXEL_SCALE)
                )
                
                this.SpawnEffectDelay(
                    this.ironScoreLabel.x,
                    this.ironScoreLabel.y - (4 * PIXEL_SCALE),
                    100
                )
                
                this.goldIcon.show();
                this.goldRateLabel.show();
                this.goldRateLabel.text = this.scores.goldRate + ' x';
                this.goldCountLabel.show();
                this.goldCountLabel.text = this.scores.goldCnt;
                this.goldEqualLabel.show();
                this.goldScoreLabel.show();
                this.goldScoreLabel.text = '0';
                                
                break;
                
            case ResultController.Phases.Diamond:
                
                
                this.Quake();
                
                this.goldScoreLabel.text = this.scores.goldScore.toString();
                
                this.SpawnEffect(
                    this.goldScoreLabel.x - (24 * PIXEL_SCALE),
                    this.goldScoreLabel.y + (4 * PIXEL_SCALE)
                )
                
                this.SpawnEffectDelay(
                    this.goldScoreLabel.x,
                    this.goldScoreLabel.y - (4 * PIXEL_SCALE),
                    100
                )
                
                //ダイヤモンド獲得してないときは表示しない
                if (this.scores.diamondCnt === 0) {
                    this.NextPhase();
                    break;
                }
                
                this.diamondIcon.show();
                this.diamondRateLabel.show();
                this.diamondRateLabel.text = this.scores.diamondRate + ' x';
                this.diamondCountLabel.show();
                this.diamondCountLabel.text = this.scores.diamondCnt;
                this.diamondEqualLabel.show();
                this.diamondScoreLabel.show();
                this.diamondScoreLabel.text = '0';
                                
                break;
                
            case ResultController.Phases.Total:
                
                if (this.scores.diamondCnt >= 0) {
                    this.Quake();

                    this.diamondScoreLabel.text = this.scores.diamondScore.toString();

                    this.SpawnEffect(
                        this.diamondScoreLabel.x - (24 * PIXEL_SCALE),
                        this.diamondScoreLabel.y + (4 * PIXEL_SCALE)
                    )

                    this.SpawnEffectDelay(
                        this.diamondScoreLabel.x,
                        this.diamondScoreLabel.y - (4 * PIXEL_SCALE),
                        100
                    )
                    
                }
                
                this.totalNameLabel.show();
                this.totalScoreLabel.text = '0';
                this.totalScoreLabel.show();
                
                break;
                
            case ResultController.Phases.Rank:
                
                this.Quake();
                
                this.totalScoreLabel.text = this.scores.total.toString();
                this.totalFlashLabel.show();
                
                if (this.scores['highScore']) {
                    if (this.scores.total > this.scores['highScore']) {
                        this.highScoreText.show();
                    }
                }
                
                this.SpawnEffect(
                    this.totalScoreLabel.x - (24 * PIXEL_SCALE),
                    this.totalScoreLabel.y + (6 * PIXEL_SCALE)
                )
                
                this.SpawnEffectDelay(
                    this.totalScoreLabel.x,
                    this.totalScoreLabel.y - (6 * PIXEL_SCALE),
                    100
                )
                
                let rank = ResultController.GetRank(this.scores.total);
                this.rankValueLabel.text = rank.name;
                this.rankValueLabel.fill = rank.fontColor;
                
                this.rankNameLabel.tweener.wait(900).set({'visible': true}).play();
                this.rankValueLabel.tweener.wait(2300).set({'visible': true}).play();
                this.tweener.wait(3300).call(function(){
                    this.NextPhase();
                }.bind(this)).play();
                
                break;
                
            case ResultController.Phases.Free:
                
                this.tweener.call(function(){
                    this.twitterButton.show();
                    this.twitterButton.setInteractive(true);
                }.bind(this)).wait(300).call(function(){
                    this.exitButton.show();
                    this.exitButton.setInteractive(true);
                }.bind(this))
                
                break;
                
            case ResultController.Phases.End:
                
                this.ironIcon.hide();
                this.ironRateLabel.hide();
                this.ironCountLabel.hide();
                this.ironEqualLabel.hide();
                this.ironScoreLabel.hide();
                
                this.goldIcon.hide();
                this.goldRateLabel.hide();
                this.goldCountLabel.hide();
                this.goldEqualLabel.hide();
                this.goldScoreLabel.hide();
                
                this.diamondIcon.hide();
                this.diamondRateLabel.hide();
                this.diamondCountLabel.hide();
                this.diamondEqualLabel.hide();
                this.diamondScoreLabel.hide();
                
                this.totalNameLabel.hide();
                this.totalScoreLabel.hide();
                this.totalFlashLabel.hide();
                this.highScoreText.hide();
                
                this.rankNameLabel.hide();
                this.rankValueLabel.hide();
                
                this.twitterButton.hide();
                this.twitterButton.setInteractive(false);
                
                this.exitButton.hide();
                this.exitButton.setInteractive(false);
                
                this.bg.tweener.clear().to({'alpha':0}, 200).set({'visible':false}).play();
                
                this.tweener.wait(600).call(function(){
                    EventManager.Fire('OnResultClosed');
                }).play();
                
                break;
        }
        
    },
    
    'Reset': function() {
        this.phase = ResultController.Phases.Start;
        
        this.bg.hide();
        
        this.ironIcon.hide();
        this.ironRateLabel.hide();
        this.ironCountLabel.hide();
        this.ironEqualLabel.hide();
        this.ironScoreLabel.hide();
        
        this.goldIcon.hide();
        this.goldRateLabel.hide();
        this.goldCountLabel.hide();
        this.goldEqualLabel.hide();
        this.goldScoreLabel.hide();
        
        this.diamondIcon.hide();
        this.diamondRateLabel.hide();
        this.diamondCountLabel.hide();
        this.diamondEqualLabel.hide();
        this.diamondScoreLabel.hide();
        
        this.totalNameLabel.hide();
        this.totalScoreLabel.hide();
        this.totalFlashLabel.hide();

        this.highScoreText.hide();
        
        this.rankNameLabel.hide();
        this.rankValueLabel.hide();
        
        this.twitterButton.hide();
        
        this.exitButton.setInteractive(false);
        this.exitButton.hide();
    },
    
    'Start': function(params) {
        
        this.scores = params;
        
        this.bg.show();
        this.bg.alpha = 0;
        this.bg.tweener.clear().to({'alpha':0.8}, 200).play();
        
        this.tweener.wait(400).call(function(){
            this.NextPhase();
        }.bind(this)).play();
        
    },
    
    'SpawnEffect': function(x, y) {
        for (let i = 0; i < ResultController.FlashMax; ++i) {
            if (this.effects[i].visible) continue;
            
            let flash = this.effects[i];
            flash.Spawn();
            flash.position.set(x, y);
            break;
        }
        
    },
    
    'SpawnEffectDelay': function(x, y, delay) {
        this.tweener.wait(delay).call(function(){
            this.SpawnEffect(x, y);
        }.bind(this)).play();
    },
    
    'Quake': function() {
        if (this.quakeTweener.playing) return;
        
        let dy = 2 * PIXEL_SCALE;
        let ms = 1;
        
        this.quakeTweener.set({'y':this.y + dy}).wait(ms)
            .set({'y':this.y}).wait(ms)
            .set({'y':this.y + dy}).wait(ms)
            .set({'y':this.y}).wait(ms).play();
        
    },

    'AnyKey': function(keyboard) {

        const keys = [
            'left', 'right', 'up', 'down', 
            'a', 'w', 's', 'd', 'space'
        ];

        for (let i = 0; i < keys.length; ++i) {
            if (keyboard.getKeyDown(keys[i])) {
                return true;
            }
        }

        return false;
    },
    
    '_static': {
        'Phases': {
            'Start':0,
            'Iron':1,
            'Gold':2,
            'Diamond':3,
            'Total':4,
            'Rank':5,
            'Free':6,
            'End':7,
        },
        
        'FlashMax':6,
        
        //スコアに応じたランクを取得
        'GetRank':function(score) {
            if (score < 0) return  ResultController.Ranks[0];
            
            for (let i = 0; i < ResultController.Ranks.length; ++i) {
                const rank =  ResultController.Ranks[i];
                if (score < rank.score) {
                    return ResultController.Ranks[i - 1];
                }
            }
            
            return ResultController.Ranks[ResultController.Ranks.length - 1];
        },
        
        'Ranks': [
            {'score':0, 'name':'ネオチ', 'fontColor':'#fff'},
            {'score':1, 'name':'ブロンズ級', 'fontColor':'#c46200'},
            {'score':100, 'name':'シルバー級', 'fontColor':'#e5e5e5'},
            {'score':200, 'name':'ゴールド級', 'fontColor':'#ffce4b'},
            {'score':300, 'name':'ダイヤモンド級', 'fontColor':'#31ffef'},
            {'score':350, 'name':'大地の神', 'fontColor':'#fd1616'},
        ]
    }
})

phina.define('FlashEffect', {
    'superClass': 'PixelSprite',
    'init': function() {
        this.superInit('flash', 32, 32);
        this.animNo = 2;
        this.animCnt = 0;
    },
    
    'update': function() {
        if (!this.visible) return;
        
        if (++this.animCnt >= 2) {
            this.animCnt = 0;
            if (++this.animNo >= 7) {
                this.hide();
                return;
            }
            this.srcRect.set(this.animNo * 32, 0, 32, 32);
        }
    },
    
    'Spawn': function() {
        this.animCnt = 0;
        this.animNo = 2;
        this.show();
        this.srcRect.set(0, 0, 32, 32);
    }
    
})

phina.define('FlashLabel', {
    'superClass': 'DisplayElement',
    'init': function(params) {
        this.superInit();
        params = params || {};
        
        params.$safe({
            'fill':'#333',
            'stroke':'#333'
        });
        
        this.label = CommonLabel(params).addChildTo(this);
        this.label.blendMode = 'lighter';
    },
    
    'update': function() {
        this.label.text = this.getParent().text;
        this.label.setVisible(!this.label.visible);
    }
})
