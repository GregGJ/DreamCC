import { AssetManager, assetManager } from "cc";
import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
import { Res } from "../res/Res";
import { ResURL } from "../res/ResURL";
import { Module } from "./Module";
import { ModuleManager } from "./ModuleManager";
import { ModuleProxy } from "./ModuleProxy";
import { ResRequest } from "../res/ResRequest";
import { Logger } from "../loggers/Logger";



/**
 * 模块加载器
 */
export class ModuleLoader extends EventDispatcher {

    /**
     * 模块名称
     */
    module_name: string;
    /**
     * 模块实例
     */
    module: Module;
    /**
     * 资源请求对象
     */
    resRequest: ResRequest | null = null;

    constructor() {
        super();
    }

    load(module_name: string): void {
        this.module_name = module_name;
        //如果已经存在
        let module = ModuleManager.single.node.getComponent("Module_" + this.module_name);
        if (module) {
            if (!(module instanceof Module)) {
                throw new Error("模块Module_" + this.module_name + "必须继承Module类");
            }
            this.module = module as Module;
            this.__initModule();
        } else {
            Logger.log("Start Load Module:" + this.module_name);
            let bundle = assetManager.getBundle(module_name);
            if (!bundle) {
                assetManager.loadBundle(module_name, this.__bundleLoaded.bind(this));
            } else {
                this.__bundleLoaded(null, bundle);
            }
        }
    }

    private __bundleLoaded(err: Error, bundle: AssetManager.Bundle): void {
        if (err) {
            this.emit(Event.ERROR, this.module_name, new Error("AssetBundle:" + this.module_name + "不存在！"));
            return;
        }
        try {
            this.module = ModuleManager.single.node.addComponent("Module_" + this.module_name) as Module;
        } catch (error) {
            throw new Error("模块Module_" + this.module_name + "初始化报错:" + error);
        }
        this.module.module_name = this.module_name;
        if (!this.module) {
            throw new Error("模块类Module_" + this.module_name + "不存在！");
        }
        if (!(this.module instanceof Module)) {
            throw new Error("模块Module_" + this.module_name + "必须继承Module类");
        }
        try {
            this.__initModule();
        } catch (error) {
            Logger.error("Load Module Error:" + this.module_name);
        }
    }

    private __initModule(): void {
        //配置表
        let urls: Array<ResURL> = [];
        if (this.module.configs && this.module.configs.length > 0) {
            for (let index = 0; index < this.module.configs.length; index++) {
                const sheet_name = this.module.configs[index];
                const url = Res.sheet2URL(sheet_name);
                urls.push(url);
            }
        }
        //引用的资源
        if (this.module.assets && this.module.assets.length > 0) {
            for (let index = 0; index < this.module.assets.length; index++) {
                const element = this.module.assets[index];
                urls.push(element);
            }
        }
        if (urls.length > 0) {
            //加载
            this.resRequest = Res.create(
                urls,
                this.module.name,
                (progress: number) => {
                    this.emit(Event.PROGRESS, this.module_name, undefined, progress * 0.7);
                },
                (err?: Error) => {
                    if (err) {
                        this.resRequest.dispose();
                        this.resRequest = null;
                        this.emit(Event.ERROR, this.module_name, err)
                        return;
                    }
                    this.__assetReady();
                }
            );
            this.resRequest.load();
        } else {
            this.__assetReady();
        }
    }

    /**
     * 依赖的配置与资源准备完毕
     */
    protected __assetReady(): void {
        this.module.resRequest = this.resRequest;
        this.module.preInit();
        let proxy = new ModuleProxy(this.module);
        this.emit(Event.COMPLETE, { module: this.module_name, proxy });
    }

    reset(): void {
        this.module_name = null;
        this.module = null;
    }
}