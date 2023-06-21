// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Enemy from "./enemy";
import Main, { ENEMY_TAG } from "./main";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    private main : Main = null;
    private speed : number = 0;
    private ready = false;
    public init(main : Main, speed : number){
        this.main = main;
        this.speed = speed;
        return this;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ENEMY_TAG) {
            console.log("contact xxxxx");
            let node = other.node;
            let enemy = node.getComponent(Enemy);
            let isMatch = enemy.isMatch;
            this.main.handleEnemyContact(isMatch);
        }
    }

    play(){
        this.ready = true;
    }

    revertDirection(){
        this.speed *= -1;
    }

    protected update(dt: number) {
        if(this.ready){
            this.node.x += this.speed;
            let viewWidth = this.node.parent.width /2;
            let width = this.node.width;
            if(this.node.x >  viewWidth - width/2 || this.node.x < -viewWidth + width/2){
                this.revertDirection();
            }
        }
    }
}
