import { EventDispatcher } from "dream-cc-core";



/**
 * 行为树黑板
 */
export class BTBlackboard extends EventDispatcher {

    private __datas: Map<any, any>;

    constructor() {
        super();
        this.__datas = new Map<any, any>();
    }

    /**
     * 获取数据
     * @param key 
     * @returns 
     */
    get<T>(key: any): T {
        return this.__datas.get(key) as T;
    }

    /**
     * 判断是否存在数据
     * @param key 
     */
    has(key: any): boolean {
        return this.__datas.has(key);
    }

    /**
     * 设置数据
     * @param key 
     * @param value 
     */
    set(key: any, value: any): void {
        this.__datas.set(key, value);
    }

    /**
     * 删除数据
     */
    delete(key: any): void {
        this.__datas.delete(key);
    }

    /**
     * 清理数据
     */
    clear(): void {
        this.__datas.clear();
    }

    /**
     * 销毁
     * @returns 
     */
    destroy(): boolean {
        this.clear();
        this.__datas = null;
        return true;
    }
}