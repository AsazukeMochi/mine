
//地面ブロックのビット、ビット演算管理
const Bit = {
    
    //value内の種類ビットを返却
    'GetType': function(value) {
        return value & Bit.Types;
    },
    
    //value内のランダムフラグを返却
    'GetFlag': function(value) {
        return value & Bit.Flags;
    },
    
    //flagを0,1,2,3に変換する
    'FlagNumber': function(flag) {
        switch(flag) {
            case Bit.Flag1: return 0;
            case Bit.Flag2: return 1;
            case Bit.Flag3: return 2;
            case Bit.Flag4: return 3;
            default: return 0;
        }
    },
    
    //ランダムでFlag1~Flag4のどれかを返却
    'RandomFlag': function() {
        return [Bit.Flag1, Bit.Flag2, Bit.Flag3, Bit.Flag4][Random.randint(0, 3)];
    },
    
    //valueにbitが全て立っているか判定
    'Has': function(value, bit) {
        return (value & bit) === bit;
    },
    
    //マスの種類
    'Blank': 0, //空洞
    'Soil': 1,  //土
    'Iron': 2,  //鉄
    'Gold': 4,  //金
    'Diamond': 8, //ダイヤ
    'Types': 0 + 1 + 2 + 4 + 8,
    
    //マスのフラグ 土の模様を決める際に使う
    'Flag1': 0,
    'Flag2': 16,
    'Flag3': 32,
    'Flag4': 64,
    'Flags': 0 + 16 + 32 + 64,
    
    //PushCellsで使う　通過したマスを識別する用
    'Foot': 128,
    
    //深層フラグ
    'Deep': 256,
    
}

//4方向
const Dir = {
    'Neutral':{'x':0, 'y':0, 'v':0},
    'Left':{'x':-1, 'y':0, 'v':1},
    'Up':{'x':0, 'y':-1, 'v':1},
    'Right':{'x':1, 'y':0, 'v':1},
    'Down':{'x':0, 'y':1, 'v':1}
}

