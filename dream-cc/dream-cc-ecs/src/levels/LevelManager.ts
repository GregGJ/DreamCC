import { Node } from "cc";
import { Level } from "./Level";
import { LevelMode } from "./LevelMode";
import { TickerManager } from "dream-cc-core";




export class LevelManager {

    private __levels: Map<string, Level>;

    constructor() {
        this.__levels = new Map<string, Level>();
        TickerManager.addTicker(this);
    }

    /**
     * 初始化关卡
     * @param key 
     * @param root 
     * @param max_count 
     */
    initLevel(key: string, root: Node, max_count: number = 1024): Level {
        if (this.__levels.has(key)) {
            throw new Error(`关卡[${key}]已存在`);
        }
        let level = new Level();
        level.key = key;
        level.init(root, max_count);
        this.__levels.set(key, level);
        return level;
    }

    /**
     * 关卡是否存在
     * @param key 
     * @returns 
     */
    hasLevel(key: string): boolean {
        return this.__levels.has(key);
    }

    /**
     * 获取关卡实例
     * @param key 
     * @returns 
     */
    getLevel(key: string): Level {
        return this.__levels.get(key);
    }

    /**
     * 进入关卡
     * @param key 
     * @param mode 
     * @param data 
     */
    enter(key: string, mode: LevelMode, ...data: any[]): void {
        if (!this.__levels.has(key)) {
            throw new Error(`关卡[${key}]不存在`);
        }
        let level = this.__levels.get(key);
        level.enter(mode, ...data);
    }

    /**
     * 心跳
     * @param dt 
     */
    tick(dt: number): void {
        let elements = this.__levels.values();
        for (const element of elements) {
            element.tick(dt);
        }
    }

    /**
     * 退出关卡
     * @param key 
     */
    exit(key: string): void {
        if (!this.__levels.has(key)) {
            throw new Error(`关卡[${key}]不存在`);
        }
        let level = this.__levels.get(key);
        level.exit();
    }

    /**
     * 销毁关卡
     * @param key 
     */
    destroy(key: string): void {
        if (!this.__levels.has(key)) {
            throw new Error(`关卡[${key}]不存在`);
        }
        let level = this.__levels.get(key);
        level.destroy();
        this.__levels.delete(key);
    }

    private static __instance: LevelManager;
    /**
     * 单例
     */
    static get single(): LevelManager {
        if (this.__instance == null) {
            this.__instance = new LevelManager();
        }
        return this.__instance;
    }
}