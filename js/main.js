phina.globalize();

//ピクセル倍率
const PIXEL_SCALE = 4 * window.devicePixelRatio;

//アスペクト比
const ASPECT_RATIO = 16 / 9;

//ピクセル解像度
const PIXEL_CANVAS_WIDTH = 128;
const PIXEL_CANVAS_HEIGHT = Math.floor(128 * ASPECT_RATIO);

//実際の解像度
const CANVAS_WIDTH = PIXEL_CANVAS_WIDTH * PIXEL_SCALE;
const CANVAS_HEIGHT = Math.floor(PIXEL_CANVAS_HEIGHT * PIXEL_SCALE);

const ASSETS = {
    'image': {
        'logo': 'assets/images/logo.png',
        'land': 'assets/images/land.png',
        'bg_chip': 'assets/images/bg_chip.png',
        'bg_deep_chip': 'assets/images/bg_deep_chip.png',
        'room_back': 'assets/images/room_back.png',
        'room_front': 'assets/images/room_front.png',
        'soil_chip': 'assets/images/soil_chip.png',
        'soil_deep_chip': 'assets/images/soil_deep_chip.png',
        'iron': 'assets/images/iron_test.png',
        'gold': 'assets/images/ore_test.png',
        'diamond': 'assets/images/diamond_test.png',
        'piece': 'assets/images/piece.png',
        'piece_deep': 'assets/images/piece_deep.png',
        'ore_gold': 'assets/images/ore_gold12x12.png',
        'ore_iron': 'assets/images/ore_iron12x12.png',
        'ore_diamond': 'assets/images/diamond.png',
        'icons':'assets/images/icons.png',
        'twitter_frame64x16':'assets/images/twitter_frame64x16.png',
        'button_frame32x16':'assets/images/button_frame32x16.png',
        'button_frame80x16':'assets/images/button_frame80x16.png',
        'button_frame96x126':'assets/images/button_frame96x126.png',
        'button_frame96x80':'assets/images/button_frame96x80.png',
        'button_credit': 'assets/images/button_credit.png',
        'clock': 'assets/images/clock.png',
        'vkey': 'assets/images/vkey.png',
        'dugground': 'assets/images/dugground.png',
        'flash': 'assets/images/flash.png',
        'mog_idle': 'assets/images/mog_idle64.png',
        'mog_pick':'assets/images/mog_pick.png',
        'mog_pick_under': 'assets/images/mog_pick_under.png',
        'mog_pick_over': 'assets/images/mog_pick_over.png',
        'mog_prejet': 'assets/images/mog_prejet.png',
        'mog_jet': 'assets/images/mog_jet.png',
        'mog_predrill': 'assets/images/mog_predrill.png',
        'mog_drill': 'assets/images/mog_drill.png',
        'mog_fall': 'assets/images/mog_fall.png',
        'mog_fine': 'assets/images/mog_fine.png',
        'mog_fine_no_pickel': 'assets/images/mog_fine_no_pickel.png',
        'mog_coffee': 'assets/images/mog_coffee.png',
        'mog_sit': 'assets/images/mog_sit.png',
        'effect_ore': 'assets/images/effect_ore.png',
        'effect_glitter': 'assets/images/effect_glitter.png',
        'effect_skill': 'assets/images/effect_skill.png',
        'text_ready': 'assets/images/text_ready.png',
        'text_go': 'assets/images/text_go.png',
        'text_thankyou': 'assets/images/text_thankyou.png',
        'text_fullcharge': 'assets/images/text_fullcharge.png',
        'text_hiscore': 'assets/images/text_hiscore.png',
        'text_credits': 'assets/images/text_credits.png',
        'text_timeup': 'assets/images/text_timeup.png',
        'text_score': 'assets/images/text_score.png',
        'text_deco_get': 'assets/images/text_deco_get.png',
        'text_minemine': 'assets/images/text_minemine.png',
        'mountains': 'assets/images/mountains.png',
        'smoke': 'assets/images/smoke.png',
        'mouse': 'assets/images/mouse.png',
        'crown': 'assets/images/crown.png',

        'tutorial1': 'assets/images/tutorial1.png',
        'tutorial2': 'assets/images/tutorial2.png',
        'tutorial3': 'assets/images/tutorial3.png',
        'tutorial4': 'assets/images/tutorial4.png',
        
        'deco_wall_clock': 'assets/images/deco_wall_clock.png',
        'deco_wall_poster': 'assets/images/deco_wall_poster.png',
        'deco_wall_shelf': 'assets/images/deco_wall_shelf.png',
        
        'deco_table_flower': 'assets/images/deco_table_flower.png',
        'deco_table_pc': 'assets/images/deco_table_pc.png',
        'deco_table_lunch': 'assets/images/deco_table_lunch.png',
        
        'deco_left_pot': 'assets/images/deco_left_pot.png',
        'deco_left_chest': 'assets/images/deco_left_chest.png',
        
        'deco_right_bed': 'assets/images/deco_right_bed.png',
        'deco_right_ores': 'assets/images/deco_right_ores.png',
    },
    
    'font': {
        'PixelMplus': 'assets/fonts/PixelMplus12-Regular.ttf',
    }
    
}

const Colors = {
    'Bg':'#87ceeb',
    'Ground': '#132b50'
}

const GameState = {
    'Title':0,
    'ReadyWait':1,
    'Ready': 2,
    'Game': 3,
    'EscapeGame': 4,
    'ResultWait': 5,
    'Result':6,
    'Thankyou':7,
}

//地表
phina.define('GroundSurface', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        let l = PIXEL_CANVAS_WIDTH / 16;
        for (let i = 0; i < l; ++i) {
            let sprite = PixelSprite('land').addChildTo(this);
            sprite.origin.set(0, 0);
            sprite.position.set(16 * i, 0);
        }
    }
})