phina.define('GroundController', {
    'superClass': 'DisplayElement',
    'init': function(params) {
        this.superInit(params);
        
        this.rx = 0; //PushCellsで使う
        
        this.chips = [];
        this.cells = [];
        
        
        let l = GroundController.Row * GroundController.Column;
        
        //地面チップ作る
        for (let i = 0; i < l; ++i) {
            let chip = GroundChip().addChildTo(this);
            chip.hide();
            this.chips.push(chip);
        }
        
        EventManager.AddEventListener('OnCellDug', this);
    },
    
    'update': function(app) {
        
        //一旦チップ全部消す
        for (let chip of this.chips) {
            chip.hide();
        }
        
        let dy = Math.floor((-this.getParent().y - (this.y * PIXEL_SCALE)) / PIXEL_SCALE / 16);
        
        for (let y = dy; y < GroundController.Column + dy; ++y) {
            if (y < 0) continue;
            if (y >= this.cells.length) continue;
            
            for (let x = 0; x < GroundController.Row; ++x) {
                let chip = this.GetChip();
                chip.show();
                chip.cell.set(x, y);
                chip.Apply();
                chip.position.set(x * 16, y * 16);
            }
        }
        
        
    },
    
    //指定したマスを掘る
    'DugCell': function(x, y, dir) {
        let type = this.GetCellType(x, y);
        if (type !== Bit.Blank) {
            EventManager.Fire('OnCellDug', {'type': type, 'x': x, 'y':y, 'dir':dir});
            this.cells[y][x] = this.cells[y][x] & ~(Bit.Types); //種類ビットを全て降ろして空洞マスにする
        }
    },
    
    //マスの値を取得
    'GetCell': function(x, y) {
        return this.cells[y][x];
    },
    
    //マスの種類を取得
    'GetCellType': function(x, y) {
        return Bit.GetType(this.GetCell(x, y));
    },
    
    //マスのフラグを取得
    'GetCellFlag': function(x, y) {
        return Bit.GetFlag(this.GetCell(x, y));
    },
    
    'IsDeep': function(x, y) {
        return Bit.Has(this.GetCell(x, y), Bit.Deep);
    },
    
    //非表示状態のチップオブジェクトを1つ取得
    'GetChip': function() {
        for (let chip of this.chips) {
            if (!chip.visible) return chip;
        }
        
        return null;
    },
    
    //新たに1セット分のマスを作る
    /*
    　8x10のマス上を、最上段から下へ、くねくね曲がる線を描いていく
    　線を引く際の土or鉄が数ブロックごとに切り替わる。(土のときは見た目変化なし)
    */
    'PushCells': function(goldFlag, firstFlag, deepFlag) {
        let cells = [];
        
        let rx = this.rx;
        let ry = 0;
        
        let ironMin = 5;
        let ironMax = 7;
        let soilMin = 3;
        let soilMax = 4;
        
        
        if (firstFlag) {
            ry = 2;
        }
        
        if (deepFlag) {
            ironMin = 1;
            ironMax = 3;
            soilMin = 5;
            soilMax = 10;
        }
        
        let ironFlag = true;
        let cnt = Random.randint(ironMin, ironMax);
        
        //まず、土 + Flag1~4　で8x10マス用意する
        for (let y = 0; y < 10; ++y) {
            cells.push([]);
            for (let x = 0; x < GroundController.Row; ++x) {
                let bit = Bit.Soil + Bit.RandomFlag();
                if (deepFlag) {
                    bit += Bit.Deep;
                }
                cells[y].push(bit);
            }
        }
        
        //くねくね曲がる土or鉄の線を引く
        while(ry < 10) {
            
            //線を引く
            if (ironFlag) {
                cells[ry][rx] = cells[ry][rx] & ~(Bit.Types);
                cells[ry][rx] += Bit.Iron;
            }
            cells[ry][rx] += Bit.Foot; //通過したマスに印つける
            
            //次に進む方向を決める
            let nextDir = [];
            
            //下
            nextDir.push(Dir.Down);
            
            //左
            if (rx > 0 && !Bit.Has(cells[ry][rx - 1], Bit.Foot)) {
                nextDir.push(Dir.Left);
            }
            
            //右
            if (rx < GroundController.Row - 1 && !Bit.Has(cells[ry][rx + 1], Bit.Foot)) {
                nextDir.push(Dir.Right);
            }
            
            //どれか1方向に進む
            let next = nextDir[Random.randint(0, nextDir.length - 1)];
            rx += next.x;
            ry += next.y;
            
            //cnt分進んだら土鉄切り替え
            if (--cnt <= 0) {
                ironFlag = !ironFlag;
                cnt = ironFlag ? Random.randint(ironMin, ironMax) : Random.randint(soilMin, soilMax);
            }
            
        }
        
        //ランダムで金を設置
        if (goldFlag) {
            let x = Random.randint(0, GroundController.Row - 1);
            let y = Random.randint(0, 9);
            while(!Bit.Has(cells[y][x], Bit.Soil)) {
                x = Random.randint(0, GroundController.Row - 1);
                y = Random.randint(0, 9);
            }
            cells[y][x] = cells[y][x] & ~(Bit.Types);
            cells[y][x] += deepFlag ? (Random.randbool() ? Bit.Diamond : Bit.Gold) : Bit.Gold;
        }
        
        if (firstFlag) {
            cells[0][1] = cells[0][1] & ~(Bit.Types);
            cells[1][1] = cells[1][1] & ~(Bit.Types);
            
        }
        
        this.rx = rx;
        this.cells = this.cells.concat(cells);
        
    },
    
    'ResetCells': function() {
        this.cells = [];
        
        this.PushCells(false, true, false);
        this.PushCells();
        
    },
    
    //画面に映っている範囲のセル情報を返す
    'GetDisplayCells': function() {
        let dy = Math.floor((-this.getParent().y - (this.y * PIXEL_SCALE)) / PIXEL_SCALE / 16);
        if (dy < 0) dy = 0;
        return {
            'dy':dy,
            'cells': this.cells.slice(dy, dy + GroundController.Column)
        };
        //return this.cells.slice(dy, dy + GroundController.Column);
    },
    
    
    //掘ったとき、マスが足りなくなりそうだったら自動で追加する
    'OnCellDug': function(params) {
        let d = this.cells.length - params.y;
        if (d < 10) {
            this.PushCells(true, false, this.cells.length >= 100);
        }
    },
    
    '_static': {
        'Row': Math.floor(PIXEL_CANVAS_WIDTH / 16),
        'Column': Math.floor(PIXEL_CANVAS_HEIGHT / 16) + 2,
    }
    
})

