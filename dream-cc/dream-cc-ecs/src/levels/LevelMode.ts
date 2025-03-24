import { Node } from "cc";
import { Level } from "./Level";
import { LevelModeScript } from "./LevelModeScript";
import { Event, EventDispatcher, Res, ResRequest, ResURL } from "dream-cc-core";
import { ECSWorld } from "../core/ECSWorld";


/**
 * 关卡模式基类
 */
export abstract class LevelMode extends EventDispatcher {

    level: Level;

    /**
     * 需要注册的配置表存取器
     */
    configs: Array<string>;

    reqeust: ResRequest | null = null;

    /**脚本 */
    private __scripts: Map<new () => LevelModeScript, LevelModeScript>;

    /**数据 */
    protected $data: any;
    /**初始化数据*/
    protected $initData: any;
    /**初始化完成 */
    protected $inited: boolean = false;

    constructor() {
        super();
        this.__scripts = new Map<new () => LevelModeScript, LevelModeScript>();
    }

    /**
     * 数据
     */
    get data(): any {
        return this.$data;
    }

    /**
     * 初始化数据
     */
    get initData(): any {
        return this.$initData;
    }

    /**
     * 初始化
     */
    init(...arg: any[]): void {
        this.$initData = arg;
        //配置表
        let urls: Array<ResURL> = [];
        if (this.configs && this.configs.length > 0) {
            for (let index = 0; index < this.configs.length; index++) {
                const element = this.configs[index];
                const url = Res.sheet2URL(element);
                urls.push(url);
            }
        }
        if (urls.length <= 0) {
            this.$init();
        } else {
            //加载
            this.reqeust = Res.create(
                urls,
                "LevelMode",
                (progress: number) => {
                    this.emit(Event.PROGRESS, "LevelMode", undefined, progress * 0.7);
                },
                (err?: Error) => {
                    if (err) {
                        this.reqeust.dispose();
                        this.reqeust = null;
                        this.emit(Event.ERROR, "LevelMode", err);
                        return;
                    }
                    this.$init();
                }
            );
            this.reqeust.load();
        }
    }

    /**
     * 初始化,如果不调用super.$init的话，请在完成初始化后调用$initComplete()方法。
     */
    protected $init(): void {
        this.$initComplete();
    }

    /**
     * 初始化完成
     */
    protected $initComplete(): void {
        for (const element of this.__scripts.values()) {
            element.init();
        }
        this.$inited = true;
        this.emit(Event.COMPLETE);
    }

    /**
     * 心跳
     * @param dt 
     */
    tick(dt: number): void {
        if (this.$inited) {
            this.__scripts.forEach((value, key) => {
                value.tick(dt);
            });
        }
    }

    /**
     * 添加脚本
     * @param type 
     */
    addScript<T extends LevelModeScript>(type: new () => T): T | null {
        if (type == null) {
            return null;
        }
        if (this.__scripts.has(type)) {
            throw new Error("重复添加脚本:" + type);
        }
        let value = new type();
        value.mode = this;
        this.__scripts.set(type, value);
        return value;
    }

    /**
     * 删除脚本
     * @param type 
     * @returns 
     */
    removeScript<T extends LevelModeScript>(type: new () => T): T | null {
        if (!this.__scripts.has(type)) {
            throw new Error("脚本不存在!");
        }
        let result = this.__scripts.get(type);
        result.mode = null;
        this.__scripts.delete(type);
        return result as T;
    }

    /**
     * 移除所有脚本
     */
    removeAllScript(): void {
        this.__scripts.forEach((value) => {
            value.destroy();
        });
        this.__scripts.clear();
    }

    /**
     * 获取脚本
     * @param type 
     * @returns 
     */
    getScript<T extends LevelModeScript>(type: new () => T): T | null {
        if (!this.__scripts.has(type)) {
            return null;
        }
        return this.__scripts.get(type) as T;
    }

    destroy(): boolean {
        if (super.destroy()) {

            if (this.configs) {
                this.configs.splice(0, this.configs.length);
                this.configs = null;
            }

            if (this.__scripts) {
                this.__scripts.forEach((value) => {
                    value.destroy();
                });
                this.__scripts = null;
            }
            if (this.reqeust) {
                this.reqeust.dispose();
                this.reqeust = null;
            }
            return true;
        }
        return false;
    }

    /**
     * 世界
     */
    get world(): ECSWorld {
        return this.level.world;
    }

    /**
     * 根节点
     */
    get root(): Node {
        return this.level.root;
    }
}