phina.define('PixelFieldElement', {
    'superClass': 'DisplayElement',
    'init': function(params) {
        this.superInit(params);
        
        this.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        
        this.by = 0;
        this.quakeOffset = 0;
        
        this.quakeTweener = Tweener().attachTo(this);
        this.quakeTweener.clear().wait(1).play();
    },
    
    'update': function() {
        this.y = Math.floor(this.by + this.quakeOffset);
    },
    
    'quake': function() {
        if (this.quakeTweener.playing) return;
        let q = 3 * PIXEL_SCALE;
        this.quakeTweener.set({'quakeOffset':q})
            .wait(1).set({'quakeOffset':-q})
            .wait(1).set({'quakeOffset':+q})
            .wait(1).set({'quakeOffset':-q})
            .wait(1).set({'quakeOffset':0})
            .play();
    }
})

phina.define('MainScene', {
    'superClass': 'DisplayScene',
    'init': function(params) {
        this.superInit(params);

        this.backgroundColor = Colors.Bg;
        this.gameState = GameState.Title;
        
        //現在のエネルギー
        this.energy = 0;
        
        //種類ごとのスコア
        this.ironCnt = 0;
        this.goldCnt = 0;
        this.diamondCnt = 0;
        
        //SKILLボタン光る用のカウント
        this.skillFlashCnt = 0;
        this.skillFlashMax = 30;
        
        //金、ダイヤモンドのマス光らせる用のカウント
        this.glitterCnt = 0;
        this.glitterMax = 16;
        
        this.pixelField = PixelFieldElement().addChildTo(this);
        this.pixelField.by = - CANVAS_HEIGHT - (128 - 32) * PIXEL_SCALE;
        
        //背景の山
        this.mountain = PixelSprite('mountains').addChildTo(this.pixelField);
        this.mountain.origin.set(0, 0);
        this.mountain.position.set(0, PIXEL_CANVAS_HEIGHT - this.mountain.height - 16 * 2);
        this.mountain.hide();

        //地面
        this.groundController = GroundController().addChildTo(this.pixelField);
        this.groundController.position.set(0, PIXEL_CANVAS_HEIGHT + 512 - 16);
        
        //煙エフェクト管理
        this.smokeEffectController = SmokeEffectController().addChildTo(this.pixelField);
        
        //プレイヤー
        this.player = Player().addChildTo(this.pixelField);
        this.player.cell.set(1, 1);
        this.player.ApplyPosition();
        
        this.room = PixelSprite('room_back').addChildTo(this.pixelField);
        this.room.origin.set(0, 0.5);
        this.room.y = PIXEL_CANVAS_HEIGHT - 16 + (512 / 2) - 16;
        
        for (let i = 0; i < GroundController.Row; ++i) {
            let chip = PixelSprite('bg_chip', 16, 16).addChildTo(this.pixelField);
            chip.position.set(16 * i, this.groundController.y - 16);
            chip.srcRect.set(0, 0, 16, 16);
            chip.origin.set(0, 0);
        }
        
        
        this.deco1 = RoomDecoration(RoomDecoration.Spot.Wall).addChildTo(this.pixelField);
        this.deco1.position.set(
            PIXEL_CANVAS_WIDTH / 2 + 6,
            this.room.y - 8
        );

        this.deco2 = RoomDecoration(RoomDecoration.Spot.Table).addChildTo(this.pixelField);
        this.deco2.position.set(
            PIXEL_CANVAS_WIDTH / 2 - 5,
            this.room.y + 15
        );
        
        this.deco3 = RoomDecoration(RoomDecoration.Spot.Left).addChildTo(this.pixelField);
        this.deco3.position.set(
            PIXEL_CANVAS_WIDTH / 2 - 40,
            this.room.y + 20
        );
        
        this.deco4 = RoomDecoration(RoomDecoration.Spot.Right).addChildTo(this.pixelField);
        this.deco4.position.set(
            PIXEL_CANVAS_WIDTH / 2 + 39,
            this.room.y + 26
        );

        this.ApplyDecorations();
        
        //タイトル画面用のプレイヤー
        this.titlePlayer = TitlePlayer().addChildTo(this.pixelField);
        this.titlePlayer.ChangeAction(this.room.y);
        
        //盛り土ベース
        this.dugSoilLayer = DisplayElement().addChildTo(this.pixelField);
        
        this.roomFront = PixelSprite('room_front').addChildTo(this.pixelField);
        this.roomFront.origin.set(0, 0);
        this.roomFront.y = PIXEL_CANVAS_HEIGHT - 16;
        
        
        //地表のマップチップ
        this.surface = GroundSurface().addChildTo(this.pixelField);
        this.surface.position.set(0, PIXEL_CANVAS_HEIGHT - 16 * 2);
        this.surface.hide();
        
        //エフェクト
        this.soilDustController = SoilDustController().addChildTo(this.pixelField);
        this.oreIconController = OreIconController().addChildTo(this.pixelField);
        this.oreGetEffectController = OreGetEffectController().addChildTo(this.pixelField);
        this.glitterEffectController = GlitterEffectController().addChildTo(this.pixelField);
        
        //画面上のボタン
        let vkeypad = VirtualKeyPad().addChildTo(this);
        vkeypad.position.set(0, CANVAS_HEIGHT);
        vkeypad.vkeyLeft.AttachKeyboard('left');
        vkeypad.vkeyLeft.AttachKeyboard('a');
        vkeypad.vkeyLeft.onPushStart = function(){
            // console.log('left');
            if (this.gameState === GameState.Game) {
                this.player.ActionRequest(Dir.Left);
            }
        }.bind(this);
        vkeypad.vkeyLeft.onPush = function() {
            if (this.gameState === GameState.EscapeGame) {
                this.player.ActionRequest(Dir.Left);
            }
        }.bind(this);
        
        vkeypad.vkeyUp.AttachKeyboard('up');
        vkeypad.vkeyUp.AttachKeyboard('w');
        vkeypad.vkeyUp.onPushStart = function(){
            // console.log('up');
            if (this.gameState === GameState.Game || this.gameState === GameState.EscapeGame) {
                this.player.ActionRequest(Dir.Up);
            }
        }.bind(this);
        
        vkeypad.vkeyRight.AttachKeyboard('right');
        vkeypad.vkeyRight.AttachKeyboard('d');
        vkeypad.vkeyRight.onPushStart = function(){
            // console.log('right');
            if (this.gameState === GameState.Game) {
                this.player.ActionRequest(Dir.Right);
            }
        }.bind(this);
        vkeypad.vkeyRight.onPush = function() {
            if (this.gameState === GameState.EscapeGame) {
                this.player.ActionRequest(Dir.Right);
            }
        }.bind(this);
        vkeypad.vkeyDown.AttachKeyboard('down');
        vkeypad.vkeyDown.AttachKeyboard('s');
        vkeypad.vkeyDown.onPushStart = function(){
            // console.log('down');

            if (this.gameState === GameState.Game || this.gameState === GameState.EscapeGame) {
                this.player.ActionRequest(Dir.Down);
            }
        }.bind(this);
        vkeypad.vkeySkill.AttachKeyboard('space');
        vkeypad.vkeySkill.onPushStart = function() {
            this.vKeyPad.vkeySkillFill.srcRect.x = 43;
        }.bind(this);
        vkeypad.vkeySkill.onPushEnd = function() {
            this.vKeyPad.vkeySkillFill.srcRect.x = 0;
            if (this.gameState === GameState.Game) {
                this.player.DrillRequest();
            }
        }.bind(this);
        
        vkeypad.vkeyGo.AttachKeyboard('left');
        vkeypad.vkeyGo.AttachKeyboard('up');
        vkeypad.vkeyGo.AttachKeyboard('right');
        vkeypad.vkeyGo.AttachKeyboard('down');
        vkeypad.vkeyGo.AttachKeyboard('a');
        vkeypad.vkeyGo.AttachKeyboard('s');
        vkeypad.vkeyGo.AttachKeyboard('d');
        vkeypad.vkeyGo.AttachKeyboard('w');
        vkeypad.vkeyGo.AttachKeyboard('space');
        vkeypad.vkeyGo.onPushEnd = function() {
            if (this.player.state === Player.State.JetWait) {
                this.player.ActionRequest(Dir.Up);
            }
            
        }.bind(this);
        vkeypad.vkeyGo.hide();
        
        this.vKeyPad = vkeypad;
        this.vKeyPad.hide();
        this.vKeyPad.DisableAllKeys();
                
        //タイマー 残り時間表示
        this.timer = GameTimer().addChildTo(this);
        this.timer.position.set(2 * PIXEL_SCALE, 2 * PIXEL_SCALE);
        this.timer.hide();

        //リザルト後に落下してくるインテリア
        this.fallDeco = PixelSprite('deco_wall_clock').addChildTo(this);
        this.fallDeco.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.fallDeco.hide();
        
        //「インテリアGET!」
        this.decoGetText = PixelSprite('text_deco_get').addChildTo(this);
        this.decoGetText.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.decoGetText.hide();

//        //「READY...」「GO!」
        this.guideTextSprite = PixelSprite('text_ready').addChildTo(this);
        this.guideTextSprite.position.set(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2 - 24 * PIXEL_SCALE
        );
        this.guideTextSprite.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.guideTextSprite.hide();
        
        //「FULL CAHRGE!」
        this.fullChargeText = PixelSprite('text_fullcharge').addChildTo(this);
        this.fullChargeText.position.set(1 * PIXEL_SCALE, CANVAS_HEIGHT - 55 * PIXEL_SCALE);
        this.fullChargeText.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.fullChargeText.origin.set(0, 0);
        this.fullChargeText.hide();

        //リザルト管理
        this.resultController = ResultController().addChildTo(this);
        this.resultController.hide();
        
        //「スタート」
        this.startButton = MenuButton(MenuButton.Icon.Pickel, 'スタート').addChildTo(this);
        this.startButton.position.set(
            CANVAS_WIDTH / 2 - 32 * PIXEL_SCALE,
            CANVAS_HEIGHT / 2 + 66 * PIXEL_SCALE
        );
        this.startButton.OnPushed = function() {
            if (this.tutorialWindow.visible) return;
            if (this.developerWindow.visible) return;
            this.InitReadyWait();
        }.bind(this);
        this.startButton.width = 52 * PIXEL_SCALE;
        this.startButton.height = 18 * PIXEL_SCALE;
        
        this.startButton.setInteractive(false);
        this.startButton.tweener.wait(1800).set({'visible':true}).wait(200).set({'interactive':true}).play();
        this.startButton.hide();
        
        //「あそびかた」
        this.tutorialButton = MenuButton(MenuButton.Icon.Wakaba, 'あそびかた').addChildTo(this);
        this.tutorialButton.position.set(
            CANVAS_WIDTH / 2 - 32 * PIXEL_SCALE,
            CANVAS_HEIGHT / 2 + 86 * PIXEL_SCALE
        );
        this.tutorialButton.OnPushed = function() {
            if (this.tutorialWindow.visible) return;
            if (this.developerWindow.visible) return;
            this.tutorialWindow.Open();
        }.bind(this);
        this.tutorialButton.width = 64 * PIXEL_SCALE;
        this.tutorialButton.height = 18 * PIXEL_SCALE;
        this.tutorialButton.hide();
        this.tutorialButton.setInteractive(false);
        this.tutorialButton.tweener.wait(2000).set({'visible':true, 'interactive':true}).call(function(){
            this.startButton.setInteractive(true);
            this.tutorialButton.setInteractive(true);
        }.bind(this)).play();

        //クレジットボタン
        this.creditButton = PixelSpriteButton('button_credit').addChildTo(this);
        this.creditButton.position.set(CANVAS_WIDTH - 22 * PIXEL_SCALE, CANVAS_HEIGHT - 7 * PIXEL_SCALE);
        this.creditButton.setInteractive(false);
        this.creditButton.hide();
        this.creditButton.onPushed = function() {
            if (this.developerWindow.visible) return;
            if (this.tutorialWindow.visible) return;
            this.developerWindow.RotFavorite();
            this.developerWindow.tweener.wait(1).set({'visible':true}).play();
        }.bind(this);

        this.creditButton.hide();

        // if (Storage.Has('play_count')) {
        //     this.creditButton.tweener.wait(2200).set({'visible':true, 'y':this.creditButton.y + 15 * PIXEL_SCALE})
        //         .to({'y':CANVAS_HEIGHT - 7 * PIXEL_SCALE}, 300).set({'interactive':true}).play();
        // } else {
        //     //初回は表示しない
        //     this.creditButton.hide();
        // }
        
        //ハイスコアの王冠アイコン
        this.crown = PixelSprite('crown').addChildTo(this);
        this.crown.origin.set(0, 0);
        this.crown.position.set(2 * PIXEL_SCALE, 2 * PIXEL_SCALE);
        this.crown.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        
        //ハイスコア
        this.highScoreLabel = CommonLabel({
            'text':'0', 
            'fontSize':12 * PIXEL_SCALE,
        }).addChildTo(this);
        this.highScoreLabel.origin.set(0, 0);
        this.highScoreLabel.position.set(16 * PIXEL_SCALE, 0);
        
        if (Storage.Has('high_score')) {
            this.highScoreLabel.text = Storage.GetString('high_score');
            this.crown.tweener.set({'y': - 12 * PIXEL_SCALE}).wait(2200).to({'y':2 * PIXEL_SCALE}, 300).play();
            this.highScoreLabel.tweener.set({'y':- 14 * PIXEL_SCALE}).wait(2200).to({'y':0}, 300).play();
        } else {
            //初回は表示しない
            this.crown.hide();
            this.highScoreLabel.hide();
        }
        
        //フェードイン用の黒
        this.fadeRect = RectangleShape({
            'width': CANVAS_WIDTH,
            'height': CANVAS_HEIGHT,
            'fill':'#222',
            'stroke':null,
            'padding':0
        }).addChildTo(this);
        this.fadeRect.origin.set(0, 0);
        this.fadeRect.tweener.wait(1000).to({'alpha':0}, 400).call(function(){
            //fadeRectとlogoの重なり順を入れ替え
            let index = this.getChildIndex(this.fadeRect);
            this.addChildAt(this.logo, index - 1);
        }.bind(this)).play();
        
        //タイトルロゴ
        this.logo = TitleLogo().addChildTo(this);
        this.logo.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 65 * PIXEL_SCALE);
        this.logo.alpha = 0;
        this.logo.tweener.to({'alpha':1}, 400).play();

        this.tutorialWindow = TutorialWindow().addChildTo(this);
        this.tutorialWindow.position.set(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2
        )
        this.tutorialWindow.hide();
        
        this.developerWindow = DeveloperWindow().addChildTo(this);
        this.developerWindow.hide();
        
        EventManager.AddEventListener('OnPlayerJetWaitStart', this);
        EventManager.AddEventListener('OnPlayerJetStart', this);
        EventManager.AddEventListener('OnPlayerFlewAway', this);
        EventManager.AddEventListener('OnPlayerEscape', this);
        EventManager.AddEventListener('OnPlayerLanding', this);
        EventManager.AddEventListener('OnCellDug', this);
        EventManager.AddEventListener('OnDrillStart', this);
        EventManager.AddEventListener('OnResultClosed', this);
        EventManager.AddEventListener('OnPlayerGroundUp', this);
        EventManager.AddEventListener('OnDecorationChanged', this);
        
    },
    
    'update': function(app) {
        Timer.set(app.deltaTime);

        //地層のスプライト表示/非表示
        //画面内にいるときだけ表示する
        const screen = Rect(0, -this.pixelField.y / PIXEL_SCALE, PIXEL_CANVAS_WIDTH, PIXEL_CANVAS_HEIGHT);
        if (this.roomFront.hitTestElement(screen)) {
            this.roomFront.show();
        } else {
            this.roomFront.hide();
        }
        
        //スキルボタン点滅
        if (this.energy >= MainScene.EnergyMax) {
            if (++this.skillFlashCnt >= this.skillFlashMax) {
                this.vKeyPad.flash();
                this.skillFlashCnt = 0;
                this.skillFlashMax = this.skillFlashMax === 3 ? 30 : 3;
            }
        }

        //金、ダイヤモンドのマスは数フレームごとに光る
        if (++this.glitterCnt >= this.glitterMax) {
            this.glitterCnt = 0;
            let data = this.groundController.GetDisplayCells();
            let cells = data.cells;
            for (let y = 0; y < cells.length; ++y) {
                for (let x = 0; x < GroundController.Row; ++x) {
                    let cell = cells[y][x];
                    let type = Bit.GetType(cell);
                    if (type === Bit.Gold || type === Bit.Diamond) {
                        
                        //該当マスの左上座標
                        let px = x * 16;
                        let py = this.groundController.y + (data.dy + y) * 16;
                        
                        this.glitterEffectController.Spawn(
                            px + Random.randint(0, 16),
                            py + Random.randint(0, 16),
                            Random.randint(0, 8)
                        );
                        
                    }
                }
            }
        }
        
        //画面スクロール
        switch(this.gameState) {
            case GameState.Title: 
                break;
                
            case GameState.Ready:
            case GameState.Game:
                this.pixelField.tweener.clear()
                    //.to({'by':-(this.player.y - PIXEL_CANVAS_HEIGHT * 1 / 3) * PIXEL_SCALE}, 200).play();
                    .to({'by':-(this.player.y - PIXEL_CANVAS_HEIGHT * 1 / 5) * PIXEL_SCALE}, 200).play();

                break;
                
            case GameState.EscapeGame:
                this.pixelField.tweener.clear()
                    .to({'by':-(this.player.y - PIXEL_CANVAS_HEIGHT + 64) * PIXEL_SCALE}, 100).play();
                break;
        }
        
    },
    
    'ShowPadWithAnim': function() {
        this.vKeyPad.show();
        // this.vKeyPad.tweener.clear().to({'y':0}, 300).play();
        this.vKeyPad.tweener.clear().to({'y':CANVAS_HEIGHT - (48 * PIXEL_SCALE)}, 300).play();
    },
    
    'HideKeyPadWithAnim': function() {
        this.vKeyPad.tweener.clear()
            .to({'y':CANVAS_HEIGHT}, 300)
            .call(function(){
                this.vKeyPad.hide();
            }.bind(this));
    },
    
    'ShowFullChargeText': function() {
        if (this.fullChargeText.visible) return;
        
        this.fullChargeText.show();
        this.fullChargeText.tweener.by({'y': 3 * PIXEL_SCALE}, 100).by({'y':-3 * PIXEL_SCALE}, 100).wait(1500).set({'visible':false}).play();
        
    },
    
    'CreateDugSoil': function(x, y) {
        let soil = PixelSprite('dugground').addChildTo(this.dugSoilLayer);
        soil.position.set(x, y);
        return soil;
    },
    
    'RemoveAllDugSoils': function() {
        while(this.dugSoilLayer.children[0]) {
            this.dugSoilLayer.children[0].remove();
        }
    },
    
    'InitTitle': function() {
        this.gameState = GameState.Title;
        this.pixelField.by = -CANVAS_HEIGHT - (128 - 32) * PIXEL_SCALE;
        
        this.guideTextSprite.hide();
        this.guideTextSprite.image = 'text_ready';

        this.fallDeco.hide();
        this.decoGetText.hide();
        this.mountain.hide();
        this.surface.hide();
        
        this.RemoveAllDugSoils();
        
        this.logo.show();
        
        this.startButton.show();
        this.startButton.setInteractive(true);
        this.tutorialButton.show();
        this.tutorialButton.setInteractive(true);
        
        // this.creditButton.tweener.wait(1000).set({'visible':true, 'y':this.creditButton.y + 15 * PIXEL_SCALE})
        //     .to({'y':CANVAS_HEIGHT - 7 * PIXEL_SCALE}, 300).set({'interactive':true}).play();
        
        if (Storage.Has('high_score')) {
            this.crown.show();
            this.highScoreLabel.show();
            this.highScoreLabel.text = Storage.GetString('high_score');
            this.crown.tweener.set({'y': - 12 * PIXEL_SCALE}).wait(1000).to({'y':2 * PIXEL_SCALE}, 300).play();
            this.highScoreLabel.tweener.set({'y':- 14 * PIXEL_SCALE}).wait(1000).to({'y':0}, 300).play();
        }
        
        this.titlePlayer.show();
        this.titlePlayer.ChangeAction(this.room.y);

        this.ApplyDecorations();
        
    },
    
    'InitReadyWait': function() {
        this.gameState = GameState.ReadyWait;
        
        this.titlePlayer.image = 'mog_fine';
        this.titlePlayer.width = 64;
        this.titlePlayer.height = 64;
        this.titlePlayer.animator.Play('fine');
        
        this.titlePlayer.skillEffect.Play();
        
        this.titlePlayer.tweener.wait(800).call(function(){
            this.titlePlayer.image = 'mog_fall';
            this.titlePlayer.animator.Play('fall');
            this.titlePlayer.scale.x = -1;
            let jump = Tweener().attachTo(this.titlePlayer);
            jump.by({'y':-24}, 400, 'easeOutCubic').to({'y':this.room.y + 25}, 400, 'easeInCubic').play();
        }.bind(this)).to({'x':32 + 8}, 800).call(function(){
            this.titlePlayer.image = 'mog_idle';
            this.titlePlayer.animator.Play('idle');
        }.bind(this)).wait(200) 
        .call(function(){
            this.titlePlayer.image = 'mog_pick_under';
            this.titlePlayer.animator.Play('pick');
            this.soilDustController.spawn(this.titlePlayer.x, this.titlePlayer.y, Dir.Down)
            this.soilDustController.spawn(this.titlePlayer.x, this.titlePlayer.y, Dir.Down)
            
            this.CreateDugSoil(this.titlePlayer.x, this.titlePlayer.y - 1);
        }.bind(this)).wait(20).by({'y':16}, 100, 'easeInCubic')
        .wait(200)
        .call(function(){
            this.titlePlayer.image = 'mog_pick_under';
            this.titlePlayer.animator.Play('pick');
            this.soilDustController.spawn(this.titlePlayer.x, this.titlePlayer.y, Dir.Down)
            this.soilDustController.spawn(this.titlePlayer.x, this.titlePlayer.y, Dir.Down)
        }.bind(this)).wait(20).by({'y':16}, 100, 'easeInCubic')
        .wait(800).call(function() {
            this.InitReady();
        }.bind(this)).play();
        
        this.startButton.setInteractive(false);
        
        this.logo.hide();
        
        this.tutorialButton.hide();
        this.tutorialButton.setInteractive(false);
        
        this.creditButton.hide();
        this.creditButton.tweener.clear();
        this.creditButton.setInteractive(false);
        
        this.crown.hide();
        this.highScoreLabel.hide();
        
        
    },
    
    'InitReady': function() {
        this.gameState = GameState.Ready;
        
        this.player.cell.set(1, 1);
        this.player.ApplyPosition();
        this.player.InitIdle();
        this.player.timeUpFlag = false;
        
        this.ironCnt = 0;
        this.goldCnt = 0;
        this.diamondCnt = 0;
        
        this.energy = 0;
        
        this.groundController.ResetCells();
        
        //タイマー表示
        this.timer.reset(MainScene.GameTime);
        this.timer.show();
        
        //↓ここだと1フレーム前の文字列が出るので、InitTitleでやっとく
        //this.guideTextSprite.image = 'text_ready';
        this.guideTextSprite.show();
        
        this.startButton.hide();
        this.startButton.setInteractive(false);
        
        this.titlePlayer.hide();
        
        this.ShowPadWithAnim();
        this.vKeyPad.vkeySkill.show();
        this.vKeyPad.SetSkillFillRate(0);
        this.vKeyPad.DisableAllKeys();
        
        let soil = this.CreateDugSoil(32 - 8, this.groundController.y + 6);
        soil.scale.y = -1;
        
        this.tweener.clear().wait(1300).call(function(){
            this.InitGame();
        }.bind(this)).play();
        
    },
    
    'InitGame': function() {
        this.gameState = GameState.Game;
        
        this.timer.start();
        
        this.guideTextSprite.image = 'text_go';
        this.guideTextSprite.tweener.clear()
            .by({'y': 3 * PIXEL_SCALE}, 50)
            .by({'y':-3 * PIXEL_SCALE}, 50)
            .wait(800).set({'visible':false}).play();
        
        this.vKeyPad.vkeyLeft.Enable();
        this.vKeyPad.vkeyUp.Enable();
        this.vKeyPad.vkeyRight.Enable();
        this.vKeyPad.vkeyDown.Enable();
        
    },
    
    'InitEscapeGame': function() {
        this.gameState = GameState.EscapeGame;
        
        this.guideTextSprite.image = 'text_timeup';
        this.guideTextSprite.show();
        this.guideTextSprite.tweener.by({'y': 3 * PIXEL_SCALE}, 50)
            .by({'y':-3 * PIXEL_SCALE}, 50)
            .wait(900).set({'visible':false}).play();
        
    },
    
    'InitResultWait': function() {
        this.gameState = GameState.ResultWait;
        
    },
    
    'InitResult': function() {
        this.gameState = GameState.Result;
        this.resultController.show();
        this.resultController.Reset();
        
        let iron = this.ironCnt * MainScene.IronRate;
        let gold = this.goldCnt * MainScene.GoldRate;
        let diamond = this.diamondCnt * MainScene.DiamondRate;
        let total = iron + gold + diamond;
        
        this.resultController.Start({
            'ironCnt': this.ironCnt,
            'ironRate': MainScene.IronRate,
            'ironScore': iron,
            'goldCnt': this.goldCnt,
            'goldRate': MainScene.GoldRate,
            'goldScore': gold,
            'diamondCnt': this.diamondCnt,
            'diamondRate': MainScene.DiamondRate,
            'diamondScore': diamond,
            'total':total,
            'highScore':Storage.Has('high_score') ? Storage.GetNumber('high_score') : null
        });
        
        //ハイスコア更新
        let high = Storage.Has('high_score') ? Storage.GetNumber('high_score') : 0;
        if (total > high) {
            Storage.Set('high_score', total);
        }
        
        //プレイ回数更新
        let playcnt = Storage.Has('play_count') ? Storage.GetNumber('play_count') : 0;
        Storage.Set('play_count', playcnt + 1);

        //インテリアゲット
        const item = RoomDecoration.GetItem(playcnt);
        if (item) {
            const index = RoomDecoration.GetIndex(item);
            Storage.Set('deco' + item.spot, index);
        }

        //GAイベント送信
        GA.SendEvent('game_clear', String(playcnt));
        GA.SendEvent('game_score', String(total));
        
        this.guideTextSprite.image = 'text_thankyou';
    },
    
    'InitThankyou': function() {
        this.gameState = GameState.Thankyou;
        
        //↓ここだと1フレーム前の文字列が出るので、InitResultでやっとく
        //this.guideTextSprite.image = 'text_thankyou';
        this.guideTextSprite.tweener.clear()
            .by({'y': 3 * PIXEL_SCALE}, 50)
            .by({'y':-3 * PIXEL_SCALE}, 50).play();

        this.guideTextSprite.show();

        const playCnt = Storage.Has('play_count') ? Storage.GetNumber('play_count') - 1 : 0;
        let deco = RoomDecoration.GetItem(playCnt);

        if (deco) {
            //インテリア獲得
            this.fallDeco.show();
            this.fallDeco.image = deco['image'];
            this.fallDeco.width = deco['w'];
            this.fallDeco.height = deco['h'];

            this.fallDeco.position.set(this.player.x * PIXEL_SCALE, -deco['h'] * PIXEL_SCALE);
            this.fallDeco.tweener.to({'y':(this.player.y - 12 - deco['h'] / 2) * PIXEL_SCALE}, 1000, 'easeInQuad').play();
            
            this.player.tweener.wait(1000).call(function(){
                this.player.body.image = 'mog_fine_no_pickel';
                this.player.anim.Play('fine');
            }.bind(this)).play();

            this.decoGetText.position.set(this.fallDeco.x, (this.player.y - 24 - deco['h']) * PIXEL_SCALE);
            this.decoGetText.tweener.wait(1000).set({'visible':true})
            .by({'y': 3 * PIXEL_SCALE}, 50)
            .by({'y':-3 * PIXEL_SCALE}, 50).play();

        } else {
            //ぜんぶ獲得済み
            this.player.body.image = 'mog_fine';
            this.player.anim.Play('fine');
            this.player.skillEffect.Play();
        }

        this.fadeRect.tweener.clear().wait(4000)
            .set({'visible':true, 'alpha':0})
            .to({'alpha':1}, 400)
            .call(function(){
                this.InitTitle();
            }.bind(this))
            .wait(500)
            .to({'alpha':0}, 400)
            .set({'visible':false}).play();
    },
    
    'ApplyDecorations': function() {
        const playCnt = Storage.Has('play_count') ? Storage.GetNumber('play_count') : 0;

        const walls = [];
        const tables = [];
        const lefts = [];
        const rights = [];

        const l = Math.min(playCnt, RoomDecoration.items.length);
        for (let i = 0; i < l; ++i) {
            let item = RoomDecoration.GetItem(i);
            //{'image':'deco_wall_clock', 'spot':0, 'x':0, 'y':0, 'w':13, 'h':13},
            switch(item.spot) {
                case RoomDecoration.Spot.Wall: walls.push(item); break;
                case RoomDecoration.Spot.Table: tables.push(item); break;
                case RoomDecoration.Spot.Left: lefts.push(item); break;
                case RoomDecoration.Spot.Right: rights.push(item); break;
                default: break;
            }
        }

        if (walls.length >= 1){
            this.deco1.SetItems(walls);
            this.deco1.Change(Storage.Has('deco0') ? Storage.GetNumber('deco0') : 0);
        }

        if (tables.length >= 1) {
            this.deco2.SetItems(tables);
            this.deco2.Change(Storage.Has('deco1') ? Storage.GetNumber('deco1') : 0);
        }

        if (lefts.length >= 1) {
            this.deco3.SetItems(lefts);
            this.deco3.Change(Storage.Has('deco2') ? Storage.GetNumber('deco2') : 0);
        }
        if (rights.length >= 1) {
            this.deco4.SetItems(rights);
            this.deco4.Change(Storage.Has('deco3') ? Storage.GetNumber('deco3') : 0);
        }
        
    },

    'OnPlayerJetWaitStart': function() {
        this.InitEscapeGame();
        
        this.vKeyPad.DisableAllKeys();
        
        this.vKeyPad.vkeyDown.hide();
        this.vKeyPad.vkeyLeft.hide();
        this.vKeyPad.vkeyRight.hide();
        this.vKeyPad.vkeyUp.hide();
        this.vKeyPad.vkeySkill.hide();
        
        this.vKeyPad.vkeyGo.show();
        this.vKeyPad.vkeyGo.Disable();
        this.vKeyPad.tweener.wait(1000).call(function(){
            this.vKeyPad.vkeyGo.Enable();
        }.bind(this)).play();
    },
    
    //プレイヤーがJet開始した瞬間
    'OnPlayerJetStart': function() {
        this.timer.hide();
        
        this.vKeyPad.vkeyGo.Disable();
        this.vKeyPad.vkeyGo.hide();
        
        this.vKeyPad.vkeyDown.show();
        this.vKeyPad.vkeyLeft.show();
        this.vKeyPad.vkeyRight.show();
        this.vKeyPad.vkeyUp.show();
        
        this.vKeyPad.vkeyLeft.Enable();
        this.vKeyPad.vkeyRight.Enable();
        
    },
    
    //マップから地層へ行った瞬間
    'OnPlayerEscape': function() {
        this.InitResultWait();

        //地表と背景山表示
        this.mountain.show();
        this.surface.show();

        this.pixelField.tweener.clear().to({'by':0}, 3500, 'easeOutQuad').play();
        
        this.vKeyPad.DisableAllKeys();
        this.HideKeyPadWithAnim();
        this.pixelField.quake();
        
        this.soilDustController.spawn(this.player.x, this.player.y, Dir.Up);
        this.soilDustController.spawn(this.player.x, this.player.y, Dir.Up);
        
        let soil = this.CreateDugSoil(this.player.x, this.groundController.y + 8);
        soil.scale.y = -1;
        
    },
    
    'OnPlayerGroundUp': function() {
        this.pixelField.quake();
        this.soilDustController.spawn(this.player.x - 8, this.player.y - 8, Dir.Right);
        this.soilDustController.spawn(this.player.x, this.player.y - 8, Dir.Down);
        this.soilDustController.spawn(this.player.x, this.player.y - 8, Dir.Down);
        this.soilDustController.spawn(this.player.x + 8, this.player.y - 8, Dir.Left);
        
        this.CreateDugSoil(this.player.x, PIXEL_CANVAS_HEIGHT - 16 - 23);
        
    },
    
    'OnPlayerFlewAway': function() {
        //プレイヤー落下地点調整
        this.player.x = Math.floor(PIXEL_CANVAS_WIDTH * 3 / 4);
        this.player.body.image = 'mog_fall';
        this.player.body.scale.x = -1;
        this.player.anim.Play('fall');
        //落下したらLandingイベント
        this.player.tweener.clear().to({'y':PIXEL_CANVAS_HEIGHT - 16 - 24}, 1000).call(function(){
            EventManager.Fire('OnPlayerLanding');
        })
    },
    
    'OnPlayerLanding': function() {
        this.player.body.image = 'mog_idle';
        this.player.anim.Play('idle');
        this.tweener.clear().wait(300).call(function() {
            this.InitResult();
        }.bind(this)).play();
        
    },
    
    'OnResultClosed': function() {
        this.resultController.hide();
        this.InitThankyou();
    },
    
    'OnCellDug': function(params) {
        
        //スコア加算
        if (params.type === Bit.Iron) this.ironCnt++;
        else if (params.type === Bit.Gold) this.goldCnt++;
        else if (params.type === Bit.Diamond) this.diamondCnt++;
        
        //崩れるエフェクト発生
        if (params.type === Bit.Soil) {
            this.soilDustController.spawn(
                params.x * 16 + 8, 
                this.groundController.y + params.y * 16 + 8,
                params['dir'],
                this.groundController.IsDeep(params.x, params.y)
            );
        }
        // if (params.type !== Bit.Soil) {
        else {
            
            //マスが光るエフェクト
            this.oreGetEffectController.Spawn(
                params.x * 16 + 8,
                params.y * 16 + 8 + this.groundController.y
            );
            
            //鉱石アイコンのエフェクト
            this.oreIconController.Spawn(params.type, 
                params.x * 16 + 8,
                params.y * 16 + 8 + this.groundController.y
            );
            
            //きらきらが残るエフェクト
            let offset = [
                {'x':-6, 'y':-6},
                {'x':-8, 'y':5},
                {'x':6, 'y':3},
            ]
            
            for (let i = 0; i < 3; ++i) {
                this.glitterEffectController.Spawn(
                    params.x * 16 + offset[i].x + 8,
                    params.y * 16 + offset[i].y + 8 + this.groundController.y,
                    i * 3 + 1
                )
            }

        }
        
        //普通に掘ったときはエナジー獲得
        if (this.player.state === Player.State.Dug) {
            let preEnergy = this.energy;
            switch(params.type) {
                case Bit.Soil: this.energy += MainScene.AddEnergySoil; break;
                case Bit.Iron: this.energy += MainScene.AddEnergyIron; break;
                case Bit.Gold: this.energy += MainScene.AddEnergyGold; break;
                case Bit.Diamond: this.energy += MainScene.AddEnergyDiamond; break;
            }
            
            //エナジー溜まったとき
            if (preEnergy < MainScene.EnergyMax && 
                this.energy >= MainScene.EnergyMax) {
                this.energy = MainScene.EnergyMax;
                this.skillFlashCnt = 30;
                this.skillFlashMax = 30;
                this.vKeyPad.vkeySkill.Enable();
                this.ShowFullChargeText();
            }
            
            this.vKeyPad.SetSkillFillRate(Math.min(this.energy / MainScene.EnergyMax, 1));
        }
    },
    
    'OnDrillStart': function() {
        this.energy = 0;
        this.vKeyPad.SetSkillFillRate(0);
        this.vKeyPad.vkeySkill.Disable();
    },
    
    'OnDecorationChanged': function(deco) {

        //変更を保存
        Storage.Set('deco' + deco.spot, deco.index);

        //エフェクト発生
        if (Random.randint(0, 1) === 0) {
            this.glitterEffectController.Spawn(deco.x + deco.body.width / 2 + deco.body.x, deco.y + deco.body.y + deco.body.height / 2, 0);
            this.glitterEffectController.Spawn(deco.x - deco.body.width / 2 + deco.body.x, deco.y + deco.body.y , 2);
            this.glitterEffectController.Spawn(deco.x + deco.body.width / 2 + deco.body.x, deco.y + deco.body.y  - deco.body.height / 2, 4);
        } else {
            this.glitterEffectController.Spawn(deco.x - deco.body.width / 2 + deco.body.x, deco.y + deco.body.y  + deco.body.height / 2, 0);
            this.glitterEffectController.Spawn(deco.x + deco.body.width / 2 + deco.body.x, deco.y + deco.body.y , 2);
            this.glitterEffectController.Spawn(deco.x - deco.body.width / 2 + deco.body.x, deco.y + deco.body.y  - deco.body.height / 2, 4);
        }
    },
    
    '_static': {
        'GameTime':40,
        'IronRate':2,
        'GoldRate':5,
        'DiamondRate':20,
        'EnergyMax':100,
        'AddEnergySoil':0.5,
        'AddEnergyIron':6,
        'AddEnergyGold':30,
        'AddEnergyDiamond':6,
    }
    
})

phina.main(function(){
    
    let canvas = document.getElementById('canvas');
    let app = GameApp({
        'startLabel': 'main',
        'width': CANVAS_WIDTH,
        'height': CANVAS_HEIGHT,
        'assets': ASSETS,
        
        'scenes': [
            {'className': 'MainScene', 'label':'main', 'nextLabel':'main'}
        ],
        
        'query':'canvas', //既にあるcanvas要素を使う
        'fit': false,
        'pixelated':true, //アンチエイリアス切る
    });
    
    //stats表示
    if(URLParam.Has('stats')) {
        app.enableStats();
    }
    
    Twitter.SetUser('AsazukeMochi');
    Twitter.SetHashTags(['マインマイン', 'MINEMINE']);
    Twitter.SetUrl('https://app.azm-it.com/games/mine');

    GA.AddEvent('share');
    GA.AddEvent('game_clear');
    GA.AddEvent('game_score');

    app.run();
    
    
});