phina.define('GroundChip', {
    'superClass': 'DisplayElement',
    'init': function(params) {
        this.superInit(params);
        
        this.cell = Vector2(0, 0);
        
        this.bg = PixelSprite('bg_chip').addChildTo(this);
        this.bg.origin.set(0, 0);
        this.bg.srcRect.set(0, 0, 16, 16);
        this.bg.width = 16;
        this.bg.height = 16;
        this.bg.hide();
        
        this.body = PixelSprite('soil_chip').addChildTo(this);
        this.body.origin.set(0, 0);
        this.body.srcRect.set(0, 0, 16, 16);
        this.body.width = 16;
        this.body.height = 16;
        
        this.iron = PixelSprite('iron', 16, 16).addChildTo(this);
        this.iron.origin.set(0, 0);
        
    },
    
    'Apply': function() {
        
        let p = this.getParent();
        
        if (p.IsDeep(this.cell.x, this.cell.y)) {
            this.body.image ='soil_deep_chip';
            this.bg.image = 'bg_deep_chip';
        } else {
            this.body.image ='soil_chip';
            this.bg.image = 'bg_chip';
        }
        
        this.bg.width = 16;
        this.bg.height = 16;
        
        //this.body.image = 'soil_deep_chip';
        this.body.width = 16;
        this.body.height = 16;
        
        this.body.show();
        this.iron.hide();
        this.bg.hide();
        
        let bit = p.GetCell(this.cell.x, this.cell.y);
        let type = p.GetCellType(this.cell.x, this.cell.y);
        let flag = p.GetCellFlag(this.cell.x, this.cell.y);
        
        switch(type) {
            case Bit.Iron:
            case Bit.Gold:
            case Bit.Diamond:
                //this.iron.image = type === Bit.Iron ? 'iron' : 'gold';
                this.iron.image = (function(){
                    if (type === Bit.Iron) return 'iron';
                    else if (type === Bit.Gold) return 'gold';
                    else return 'diamond';
                })();
                this.iron.width = 16;
                this.iron.show();
                let xx = Bit.FlagNumber(flag) <= 1 ? 0 : 1;
                if (type !== Bit.Iron) {
                    xx = 0;
                }
                this.iron.srcRect.set(xx * 16, 0, 16, 16);
                /*break;*/
            case Bit.Soil:
                
                let x = 0;
                let y = Bit.FlagNumber(flag);
                
                if (this.cell.x === 0 || GroundChip.IsConnect(bit, p.GetCell(this.cell.x - 1, this.cell.y))) {
                    x += 1;
                }
                if (this.cell.y !== 0 && GroundChip.IsConnect(bit, p.GetCell(this.cell.x, this.cell.y - 1))) {
                    x += 2;
                }
                if (this.cell.x === GroundController.Row - 1 || GroundChip.IsConnect(bit, p.GetCell(this.cell.x + 1, this.cell.y))) {
                    x += 4;
                }
                if (this.cell.y === p.cells.length - 1 || GroundChip.IsConnect(bit, p.GetCell(this.cell.x, this.cell.y + 1))) {
                    x += 8;
                }

                this.body.srcRect.set(x * 16, y * 16, 16, 16);
                
                //4方向どこか欠けてたら背景チップ表示
                if (x !== 15) {
                    this.bg.srcRect.set(y * 16, 0, 16, 16);
                    this.bg.show();
                }
                
                break;
                
            case Bit.Blank:
                this.bg.srcRect.set(Bit.FlagNumber(flag) * 16, 0, 16, 16);
                this.bg.show();
                this.body.hide();
                break;
        }
                
    },
    
    '_static': {
        'IsConnect': function(washi, aite) {
            if (Bit.Has(washi, Bit.Deep) === Bit.Has(aite, Bit.Deep)) {
                let type = Bit.GetType(aite);
                return Bit.Soil <= type && type <= Bit.Diamond;
            } else {
                return false;
            }
        },
    }
})

