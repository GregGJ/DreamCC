import { Event, EventDispatcher, Logger } from "dream-cc-core";
import { IState } from "./IState";


/**
 * 状态机
 */
export class FSM extends EventDispatcher {


    /**所属*/
    owner: any;
    debug: boolean;

    private __current: IState;
    private __state: number;
    private __states: Map<number, IState>;
    private __name: string
    constructor(owner: any, name: string) {
        super();
        this.owner = owner;
        this.__name = name;
        this.__states = new Map<number, IState>();
    }

    tick(dt: number): void {
        if (this.__current) {
            this.__current.tick(dt);
        }
    }

    /**
     * 添加
     * @param key 
     * @param v 
     */
    addState(key: number, v: IState): void {
        this.__states.set(key, v);
        v.init(this);
    }

    /**
     * 切换状态
     * @param value 
     * @param data 
     * @returns 
     */
    switchState(value: number, data?: any): void {
        if (this.__state == value) {
            return;
        }
        let oldKey = this.__state;
        let old: IState = this.__current;
        if (old) {
            if (this.debug) {
                Logger.log(this.__name + " 所属:" + this.owner.name + " 退出状态==>" + this.__current.name, "FSM");
            }
            old.exit();
        }
        this.__current = null;
        if (!this.__states.has(value)) {
            throw new Error("状态机:" + this.__name + " 所属:" + this.owner.name + "未找到状态==>" + value);
        }
        this.__state = value;
        this.__current = this.__states.get(value);
        if (this.debug) {
            Logger.log(this.__name + " 所属:" + this.owner.name + " 进入状态==>" + this.__current.name, "FSM");
        }
        this.__current.enter(data);
        this.emit(Event.STATE_CHANGED, oldKey);
    }

    get state(): number {
        return this.__state;
    }

    get current(): IState {
        return this.__current;
    }

    destroy(): boolean {
        if (super.destroy()) {
            if (this.__current) {
                this.__current.exit();
            }
            this.__states.forEach(element => {
                element.destroy();
            });
            this.__states.clear();
            return true;
        }
        return false;
    }
}
