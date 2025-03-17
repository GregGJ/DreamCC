import { Dictionary } from "../containers/Dictionary";
import { Event } from "../events/Event";
import { Pool } from "../pools/Pool";
import { TickerManager } from "../ticker/TickerManager";
import { ModuleLoader } from "./ModuleLoader";
import { ModuleManager } from "./ModuleManager";



/**
 * 模块加载队列
 */
export class ModuleQueue {

    /**
     * 正在加载的模块
     */
    private running: Dictionary<string, ModuleLoader> = new Dictionary<string, ModuleLoader>();
    /**
     * 等待加载的模块
     */
    private waiting: Array<string> = [];

    constructor() {
        TickerManager.addTicker(this);
    }

    load(module_name: string, isSub: boolean): void {
        if (this.running.has(module_name)) {
            return;
        }
        let idx = this.waiting.indexOf(module_name)
        if (isSub && idx >= 0) {
            this.waiting.splice(idx, 1);
            this.__startLoad(module_name);
            return;
        }
        //已经在等待列表中
        if (idx >= 0) {
            return;
        }
        this.waiting.push(module_name);
    }

    tick(dt: number): void {
        while (this.running.size < ModuleManager.MAX_LOADER_THREAD && this.waiting.length > 0) {
            const module = this.waiting.shift();
            this.__startLoad(module);
        }
    }

    private __startLoad(module_name: string): void {
        let loader: ModuleLoader = Pool.acquire(ModuleLoader);
        this.running.set(module_name, loader);
        this.__addEvent(loader);
        loader.load(module_name);
    }

    private __addEvent(target: ModuleLoader): void {
        target.on(Event.COMPLETE, this.__eventHandler, this);
        target.on(Event.ERROR, this.__eventHandler, this);
        target.on(Event.PROGRESS, this.__eventHandler, this);
    }

    private __eventHandler(evt: Event): void {
        let target: ModuleLoader = evt.target as ModuleLoader;
        if (evt.type == Event.PROGRESS) {
            ModuleManager.single.childProgress(evt.data, evt.progress);
            return;
        }
        target.offAllEvent();
        if (evt.type == Event.ERROR) {
            this.running.delete(evt.data);
            ModuleManager.single.childError(evt.data, evt.error);
            return;
        }
        if (evt.type == Event.COMPLETE) {
            this.running.delete(evt.data.module);
            ModuleManager.single.childComplete(evt.data.module, evt.data.proxy);
            target.reset();
            Pool.release(ModuleLoader, target);
        }
    }

    private static instance: ModuleQueue;
    static get single(): ModuleQueue {
        if (this.instance == null) {
            this.instance = new ModuleQueue();
        }
        return this.instance;
    }
}