phina.define('Player', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        this.state = Player.State.Idle;
        this.moveDir = Dir.Neutral;
        this.velocity = Vector2(0, 0);
        
        this.requestDir = Dir.Neutral;
        this.requestCnt = 0;
        this.requestLock = false;
        this.drillRequest = false;
        
        this.timeUpFlag = false;

        this.cell = Vector2(0, 0);
        this.body = PixelSprite('mog_idle', 64, 64).addChildTo(this);
        this.body.y = 1;
        
        this.jetSmokeCnt = 0;
        
        this.anim = Animator().AttachTo(this.body);
        this.anim.Add('idle', 0, 0, 64, 64, 4, [0, 0, 1, 2, 2, 3], true);
        this.anim.Add('pick', 0, 0, 64, 64, 2, [0, 1, 2, 3, 4], false);
        this.anim.Add('prejet', 0, 0, 64, 64, 4, [0, 0, 1, 2, 2, 3], true);
        this.anim.Add('jet', 0, 0, 64, 64, 1, [0, 1], true);
        this.anim.Add('predrill', 0, 0, 64, 64, 1, [0, 1], true);
        this.anim.Add('drill_fall', 0, 0, 64, 64, 2, [0, 1], false, 'drill');
        this.anim.Add('drill', 0, 0, 64, 64, 1, [1, 2], true);
        this.anim.Add('drill_after', 64 * 3, 0, 64, 64, 30, [0], false, 'idle');
        this.anim.Add('fall', 0, 0, 64, 64, 1, [0, 0], true);
        this.anim.Add('fine', 0, 0, 64, 64, 1, [0, 0], true);
        this.anim.Play('idle');
        
        this.skillEffect = SkillEffect().addChildTo(this);
        
        EventManager.AddEventListener('OnTimeUp', this);
    },
    
    'update': function() {
        //状態ごとに処理分ける
        switch(this.state) {
            case Player.State.Idle: this.UpdateIdle(); break;
            case Player.State.Dug: this.UpdateDug(); break;
            case Player.State.DugAfter: this.UpdateIdle(); break; //idleでいいのだ
            case Player.State.Drill: this.UpdateDrill(); break;
            case Player.State.DrillAfter: this.UpdateIdle(); break;
            case Player.State.JetWait: this.UpdateJetWait(); break;
            case Player.State.Jet: this.UpdateJet(); break;
            default: break;
        }
        
        this.anim.Update();
        
        //先行入力カウント減らす
        if (!this.requestLock && this.requestDir.v) {
            if (--this.requestCnt <= 0) {
                this.requestDir = Dir.Neutral;
                this.requestLock = false;
                this.drillRequest = false;
            }
        }
        
    },
    
    'ActionRequest': function(dir) {
        if (this.requestLock) return;

        // switch (dir) {
        //     case Dir.Left: console.log('LEFT'); break;
        //     case Dir.Right: console.log('RIGHT'); break;
        //     case Dir.Up: console.log('UP'); break;
        //     case Dir.Down: console.log('DOWN');
        // }

        let cnt = 8;
        
        //同じ方向に掘り進む際は先行入力フレーム縮める
        if (this.state === Player.State.Dug && 
            this.moveDir === dir) {
            cnt = 3;
        }

        this.requestCnt = cnt; //先行入力フレーム数
        this.requestDir = dir;
    },
    
    'DrillRequest': function() {
        this.requestCnt = 8;
        this.drillRequest = true;
    },
    
    'ApplyPosition': function() {
        this.position.set(
            this.cell.x * 16 + 8,
            this.cell.y * 16 + 8 + this.getRoot().groundController.y
        );
    },
    
    'GetGroundController': function() {
        return this.getRoot().groundController;
    },
    
    'InitIdle': function() {
        this.state = Player.State.Idle;        
        this.body.image = 'mog_idle';
        this.anim.Play('idle');
    },
    
    'UpdateIdle': function() {
        
        if (this.timeUpFlag) {
            this.InitJetWait();
            return;
        }
        
        if (this.drillRequest) {
            this.InitPreDrill();
            return;
        }
        
        //入力あったら掘る
        else if (this.requestDir.v) {
            
            let cx = this.cell.x + this.requestDir.x;
            if (0 <= cx && cx < GroundController.Row) {
                this.InitDug(this.requestDir);
            }
            
            this.requestDir = Dir.Neutral;
            this.requestLock = false;
        }
    },
    
    'InitDug': function(dir) {
        
        let dx = this.cell.x + dir.x;
        let dy = this.cell.y + dir.y;
        
        this.state = Player.State.Dug;
        this.moveDir = dir;
        
        //マス移動　上には移動しない
        if (dir != Dir.Up) {
            this.cell.x = dx;
            this.cell.y = dy;
            
            this.tweener.clear().wait(20).to({
                'x': this.cell.x * 16 + 8,
                'y': this.cell.y * 16 + 8 + this.getRoot().groundController.y
            }, 100, 'easeInCubic').play();
            
        } else {
            this.tweener.clear().wait(20 + 100).play();
        }
        
        //左右反転
        if (dir === Dir.Left) {
            this.body.scale.x = -1;
            this.skillEffect.position.set(-4, -17);
            this.body.image = 'mog_pick';
            this.anim.Play('pick');
        } else if (dir === Dir.Right) {
            this.body.scale.x = 1;
            this.body.image = 'mog_pick';
            this.skillEffect.position.set(5, -17);
            this.anim.Play('pick');
        } else if (dir === Dir.Down) {
            this.body.image = 'mog_pick_under';
            this.anim.Play('pick');
        }else {
            this.body.image = 'mog_pick_over';
            this.anim.Play('pick');
        }
        
        let tw = Tweener().attachTo(this);
        tw.wait(20).call(function() {
            this.target.GetGroundController().DugCell(dx, dy, dir);
        }).wait(80).call(function() {
            this.target.InitDugAfter();
        }).play();
        
    },
    
    'UpdateDug': function() {
        if (!this.requestLock && this.requestDir.v) {
            if (this.requestDir !== this.moveDir) {
                this.requestLock = true;
            }
        }
    },
    
    'InitDugAfter': function() {
        this.state = Player.State.DugAfter;
        this.tweener.clear().wait(300).call(function(){
            this.InitIdle();
        }.bind(this));
    },
    
    'InitPreDrill': function() {
        this.drillRequest = false;
        this.requestLock = false;
        this.state = Player.State.PreDrill;
        this.body.image = 'mog_predrill';
        this.anim.Play('predrill');
        this.tweener.clear().to({'y':this.y - 8}, 100).wait(300).call(function(){
            this.InitDrill();
        }.bind(this)).play();
        
        this.skillEffect.Play();
        
        EventManager.Fire('OnDrillStart');
    },
    
    'InitDrill': function() {
        this.state = Player.State.Drill;
        this.body.image = 'mog_drill';
        this.anim.Play('drill_fall');
        this.cell.y += 9; //9マス下に移動したことにする        
    },
    
    'UpdateDrill': function() {
        let g = this.GetGroundController();
        
        this.y += 9;
        let cy = Math.floor((this.y  - g.y) / 16);
        
        //左掘る
        if (this.cell.x > 0) {
            g.DugCell(this.cell.x - 1, cy, Dir.Right);
        }
        
        //中央掘る
        g.DugCell(this.cell.x, cy, Dir.Down);
        
        //右掘る
        if (this.cell.x < GroundController.Row) {
            g.DugCell(this.cell.x + 1, cy, Dir.Left);
        }
        
        if (cy >= this.cell.y) {
            this.ApplyPosition();
            this.InitDrillAfter();
        }
    },
    
    'InitDrillAfter': function() {
        this.state = Player.State.DrillAfter;
        this.body.image = 'mog_drill';
        this.anim.Play('drill_after');
        this.tweener.clear().wait(500).call(function(){
            this.InitIdle();
        }.bind(this));
    },
    
    'InitJetWait': function() {
        this.state = Player.State.JetWait;
        this.body.image = 'mog_prejet';
        this.anim.Play('prejet');
        this.skillEffect.position.set(0, 0);
        this.skillEffect.Play();
        
        this.requestCnt = 0;
        this.requestDir = Dir.Neutral;
        this.requestLock = false;
        this.drillRequest = false;
        
        EventManager.Fire('OnPlayerJetWaitStart');
        this.tweener.clear();
    },
    
    'UpdateJetWait': function() {
        if (this.requestDir.v) {
            this.InitJet();
        }
    },
    
    'InitJet': function() {
        this.state = Player.State.Jet;
        this.velocity.set(0, 0);
        this.body.image = 'mog_jet';
        this.anim.Play('jet');
        EventManager.Fire('OnPlayerJetStart');
    },
    
    'UpdateJet': function() {
        
        let ground = this.GetGroundController();
        let root = this.getRoot();
        let by = this.y;
        
        //左右移動
        this.velocity.x = 0;
        if (this.requestDir === Dir.Left) {
            this.velocity.x = -2;
            this.body.scale.x = -1;
        }
        else if (this.requestDir === Dir.Right) {
            this.velocity.x = 2;
            this.body.scale.x = 1;
        }
        
        //上昇
        this.velocity.y = -9;
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        //左右画面外に出ない
        if (this.x - 8 < 0) {
            this.x = 8;
        }
        if (this.x + 8 > PIXEL_CANVAS_WIDTH) {
            this.x = PIXEL_CANVAS_WIDTH - 8;
        }
        
        //マス座標割り出す
        let dy = Math.floor((this.y  - ground.y) / 16);
        
        //掘る
        if (dy >= 0) {
            let dxl = Math.floor((this.x - 7) / 16);
            let dxr = Math.floor((this.x + 7) / 16);
            if (0 <= dxl && dxl < GroundController.Row) {
                ground.DugCell(dxl, dy, Dir.Down);
            }
            if (0 <= dxr && dxr < GroundController.Row) {
                ground.DugCell(dxr, dy, Dir.Down);
            }
        }
        
        if (++this.jetSmokeCnt >= 2) {
            this.jetSmokeCnt = 0;
            root.smokeEffectController.Spawn(this.x - 8, this.y + 16);
            root.smokeEffectController.Spawn(this.x + 6, this.y + 16);
        }
        
        //イベント発生
        if (root.gameState === GameState.EscapeGame && dy < 0) {
            EventManager.Fire('OnPlayerEscape');
        }
        
        if (by > PIXEL_CANVAS_HEIGHT - 16 && this.y <= PIXEL_CANVAS_HEIGHT - 16) {
            EventManager.Fire('OnPlayerGroundUp');
        }
        
        if (this.y + this.height <= 0) {
            this.InitFree();
            EventManager.Fire('OnPlayerFlewAway')
        }
        
        this.requestDir = Dir.Neutral;
        
    },
    
    'InitFree': function() {
        this.state = Player.State.Free;
    },
    
    'OnTimeUp': function() {
        this.timeUpFlag = true;
    },
    
    
    '_static': {
        'State': {'Free':-1, 'Idle':0, 'Dug':1, 'DugAfter':2, 'PreDrill':3, 'Drill':4, 'DrillAfter': 5, 'JetWait':6, 'Jet':7},
    }
    
    /*
    ・4方向に対してアクションを受け付ける
    ・掘る時はDugCellを実行する
    ・状態遷移
    ・後隙キャンセルで掘る
    */
})

