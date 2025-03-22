import { Component } from "cc";
import { ConfigManager } from "../configs/ConfigManager";
import { IConfigAccessor } from "../configs/IConfigAccessor";
import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
import { ResURL } from "../res/ResURL";
import { ModuleManager } from "./ModuleManager";
import { IEventDispatcher } from "../events/IEventDispatcher";
import { ResRequest } from "../res/ResRequest";
import { RedPoint } from "../func/redPoint/RedPoint";


/**
 * 模块脚本基础类(模块脚本子类必须使用@ccclass('XXXModule'))
 */
export class Module extends Component implements IEventDispatcher {
    /**
     * 模块名称
     */
    module_name: string;
    /**
     * 引用的配置表
     */
    configs: Array<string>
    /**
     * 依赖的资源
     */
    assets: Array<ResURL>;
    /**
     * 依赖的模块
     */
    modules: Array<string>;
    /**
     * 永不删除
     */
    notReleased: boolean = false;

    /**
     * 资源请求对象
     */
    resRequest: ResRequest | null = null;
    /**
     * 是否初始化完毕
     */
    protected $inited: boolean = false;
    
    private __moduleIndex: number = 0;
    private __eventProxy: EventDispatcher;
    //红点检测器注册纪律
    private __redPoints: Map<number, () => boolean>;
    constructor() {
        super();
        this.__eventProxy = new EventDispatcher(this);
        this.__redPoints = new Map<number, () => boolean>();
    }

    /**
     * 前置初始化
     */
    preInit(): void {
        if (this.modules && this.modules.length > 0) {
            this.__moduleIndex = 0;
            ModuleManager.single.load(this.modules, undefined, (err: Error) => {
                if (err) {
                    throw new Error("模块初始化失败:" + err.message);
                }
                for (let index = 0; index < this.modules.length; index++) {
                    const clazz = this.modules[index];
                    const module = this.$getModule(clazz);
                    const proxy = ModuleManager.single.getModuleProxy(clazz);
                    //引用
                    proxy.addRef();
                    if (module.$inited) {
                        this.__moduleIndex++;
                    } else {
                        module.on(Event.COMPLETE, this.__otherModuleInitComplete, this);
                    }
                }
                //完成
                const total = this.modules ? this.modules.length : 0;
                // console.log(this.name, this.__moduleIndex + "/" + total);
                if (this.__moduleIndex > total) {
                    this.init();
                }
                this.on(Event.COMPLETE, this.__otherModuleInitComplete, this);
                this.selfInit();
            }, true);
        } else {
            this.on(Event.COMPLETE, this.__otherModuleInitComplete, this);
            this.selfInit();
        }
    }

    private __otherModuleInitComplete(e: Event): void {
        const module = e.target as Module;
        module.off(Event.COMPLETE, this.__otherModuleInitComplete, this);
        this.__moduleIndex++;
        const total = this.modules ? this.modules.length : 0;
        // console.log(this.name, this.__moduleIndex + "/" + total);
        //完成
        if (this.__moduleIndex > total) {
            this.init();
        }
    }

    /**自身初始化(子类重写并在初始化完成后调用selfInitComplete) */
    protected selfInit(): void {
        this.selfInitComplete();
    }

    /**
     * 自身初始化完成
     */
    protected selfInitComplete(): void {
        this.$inited = true;
        this.emit(Event.COMPLETE);
    }

    /**
     * 初始化
     */
    init(): void {

    }

    /**
     * 获取配置存取器
     * @param config 
     * @returns 
     */
    getConfigAccessor(config: string): IConfigAccessor {
        return ConfigManager.getAccessor(config);
    }

    /**
     * 获取模块
     * @param module_name 
     * @returns 
     */
    protected $getModule(module_name: string): Module {
        if (!this.modules || this.modules.indexOf(module_name) < 0) {
            throw new Error("模块不存在:" + module_name);
        }
        return ModuleManager.single.getModule(module_name)!;
    }

    /**
     * 注册红点检测器
     * @param id 
     * @param detector 
     */
    registerRedPoint(id: number, detector: () => boolean): void {
        this.__redPoints.set(id, detector);
        RedPoint.single.register(id, detector);
    }


    destroy(): boolean {
        //取消
        this.configs = null;
        //取消对模块的引用
        if (this.modules && this.modules.length > 0) {
            for (let index = 0; index < this.modules.length; index++) {
                const element = this.modules[index];
                ModuleManager.single.dispose(element);
            }
            this.modules = null;
        }
        this.notReleased = false;
        this.assets = null;
        if (this.resRequest) {
            this.resRequest.dispose();
            this.resRequest = null;
        }
        //红点
        for (const [key, _] of this.__redPoints) {
            RedPoint.single.unregister(key);
        }
        this.__redPoints.clear();
        this.__redPoints = null;

        this.$inited = false;
        this.__moduleIndex = 0;
        return super.destroy();
    }

    /**
     * 获取是否已初始化
     */
    get inited(): boolean {
        return this.$inited;
    }

    //=========================IEventDispatcher接口实现
    on(key: number | string, handler: (e: Event) => void, caller: any, priority?: number): void {
        this.__eventProxy.on(key, handler, caller, priority);
    }
    off(key: number | string, handler: (e: Event) => void, caller: any): void {
        this.__eventProxy.off(key, handler, caller);
    }
    offByCaller(caller: any): void {
        this.__eventProxy.offByCaller(caller);
    }
    offAllEvent(): void {
        this.__eventProxy.offAllEvent();
    }
    emit(key: number | string, data?: any): void {
        this.__eventProxy.emit(key, data);
    }
    hasEvent(key: number | string): boolean {
        return this.__eventProxy.hasEvent(key);
    }
    hasEventHandler(key: number | string, handler: (e: Event) => void, caller: any): boolean {
        return this.__eventProxy.hasEventHandler(key, handler, caller);
    }
}