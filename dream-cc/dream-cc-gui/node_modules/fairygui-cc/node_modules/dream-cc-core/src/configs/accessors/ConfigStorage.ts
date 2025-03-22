

/**
 * 配置存储器
 */
export class ConfigStorage {

    key: string;
    keys: Array<string>;
    map: Map<string, any>;

    constructor(keys: Array<string>) {
        this.key = keys.join("_");
        this.keys = keys;
        this.map = new Map<string, any>();
    }

    save(value: any, sheet: string): void {
        if (this.keys.length == 1) {
            let key = this.keys[0];
            let saveKey = value[key];
            if (this.map.has(saveKey)) {
                throw new Error(`配置表${sheet}唯一Key存在重复内容:${saveKey}`);
            }
            this.map.set(saveKey, value);
        } else {
            let values: Array<any> = [];
            for (let index = 0; index < this.keys.length; index++) {
                const key = this.keys[index];
                values.push(value[key]);
            }
            const saveKey = values.join("_");
            if (!saveKey || saveKey.length == 0) {
                return;
            }
            if (this.map.has(saveKey)) {
                throw new Error(`配置表${sheet}唯一Key存在重复内容:${saveKey}`);
            }
            this.map.set(saveKey, value);
        }
    }

    get<T>(key: string): T | undefined {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        return undefined;
    }

    destroy(): void {
        this.key = undefined;
        this.keys = null;
        this.map.clear();
        this.map = null;
    }
}