phina.define('GameTimer', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        this.remainTime = 0;
        this.runFlag = false;
        
        this.icon = PixelSprite('clock').addChildTo(this);
        this.icon.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.icon.origin.set(0, 0);
        this.icon.position.set(0 * PIXEL_SCALE, 0 * PIXEL_SCALE);
        
        this.label = CommonLabel({
            'text':'0',
            'fontSize':11 * PIXEL_SCALE
        }).addChildTo(this);
        this.label.position.set(13 * PIXEL_SCALE, -2 * PIXEL_SCALE);
        this.label.origin.set(0, 0);
        
    },
    
    'update': function() {
        if (!this.runFlag) return;
        
        this.remainTime -= Timer.deltaTime();
        if (this.remainTime <= 0) {
            this.remainTime = 0;
            this.stop();
            EventManager.Fire('OnTimeUp');
        }
        
        this.label.text = Math.ceil(this.remainTime);
        this.label.fill = this.remainTime >= 10 ? '#fff' : '#ff5050';
    },
    
    'reset': function(time) {
        this.remainTime = time;
        this.label.text = Math.ceil(this.remainTime);
        this.label.fill = this.remainTime >= 10 ? '#fff' : '#ff5050';
    },
    
    'start': function() {
        this.runFlag = true;
    },
    
    'stop': function() {
        this.runFlag = false;
    },
    
})

