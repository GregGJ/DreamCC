import { _decorator, Component, Node } from 'cc';
import { Injector } from 'dream-cc-core';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        Injector.inject('Main', this);
    }

    update(deltaTime: number) {
        console.log(Injector.getInject('Main'));
    }
}