// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Enemy from "./enemy";
import Player from "./player";

const {ccclass, property} = cc._decorator;

const SPEED_PLAYER = 5;
const SPEED_ENEMY = 3;
const GENERATE_ENEMY_DURATION = 0.5;
const START_ENEMY = 3;

export const PLAYER_TAG = 1;
export const ENEMY_TAG = 2;

@ccclass
export default class Main extends cc.Component {
    @property(cc.Label)
    lblScore: cc.Label = null;
    @property(Player)
    player : Player = null;
    @property(cc.Node)
    enemyNode : cc.Node = null;
    @property(cc.Node)
    board : cc.Node = null;

    @property(cc.Node)
    btnPlay : cc.Node = null;
    @property(cc.Node)
    btnRestart : cc.Node = null;

    private score : number = 0;
    private isStart = false;

    protected onLoad(): void {
        cc.director.getCollisionManager().enabled = true;
        this.lblScore.string = "0";
        this.player.init(this, SPEED_PLAYER);
    }

    playNow(){
        this.player.play();
        for(let i = 0; i < START_ENEMY; i++){
            this.scheduleOnce(()=>{
                this.generateEnemy();
            }, GENERATE_ENEMY_DURATION * i);
        }
        this.isStart = true;
        this.btnPlay.active = false;
    }

    restart(){
        this.score = 0;
        this.lblScore.string = "0";
        this.btnRestart.active = false;
        this.playNow();
    }

    handleEnemyContact(isMatch : boolean){
        if(!this.isStart) return;
        if(!isMatch){
            this.gameOver();
        }else{
            this.score += 1;
            this.lblScore.string = this.score + "";
        }
    }

    handleEnemyDestroy(){
        if(!this.isStart) return;
        this.generateEnemy();
    }

    gameOver(){
        console.log("game over");
        this.isStart = false;
        this.btnRestart.active = true;
        for(let child of this.board.children){
            child.destroy();
        }
    }

    generateEnemy(){
        let node = cc.instantiate(this.enemyNode);
        node.active = true;
        node.parent = this.board;

        let width = this.node.width;
        let height = this.node.height;
        let sliderWidth = this.player.node.parent.width;
        let x = Math.random() * width - width/2;
        let y = height * 0.5 * 0.2 + Math.random() * (height * 0.5 - height * 0.5 * 0.2);
        node.x = x;
        node.y = y;

        let targetX = Math.random() * sliderWidth - sliderWidth/2;
        let targetY = 0;

        let angle = Math.atan2(targetY - y, targetX - x);

        let enemy = node.getComponent(Enemy);
        let isMatch = Math.random() < 0.5
        enemy.init(this, SPEED_ENEMY, angle, isMatch).play();
        return node; 
    }

    protected onEnable(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    }

    protected onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    }

    touchStart(event : any){
        if(!this.isStart) return;
        if(this.player){
            this.player.revertDirection();
        }
    }

    // update (dt) {}
}