phina.define('VirtualKeyPad', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        //左キー
        this.vkeyLeft = VirtualKey('vkey', 43, 32).addChildTo(this);
        this.vkeyLeft.position.set(0, 16 * PIXEL_SCALE);
        this.vkeyLeft.origin.set(0, 0);
        this.vkeyLeft.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        
        //上キー
        this.vkeyUp = VirtualKey('vkey', 44, 24).addChildTo(this);
        this.vkeyUp.position.set(42 * PIXEL_SCALE, 1 * PIXEL_SCALE);
        this.vkeyUp.origin.set(0, 0);
        this.vkeyUp.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.vkeyUp.srcRect.y = 32 + 32;
        
        //下キー
        this.vkeyDown = VirtualKey('vkey', 44, 24).addChildTo(this);
        this.vkeyDown.position.set(42 * PIXEL_SCALE, 24 * PIXEL_SCALE);
        this.vkeyDown.origin.set(0, 0);
        this.vkeyDown.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.vkeyDown.srcRect.y = 32 + 32 + 24;
        
        //右キー
        this.vkeyRight = VirtualKey('vkey', 43, 32).addChildTo(this);
        this.vkeyRight.position.set((43 + 44 - 2) * PIXEL_SCALE, 16 * PIXEL_SCALE);
        this.vkeyRight.origin.set(0, 0);
        this.vkeyRight.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.vkeyRight.srcRect.y = 32;
        
        //スキルキー
        this.vkeySkill = VirtualKey('vkey', 43, 16).addChildTo(this);
        this.vkeySkill.position.set(0, 1 * PIXEL_SCALE);
        this.vkeySkill.origin.set(0, 0);
        this.vkeySkill.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.vkeySkill.srcRect.y = 32 + 32 + 24 + 24;
        
        //GO!キー
        this.vkeyGo = VirtualKey('vkey', 128, 32).addChildTo(this);
        this.vkeyGo.position.set(0, 16 * PIXEL_SCALE);
        this.vkeyGo.origin.set(0, 0);
        this.vkeyGo.scale.set(PIXEL_SCALE, PIXEL_SCALE);
        this.vkeyGo.srcRect.y = 32 + 32 + 24 + 24 + 16;
        
        this.vkeySkillFill = PixelSprite('vkey', 43, 16).addChildTo(this.vkeySkill);
        this.vkeySkillFill.origin.set(0, 0);
        this.vkeySkillFill.srcRect.y = 32 + 32 + 24 + 24;
        
        this.vkeySkillFlash = PixelSprite(
            PixelSprite.MaskTexture('vkey', '#666'), 43, 16
        ).addChildTo(this.vkeySkill);
        this.vkeySkillFlash.origin.set(0, 0);
        this.vkeySkillFlash.srcRect.set(0, this.vkeySkill.srcRect.y, 43, 16);
        this.vkeySkillFlash.blendMode = 'lighter';
        this.vkeySkillFlash.hide();
    },
    
    'update': function() {
        this.vkeySkillFlash.hide();
        if (this.flashFlag) {
            this.flashFlag = false;
            this.vkeySkillFlash.show();
        }
        
    },
    
    //全キーを無効化する
    'DisableAllKeys': function() {
        this.vkeyLeft.Disable();
        this.vkeyUp.Disable();
        this.vkeyRight.Disable();
        this.vkeyDown.Disable();
        this.vkeySkill.Disable();
        this.vkeyGo.Disable();
    },
    
    'flash': function() {
        this.flashFlag = true;
    },
    
    'SetSkillFillRate' : function(rate) {
        let w = Math.floor(43 * rate);
        this.vkeySkillFill.srcRect.width = w;
        this.vkeySkillFill.width = w;
    }
})

phina.define('SoilDustPiece', {
    'superClass': 'PixelSprite',
    'init': function() {
        this.superInit('piece');
        this.span = 0;
        this.velocity = Vector2(0, 0);
        
    },
    
    'update': function() {
        if (!this.visible) return;
        
        if (++this.span >= SoilDustPiece.SpanMax) {
            this.hide();
            return;
        }
        
        this.velocity.y += 1;
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        if (this.x < 0 || PIXEL_CANVAS_WIDTH < this.x) {
            this.hide();
        }
        
    },
    
    'spawn': function() {
        this.show();
        this.span = 0;
        this.velocity.set(0, -3);
    },
    
    '_static': {
        'SpanMax':30
    }
})

