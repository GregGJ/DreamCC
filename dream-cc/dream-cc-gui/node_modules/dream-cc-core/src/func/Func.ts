import { DEBUG } from "cc/env";
import { FuncNode } from "./FuncNode";
import { IFuncData } from "./IFuncData";
import { IFuncConfig } from "./IFuncConfig";
import { EventDispatcher } from "../events/EventDispatcher";
import { Event } from "../events/Event";




/**
 * 功能开放
 */
export class Func extends EventDispatcher {

    /**
     * 节点检测函数
     */
    checkFunc: (value: FuncNode) => boolean = (value: FuncNode) => {
        if (!value.server) {
            return false;
        }
        return true;
    }

    private __funcs = new Map<number, FuncNode>();

    constructor() {
        super();
    }

    /**
     * 初始化
     * @param configs 
     */
    init(configs: Array<IFuncConfig>): void {
        for (let index = 0; index < configs.length; index++) {
            const config = configs[index];
            let node = this.__createNode(config.id, config);
            this.__funcs.set(config.id, node);
        }
        for (let index = 0; index < configs.length; index++) {
            const config = configs[index];
            if (config.id == config.parent) {
                continue;
            }
            let node = this.__funcs.get(config.id);
            let parent = this.__funcs.get(config.parent);
            node.parent = parent;
            parent.addChild(node);
        }
        //调试模式下检测循环引用
        if (DEBUG) {
            let parents: Array<number> = [];
            for (let index = 0; index < configs.length; index++) {
                const config = configs[index];
                let node = this.__funcs.get(config.id);
                parents.splice(0, parents.length);
                this.__checkCircularReference(node, parents);
            }
        }
    }

    /**
     * 更新
     * @param server 
     */
    update(server: IFuncData | Array<IFuncData>): void {
        if (Array.isArray(server)) {
            for (let index = 0; index < server.length; index++) {
                const element = server[index];
                this.__update(element);
            }
        } else {
            this.__update(server);
        }
    }

    private __update(server: IFuncData): void {
        let node = this.__funcs.get(server.id);
        node.update(server);
        this.emit(Event.UPDATE, node);
    }

    /**
     * 检测循环引用
     * @param node 
     * @param parents 
     */
    private __checkCircularReference(node: FuncNode, parents: Array<number>): void {
        if (parents.indexOf(node.id) >= 0) {
            throw new Error(`节点${node.id}存在循环引用`);
        } else {
            parents.push(node.id);
            for (let index = 0; index < node.children.length; index++) {
                const childNode = node.children[index];
                this.__checkCircularReference(childNode, parents);
            }
        }
    }


    /**
     * 创建节点
     * @param id 
     * @param config 
     * @returns 
     */
    private __createNode(id: number, config: any): FuncNode {
        let result = new FuncNode(id);
        result.config = config;
        return result;
    }

    /**
     * 获取功能节点
     * @param id 
     */
    getNode(id: number): FuncNode {
        return this.__funcs.get(id);
    }

    private static __instance: Func;
    static get single(): Func {
        if (!this.__instance) {
            this.__instance = new Func();
        }
        return this.__instance;
    }
}