import { IConfigAccessor } from "../IConfigAccessor";
import { ConfigStorage } from "./ConfigStorage";

/**
 * 配置存取器基类
 */
export class BaseConfigAccessor implements IConfigAccessor {
    /**
     * 表名
     */
    sheetName: string;

    protected $configs: Array<any> = [];
    protected $storages: Map<string, ConfigStorage>;

    constructor() {
        this.$storages = new Map<string, ConfigStorage>();
    }

    /**
    * 子类构造函数中调用，增加存储方式
    * @param keys 
    */
    protected addStorage(keys: Array<string>): void {
        const key = keys.join("_");
        if (this.$storages.has(key)) {
            throw new Error("重复添加配置表存储方式：" + key);
        }
        this.$storages.set(key, new ConfigStorage(keys));
    }

    save(value: any): boolean {
        const index = this.$configs.indexOf(value);
        if (index >= 0) {
            return false;
        }
        this.$configs.push(value);
        for (let i of this.$storages.values()) {
            i.save(value, this.sheetName);
        }
        return true;
    }

    /**
     * 通过单key单值获取项内容
     * @param key 
     * @param value 
     * @returns 
     */
    getOne<T>(key: string, value: any): T {
        return this.get<T>([key], [value]);
    }

    /**
      * 获取
      * @param keys 
      * @param values 
      * @returns 
      */
    get<T>(keys?: Array<string>, values?: Array<any>): T | undefined {
        if (!keys || !values || keys.length == 0 || values.length == 0) {
            return undefined;
        }
        if (keys.length != values.length) {
            throw new Error("参数长度不一致!");
        }
        if (keys.length == 1) {
            let key = keys[0];
            let value = values[0];
            if (this.$storages.has(key)) {
                const storage = this.$storages.get(key)!;
                return storage.get<T>(value);
            }
        } else {
            let sKey: string = keys.join("_");
            if (this.$storages.has(sKey)) {
                const s = this.$storages.get(sKey)!;
                const vKey = values.join("_");
                return s.get<T>(vKey);
            }
        }
        return undefined;
    }

    /**
     * 获取存储器
     * @param keys 
     * @returns 
     */
    getStorage(keys: Array<string>): ConfigStorage | undefined {
        return this.$storages.get(keys.join("_"));
    }

    /**
     * 获取
     * @param key
     * @param value
     * @returns 
     */
    getElements<T>(): Array<T> {
        return this.$configs;
    }

    destroy(): void {
        this.$configs = null;
        for (let i of this.$storages.values()) {
            i.destroy();
        }
        this.$storages.clear();
        this.$storages = null;
    }
}