phina.define('SoilDustController', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        this.pieces = [];
        for (let i = 0; i < SoilDustController.PieceMax; ++i) {
            let piece = SoilDustPiece().addChildTo(this);
            piece.hide();
            this.pieces.push(piece);
        }
    },
    
    'spawn': function(x, y, dir, deep) {
        
        let speedMin = 5;
        let speedMax = 9;
        let degMin = 45;
        let degMax = 80;
        
        //プレイヤーが掘った方向
        switch(dir) {
            case Dir.Left: {
                speedMin = 5;
                speedMax = 9;
                degMin = 45;
                degMax = 80;
                
            } break;
                
            case Dir.Right: {
                speedMin = 5;
                speedMax = 9;
                degMin = 100;
                degMax = 135;
                
            } break;
                
            case Dir.Down: {
                speedMin = 5;
                speedMax = 9;
                degMin = 75;
                degMax = 105;
                
            } break;
        
            case Dir.Up: {
                speedMin = 1;
                speedMax = 3;
                degMin = 90 - 20;
                degMax = 90 + 20;
                
            } break;
                
            default: {
                
            } break;
        }
        
        for (let i = 0; i < 3; ++i) {
            let piece = this.getFreePiece();
            if (piece) {
                piece.spawn();
                piece.position.set(x, y);
                piece.image = deep ? 'piece_deep' : 'piece';
                let speed = Random.randint(speedMin, speedMax);
                let rad = Math.degToRad(Random.randint(degMin, degMax));
                piece.velocity.set(
                    Math.cos(rad) * speed,
                    -Math.sin(rad) * speed
                );
            }
        }
        
    },
    
    'getFreePiece': function() {
        for (let i = 0; i < this.pieces.length; ++i) {
            if (!this.pieces[i].visible) return this.pieces[i];
        }
        return null;
    },
    
    '_static': {
        'PieceMax': 15 * 3 //コントローラーが所持する粒の数
    }
})

phina.define('OreGetEffectController', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        this.effects = [];
        for (let i = 0; i < OreGetEffectController.Max; ++i) {
            let eff = OreGetEffect().addChildTo(this);
            eff.hide();
            this.effects.push(eff);
        }
    },
    
    'Spawn': function(x, y) {
        for (let i = 0; i < OreGetEffectController.Max; ++i) {
            if (this.effects[i].visible) continue;
            
            let eff = this.effects[i];
            eff.Spawn();
            eff.position.set(x, y);
            break;
        }
    },
    
    '_static': {
        'Max':20
    }
})

phina.define('OreGetEffect', {
    'superClass': 'PixelSprite',
    'init': function() {
        this.superInit('effect_ore', 18, 18);
        this.animCnt = 0;
        this.nextFrameCnt = 1;
        this.frame = 0;
        this.frameMax = 7;
        
        this.width = 16;
        this.height = 16;
    },
    
    'update': function() {
        if (!this.visible) return;
        
        if (++this.animCnt >= this.nextFrameCnt) {
            this.animCnt = 0;
            if (++this.frame >= this.frameMax) {
                this.hide();
            } else {
                this.srcRect.set(18 * this.frame, 0, 18, 18);
            }
        }
    },
    
    'Spawn': function() {
        this.animCnt = 0;
        this.frame = 0;
        this.show();
        this.srcRect.set(this.frame * 32, 0, 32, 32);
    }
    
    
})

phina.define('GlitterEffectController', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        this.effects = [];
        for (let i = 0; i < GlitterEffectController.Max; ++i) {
            let eff = GlitterEffect().addChildTo(this);
            eff.hide();
            this.effects.push(eff);
        }
    },
    
    'Spawn': function(x, y, delay) {
        for (let i = 0; i < GlitterEffectController.Max; ++i) {
            if (this.effects[i].visible) continue;
            
            let eff = this.effects[i];
            eff.Spawn(delay);
            eff.position.set(x, y);
            break;
        }
    },
    
    '_static': {
        'Max':30
    }
    
})

phina.define('GlitterEffect', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        this.body = PixelSprite('effect_glitter', 7, 7).addChildTo(this);
        
        this.animCnt = 0;
        this.nextFrameCnt = 2;
        this.frame = 0;
        this.frameMax = 5;
        this.delayCnt = 0;
    },
    
    'update': function() {
        if (!this.visible) return;
        
        if (this.delayCnt > 0) {
            if (--this.delayCnt <= 0) {
                this.body.show();
            }
            return;
        }        
        
        if (++this.animCnt >= this.nextFrameCnt) {
            this.animCnt = 0;
            if (++this.frame >= this.frameMax) {
                this.hide();
            } else {
                this.body.srcRect.set(7 * this.frame, 0, 7, 7);
            }
        }
    },
    
    'Spawn': function(delay) {
        this.animCnt = 0;
        this.frame = 0;
        this.delayCnt = delay;
        this.show();
        this.body.srcRect.set(this.frame * 7, 0, 7, 7);
        
        if (this.delayCnt > 0) {
            this.body.hide();
        } else {
            this.body.show();
        }
    }
})

