import { Node } from "cc";
import { ITicker } from "../ticker/ITicker";
import { TickerManager } from "../ticker/TickerManager";
import { Timer } from "../timer/Timer";
import { Module } from "./Module";
import { ModuleProxy } from "./ModuleProxy";
import { ModuleRequest } from "./ModuleRequest";
import { Logger } from "../loggers/Logger";


/**
 * 模块管理器
 */
export class ModuleManager implements ITicker {
    /**
     * 模块节点(用于加载模块)
     */
    node: Node = new Node("ModuleManager");
    /**
     * 最大启动线程
     */
    static MAX_LOADER_THREAD: number = 5;
    /**
     * GC间隔时间
     */
    static GC_INTERVAL: number = 60;
    /**
     * 已加载的模块
     */
    private __modules: Map<string, ModuleProxy>;
    /**
     * 加载模块请求列表
     */
    private __requests: Map<string, Array<ModuleRequest>>;
    /**
     * 等待删除的模块
     */
    private __waitDeletes: Set<string>;

    private __lastGCTime: number = 0;
    constructor() {
        this.__modules = new Map<string, ModuleProxy>();
        this.__requests = new Map<string, Array<ModuleRequest>>();
        this.__waitDeletes = new Set<string>();
        TickerManager.addTicker(this);
    }

    tick(dt: number): void {
        let currentTime = Timer.currentTime;
        if (currentTime - this.__lastGCTime > ModuleManager.GC_INTERVAL) {
            for (const module_name of this.__waitDeletes) {
                let proxy = this.getModuleProxy(module_name);
                if (!proxy || !proxy.module || proxy.module.notReleased) continue;
                if (proxy.refCount <= 0) {
                    Logger.log("Module Destroy:" + proxy.module.name, Logger.TYPE.Module);
                    this.__modules.delete(module_name);
                    proxy.destroy();
                }
            }
            this.__waitDeletes.clear();
        }
    }

    /**
     * 加载
     * @param modules 
     * @param progress 
     * @param callback 
     * @param isSub
     */
    load(modules: Array<string>, progress?: (progress: number) => void, callback?: (err: Error) => void, isSub?: boolean): void {
        let request: ModuleRequest = new ModuleRequest(modules, progress, callback, isSub);
        this.__addRequest(request);
        request.load();
    }

    childComplete(module_name: string, proxy: ModuleProxy): void {
        //保存
        this.__modules.set(module_name, proxy);
        //通知
        let list = this.__requests.get(module_name);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.childComplete(module_name);
        }
        list.length = 0;
        this.__requests.delete(module_name);
    }

    childError(module_name: string, err: Error): void {
        let list = this.__requests.get(module_name);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.childError(module_name, err);
        }
        //复制
        let clist = list.concat();
        //清除掉关联的所有资源请求
        for (let index = 0; index < clist.length; index++) {
            const request = clist[index];
            this.__removeRequest(request);
            //销毁
            request.destroy();
        }
    }

    childProgress(module_name: string, progress: number): void {
        let list = this.__requests.get(module_name);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.childProgress(module_name, progress);
        }
    }

    private __addRequest(request: ModuleRequest): void {
        let list: Array<ModuleRequest>;
        for (let index = 0; index < request.modules.length; index++) {
            const module = request.modules[index];
            if (!this.__requests.has(module)) {
                list = [];
                this.__requests.set(module, list);
            } else {
                list = this.__requests.get(module);
            }
            list.push(request);
        }
    }

    private __removeRequest(request: ModuleRequest): void {
        let list: Array<ModuleRequest>;
        let findex: number = 0;
        //遍历当前请求的所有
        for (let index = 0; index < request.modules.length; index++) {
            const module = request.modules[index];
            //从列表中找出并删除
            list = this.__requests.get(module);
            findex = list.indexOf(request);
            if (findex >= 0) {
                list.splice(findex, 1);
            }
        }
    }

    /**
     * 获取代理(内部接口，请勿使用)
     * @param module_name 
     * @returns 
     */
    getModuleProxy(module_name: string): ModuleProxy {
        if (!this.__modules.has(module_name)) {
            return null;
        }
        return this.__modules.get(module_name);
    }

    /**
     * 获取服务(内部接口，请勿使用)
     * @param module_name 
     */
    getModule(module_name: string): Module | null {
        let proxy = this.getModuleProxy(module_name);
        if (proxy == null) {
            return null;
        }
        return proxy.module;
    }

    /**
     * 尝试销毁服务
     * @param clazz
     */
    dispose(module_name: string): void {
        let proxy = this.__modules.get(module_name);
        proxy.removeRef();
        this.__waitDeletes.add(module_name);
    }
    
    private static __instance: ModuleManager;
    static get single(): ModuleManager {
        if (!this.__instance) {
            this.__instance = new ModuleManager();
        }
        return this.__instance;
    }
}