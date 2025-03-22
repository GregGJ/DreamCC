import { game } from "cc";
import { ITicker } from "../ticker/ITicker";
import { ITimer } from "./ITimer";
import { TickerManager } from "../ticker/TickerManager";


export class TimerImpl implements ITimer, ITicker {

    private __currentTime: number = 0;
    private __deltaTime: number = 0;
    private __startTime: number = 0;
    constructor() {
        this.reset();
        TickerManager.addTicker(this);
    }

    reset(time?: number): void {
        if (time) {
            this.__currentTime = time;
        } else {
            //当前时间转秒
            this.__currentTime = game.totalTime;
        }
        this.__startTime = this.__currentTime;
    }

    tick(dt: number): void {
        this.__deltaTime = dt;
        this.__currentTime += dt;
    }

    get currentTime(): number {
        return this.__currentTime;
    }

    get absTime(): number {
        return this.__startTime + game.totalTime;
    }
    
    get deltaTime(): number {
        return this.__deltaTime;
    }
}