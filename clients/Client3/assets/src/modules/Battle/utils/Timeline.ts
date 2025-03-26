



/**
 * 时间轴
 */
export class Timeline {

    private __time: number = 0;

    constructor() {

    }

    tick(dt: number): void {
        this.__time += dt;
    }

    /**
     * 增加时间
     * @param time 
     */
    add(time: number): void {
        this.__time += time;
    }

    reset(): void {
        this.__time = 0;
    }
    
    get currentTime(): number {
        return this.__time;
    }

    private static _instance: Timeline;
    /**
     * 单例
     */
    static get single(): Timeline {
        if (!this._instance) {
            this._instance = new Timeline();
        }
        return this._instance;
    }
}