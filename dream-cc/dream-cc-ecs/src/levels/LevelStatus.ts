import { IDestroyable } from "dream-cc-core";



/**
 * 关卡状态数据存放
 */
export class LevelStatus implements IDestroyable {

    private __status: Map<any, any>;

    constructor() {
        this.__status = new Map<any, any>();
    }

    /**
     * 获取数据
     * @param key 
     * @returns 
     */
    get<T>(key: any): T {
        return this.__status.get(key) as T;
    }

    /**
     * 是否包含数据
     * @param key 
     * @returns 
     */
    has(key:any):boolean{
        return this.__status.has(key);
    }
    
    /**
     * 设置数据
     * @param key 
     * @param value 
     */
    set(key: any, value: any): void {
        this.__status.set(key, value);
    }

    /**
     * 删除数据
     */
    delete(key: any): void {
        this.__status.delete(key);
    }

    clear(): void {
        this.__status.clear();
    }

    destroy(): boolean {
        this.clear();
        this.__status = null;
        return true;
    }
}