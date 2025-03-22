import { Event } from "../../events/Event";
import { EventDispatcher } from "../../events/EventDispatcher";
import { TickerManager } from "../../ticker/TickerManager";



/**
 * 红点节点
 */
export class RedPointNode extends EventDispatcher {

    id: number;

    parent: RedPointNode | null = null;

    private __children: RedPointNode[];
    private __isActive: boolean = false;

    constructor(id: number) {
        super();
        this.id = id;
        this.__children = [];
    }

    /**
     * 添加子节点
     * @param node 
     */
    addChild(node: RedPointNode) {
        this.__children = this.__children || [];
        node.parent = this;
        this.__children.push(node);
        this.childrenChanged();
    }

    /**
     * 删除子节点
     * @param node
     */
    removeChild(node: RedPointNode) {
        this.__children = this.__children || [];
        node.parent = null;
        const index = this.__children.indexOf(node);
        if (index !== -1) {
            this.__children.splice(index, 1);
        }
        this.childrenChanged();
    }

    get children(): RedPointNode[] {
        return this.__children;
    }

    set isActive(value: boolean) {
        this.__isActive = value;
        // 通知父节点
        if (this.parent) {
            this.parent.childrenChanged();
        }
        this.emit(Event.UPDATE);
    }

    /**
     * 子节点改变
     */
    childrenChanged(): void {
        TickerManager.callNextFrame(this.__childrenChanged, this);
    }
    
    private __childrenChanged() {
        let active = false;
        for (let index = 0; index < this.__children.length; index++) {
            const node = this.__children[index];
            if (node.isActive) {
                active = true;
                break;
            }
        }
        this.isActive = active;
    }

    get isActive(): boolean {
        return this.__isActive;
    }
}