import { Res } from "../res/Res";
import { ResourceManager } from "../res/resources/ResourceManager";
import { IConfigAccessor } from "./IConfigAccessor";
import { IConfigManager } from "./IConfigManager";



export class ConfigManagerImpl implements IConfigManager {

    /**
     * 存取器
     */
    private __accessors: Map<string, new () => IConfigAccessor>;
    constructor() {
        this.__accessors = new Map<string, new () => IConfigAccessor>();
    }

    /**
     * 注册存取器
     * @param sheet 
     * @param accessor
     */
    register(sheet: string, accessor: new () => IConfigAccessor): void {
        if (this.__accessors.has(sheet)) {
            if (this.__accessors.get(sheet) != accessor) {
                throw new Error(`${sheet},重复注册配置表存取器且存取器类型不一致!`);
            } else {
                return;
            }
        }
        this.__accessors.set(sheet, accessor);
    }

    /**
     * 注销
     * @param sheet 
     */
    unregister(sheet: string): void {
        this.__accessors.delete(sheet);
    }

    /**
     * 获取存取器类
     * @param sheet 
     * @returns 
     */
    getAccessorClass(sheet: string): new () => IConfigAccessor {
        if (!this.__accessors.has(sheet)) {
            throw new Error(`${sheet},配置表存取器未注册!`);
        }
        return this.__accessors.get(sheet)!;
    }

    /**
     * 获取存取器
     * @param sheet 
     * @returns 
     */
    getAccessor(sheet: string): IConfigAccessor {
        if (Res.sheet2URL == undefined) {
            throw new Error("Res.sheet2URL未定义!请在初始化前设置!");
        }
        const url = Res.sheet2URL(sheet);
        const urlKey = Res.url2Key(url);
        if (!ResourceManager.hasRes(urlKey)) {
            throw new Error(sheet + "未加载!");
        }
        let res = ResourceManager.getRes(urlKey)!;
        return res.content;
    }
}