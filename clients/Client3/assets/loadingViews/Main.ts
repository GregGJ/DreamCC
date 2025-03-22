import { _decorator, Component } from 'cc';
import { Res } from 'dream-cc-core';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        Res.loadAssetBundles(["games","Basics"]).then(
            (value) => {
                this.addComponent("Entrance");
                this.destroy();
            },
            (reason) => {
                console.log("加载公共AssetBundle失败!");
            }
        );
    }

    update(deltaTime: number) {

    }
}