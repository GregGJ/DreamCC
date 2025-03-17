


import { IConfigAccessor } from "./IConfigAccessor";




/**
 * 配置管理器接口
 */
export interface IConfigManager {
    /**
     * 注册存取器
     * @param sheet 
     * @param accessors 
     */
    register(sheet: string, accessors: new()=>IConfigAccessor): void;
    /**
     * 注销
     * @param sheet 
     */
    unregister(sheet: string): void;
    /**
     * 获取存取器类
     * @param sheet 
     */
    getAccessorClass(sheet:string):new()=>IConfigAccessor;

    /**
     * 获取配置存取器
     * @param sheet
     */
    getAccessor(sheet: string): IConfigAccessor;
}