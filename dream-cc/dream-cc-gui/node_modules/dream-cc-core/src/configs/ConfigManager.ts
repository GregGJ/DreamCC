import { Injector } from "../utils/Injector";
import { ConfigManagerImpl } from "./ConfigManagerImpl";
import { IConfigAccessor } from "./IConfigAccessor";
import { IConfigManager } from "./IConfigManager";


/**
 * 配置表管理器
 */
export class ConfigManager {

    static KEY: string = "ConfigManager"
    
    /**
      * 注册存取器
      * @param sheet 
      * @param accessors 
      */
    static register(sheet: string, accessors: new () => IConfigAccessor): void {
        this.impl.register(sheet, accessors);
    }
    
    /**
     * 注销
     * @param sheet 
     */
    static unregister(sheet:string):void{
        this.impl.unregister(sheet);
    }

    /**
     * 获取存取器类
     * @param sheet 
     * @returns 
     */
    static getAccessorClass(sheet: string): new () => IConfigAccessor {
        return this.impl.getAccessorClass(sheet);
    }

    /**
     * 获取配置存取器
     * @param sheet
     */
    static getAccessor(sheet: string): IConfigAccessor {
        return this.impl.getAccessor(sheet);
    }

    private static __impl: IConfigManager;
    private static get impl(): IConfigManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl=new ConfigManagerImpl();
        }
        return this.__impl;
    }
}