phina.define('SmokeEffect', {
    'superClass': 'PixelSprite',
    'init': function() {
        this.superInit('smoke', 16, 16);
        this.frame = 0;
        this.srcRect.set(0, 0, 16, 16);
    },
    
    'update': function() {
        if (!this.visible) return;
        
        ++this.frame;
        this.srcRect.x = Math.floor(this.frame / 2) * 16;
        
        this.y += 2;
        
        if (this.frame >= 10) {
            this.hide();
        }
    },
    
    'Spawn':function(x, y) {
        this.show();
        this.frame = 0;
        this.srcRect.set(0, 0, 16, 16);
        let offset = Random.randint(-1, 2);
        this.position.set(x + offset, y);
        if (Random.randint(0, 1)) {
            this.scale.set(1, 1);
        }else {
            this.scale.set(-1, 1);
        }
    }
})

phina.define('SmokeEffectController', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        this.smokes = [];
        
        for (let i = 0; i < this.Max; ++i) {
            let smoke = SmokeEffect().addChildTo(this);
            smoke.hide();
            this.smokes.push(smoke);
        }
    },
    
    'Spawn': function(x, y) {
        for (let smoke of this.smokes) {
            if (smoke.visible) continue;
            smoke.Spawn(x, y);
            return;
        }
    },
    
    'Max': 30,
})

phina.define('SkillEffect', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        this.body = PixelSprite('effect_skill', 32, 32).addChildTo(this);
        this.body.hide();
        
        this.animCnt = 0;
        this.nextFrameCnt = 2;
        this.frame = 0;
        this.frameMax = 7;
    },
    
    'update': function() {
        if (!this.body.visible) return;
        
        if (++this.animCnt >= this.nextFrameCnt) {
            this.animCnt = 0;
            if (++this.frame >= this.frameMax) {
                this.body.hide();
            } else {
                this.body.srcRect.set(32 * this.frame, 0, 32, 32);
            }
        }
        
    },
    
    'Play': function() {
        this.animCnt = 0;
        this.frame = 0;
        this.body.srcRect.set(0, 0, 32, 32);
        this.body.show();
    }
})

phina.define('OreIconController', {
    'superClass': 'DisplayElement',
    'init': function() {
        this.superInit();
        
        this.icons = [];
        
        for (let i = 0; i < this.Max; ++i) {
            let icon = PixelSprite('ore_iron').addChildTo(this);
            icon.hide();
            this.icons.push(icon);
        }
        
    },
    
    'Spawn': function(type, x, y) {
        
        for (let i = 0; i < this.Max; ++i) {
            if (this.icons[i].visible) continue;
            
            let src = (function(){
                if (type === Bit.Iron) return 'ore_iron';
                else if (type === Bit.Gold) return 'ore_gold';
                else return 'ore_diamond';
            })();
        
            let icon = this.icons[i];
            icon.image = src;
            icon.position.set(x, y - 16);
            icon.show();
            
            let ms = (function(){
                if (type === Bit.Iron) return 200;
                else return 400;
            })();
            
            icon.tweener.clear().by({'y':+4}, 80).by({'y': -4}, 80).wait(ms).set({'visible':false}).play();
            
            return;
        }
        
    },
    
    'Max':20,
})

phina.define('NumberSprite', {
    'superClass': 'DisplayElement',
    'init': function(value) {
        this.superInit();
        
        this.sprites = [];
        
        this.SetValue(value);
    },
    
    'SetValue': function(value) {
        
        for (let sprite of this.sprites) {
            sprite.hide();
        }
        
        if ((typeof value) != 'string') {
            value = value.toString();
        }
        
        
        let x = 0;
        
        for (let i = 0; i < value.length; ++i) {
            let char = value[i];
            let n = char.charCodeAt() - '0'.charCodeAt();
            
            if (!this.sprites[i]) {
                let sprite = PixelSprite('numbers').addChildTo(this);
                sprite.origin.set(0, 0);
                this.sprites.push(sprite);
            }
            
            let width = NumberSprite.SrcX[n + 1] - NumberSprite.SrcX[n];
            this.sprites[i].show();
            this.sprites[i].x = x;
            this.sprites[i].srcRect.set(NumberSprite.SrcX[n], 0, width, 10);
            this.sprites[i].width = width;
            
            
            x += width - 1;
        }
    },
    
    _static: {
        'SrcX':[0,7,11,19,26,34,41,48,56,64,71]
    }
    
})



















