import { DEBUG } from "cc/env";
import { ITicker } from "../../ticker/ITicker";
import { TickerManager } from "../../ticker/TickerManager";
import { RedPointNode } from "./RedPointNode";
import { IRedPointData } from "./IRedPointData";
import { IFuncConfig } from "../IFuncConfig";




export class RedPoint implements ITicker {

    /**每帧运行检测器数量 */
    static FRAME_RUN_COUNT: number = 2;

    private __redPoints = new Map<number, RedPointNode>();
    private __detectors = new Map<number, () => boolean>();
    private __waiting = new Set<number>();
    private __frameRunList: Array<number> = [];

    constructor() {
        TickerManager.addTicker(this);
    }

    tick(dt: number): void {
        if (this.__waiting.size == 0) {
            return;
        }
        let index: number = 0;
        for (const id of this.__waiting) {
            let detector = this.__detectors.get(id);
            let isActive = detector();
            let node = this.__redPoints.get(id);
            node.isActive = isActive;
            this.__frameRunList.push(id);
            if (index > RedPoint.FRAME_RUN_COUNT) {
                break;
            }
            index++;
        }
        for (let index = 0; index < this.__frameRunList.length; index++) {
            const id = this.__frameRunList[index];
            this.__waiting.delete(id);
        }
        this.__frameRunList.splice(0, this.__frameRunList.length);
    }

    /**
     * 注册红点检测器(内部接口，开发时请使用Module上的registerRedPoint方法)
     * @param id 
     * @param detector 
     */
    register(id: number, detector: () => boolean): void {
        if (this.__detectors.has(id)) {
            throw new Error(`重复注册红点检测${id}`);
        }
        this.__detectors.set(id, detector);
    }

    /**
     * 注销红点检测器
     * @param id 
     */
    unregister(id: number): void {
        this.__detectors.delete(id);
    }

    /**
     * 请求检测
     * @param id 
     */
    request(id: number): void {
        if (!this.__detectors.has(id)) {
            throw new Error(`检测器${id}不存在`);
        }
        this.__waiting.add(id);
    }

    /**
     * 初始化红点结构体
     * @param config 
     */
    createByConfig(configs: Array<IFuncConfig>): void {
        for (let index = 0; index < configs.length; index++) {
            const config = configs[index];
            let node = this.__createNode(config.id);
            this.__redPoints.set(config.id, node);
        }
        for (let index = 0; index < configs.length; index++) {
            const config = configs[index];
            if (config.id == config.parent) {
                continue;
            }
            let node = this.__redPoints.get(config.id);
            let parent = this.__redPoints.get(config.parent);
            node.parent = parent;
            parent.addChild(node);
        }
        //调试模式下检测循环引用
        if (DEBUG) {
            let parents: Array<number> = [];
            for (let index = 0; index < configs.length; index++) {
                const config = configs[index];
                let node = this.__redPoints.get(config.id);
                parents.splice(0, parents.length);
                this.checkCircularReference(node, parents);
            }
        }
    }

    /**
     * 通过数据创建节点
     * @param data 
     * @returns 
     */
    createByData(data: IRedPointData): RedPointNode {
        let node = new RedPointNode(data.id);
        for (const child of data.children) {
            if (typeof child == "number") {
                let childNode: RedPointNode;
                if (this.__redPoints.has(child)) {
                    childNode = this.__redPoints.get(child);
                } else {
                    childNode = new RedPointNode(child);
                }
                node.addChild(childNode);
            } else {
                let childData: IRedPointData = <IRedPointData>child;
                let childNode = this.createByData(childData);
                node.addChild(childNode);
            }
        }
        return node;
    }

    /**
     * 创建节点
     * @param id 
     * @param children 
     * @returns 
     */
    create(id: number, children: Array<number>): RedPointNode {
        if (this.__redPoints.has(id)) {
            throw new Error(`节点${id}已存在`);
        }
        let node = new RedPointNode(id);
        for (let index = 0; index < children.length; index++) {
            const childID = children[index];
            if (childID == id) {
                throw new Error(`节点${id}不能包含自己`);
            }
            let childNode: RedPointNode;
            if (this.__redPoints.has(childID)) {
                childNode = this.__redPoints.get(childID);
            } else {
                childNode = this.__createNode(childID);
            }
            node.addChild(childNode);
        }
        this.__redPoints.set(id, node);
        //调试模式下检测循环引用
        if (DEBUG) {
            let parents: Array<number> = [];
            this.checkCircularReference(node, parents);
        }
        return node;
    }

    /**
     * 创建叶子节点
     * @param id 
     * @returns 
     */
    private __createNode(id: number): RedPointNode {
        let node = new RedPointNode(id);
        this.__redPoints.set(id, node);
        return node;
    }

    /**
     * 检测循环引用
     * @param node 
     * @param parents 
     */
    checkCircularReference(node: RedPointNode, parents: Array<number>): void {
        if (parents.indexOf(node.id) >= 0) {
            throw new Error(`节点${node.id}存在循环引用`);
        } else {
            parents.push(node.id);
            for (let index = 0; index < node.children.length; index++) {
                const childNode = node.children[index];
                if (childNode.children.length > 0) {
                    this.checkCircularReference(childNode, parents);
                }
            }
        }
    }

    /**
     * 获取红点节点
     * @param id 
     * @returns 
     */
    getNode(id: number): RedPointNode {
        return this.__redPoints.get(id);
    }

    private static __instance: RedPoint;
    static get single(): RedPoint {
        if (this.__instance) {
            this.__instance = new RedPoint();
        }
        return this.__instance;
    }
}