// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Main from "./main";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
    private speed : number = 0;
    private angle : number = 0;
    private ready = false;
    private _isMatch = false;
    private main : Main = null;

    public init(main : Main, speed : number, angle : number, isMatch : boolean){
        this.main = main;
        this.speed = speed;
        this.angle = angle;
        this._isMatch = isMatch;
        this.updateColor(isMatch);
        return this;
    }

    updateColor(isMatch : boolean){
        this.node.color = isMatch ? cc.Color.RED : cc.Color.BLACK;
    }

    get isMatch(){
        this.node.destroy();
        return this._isMatch;
    }

    play(){
        this.ready = true;
    }

    protected update(dt: number) {
        if(this.ready){
            this.node.x += this.speed * Math.cos(this.angle);
            this.node.y += this.speed * Math.sin(this.angle);

            let parentWidth = this.node.parent.width;
            let parentHeight = this.node.parent.height;
            let width = this.node.width;
            let height = this.node.height;
            if(this.node.x > parentWidth/2 - width/2 || this.node.x < -parentWidth/2 + width /2 ||
            this.node.y < -parentHeight/2 + height/2){
                this.node.destroy();
                this.main.handleEnemyDestroy();
            }
        }
    }
    
}
