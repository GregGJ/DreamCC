import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
import { Func } from "./Func";
import { IFuncConfig } from "./IFuncConfig";
import { IFuncData } from "./IFuncData";



/**
 * 功能开放叶子节点
 */
export class FuncNode extends EventDispatcher {

    id: number;
    parent: FuncNode;
    config: IFuncConfig;
    server: IFuncData;

    private __isActive: boolean = false;
    private __children: FuncNode[] = [];

    constructor(id: number) {
        super();
        this.id = id;
    }

    addChild(node: FuncNode): void {
        node.parent = this;
        this.__children.push(node);
    }

    removeChild(node: FuncNode): void {
        let index = this.__children.indexOf(node);
        if (index > -1) {
            this.__children.splice(index, 1);
            node.parent = null;
        }
    }

    get children(): FuncNode[] {
        return this.__children;
    }

    update(server: IFuncData): void {
        this.server = server;
        let slefActive = Func.single.checkFunc(this);
        if (!slefActive) {
            this.isActive = false;
            return;
        }
        let parent = this.parent;
        while (parent) {
            if (!parent.isActive) {
                this.isActive = false;
                break;
            }
            parent = parent.parent;
        }
        this.isActive = true;
        for (let index = 0; index < this.__children.length; index++) {
            const child = this.__children[index];
            child.update(child.server);
        }
    }

    set isActive(value: boolean) {
        if (this.__isActive == value) return;
        this.__isActive = value;
        this.emit(Event.UPDATE);
    }

    get isActive(): boolean {
        return false;
    }
}