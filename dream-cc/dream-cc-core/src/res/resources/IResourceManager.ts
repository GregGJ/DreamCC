import { IResource } from "./IResource";
import { ResRef } from "../ResRef";




/**
 * 资源管理器接口
 */
export interface IResourceManager {

    /**
     * 添加一个资源
     * @param value 
     */
    addRes(value: IResource): void;

    /**
     * 获取资源(内部接口)
     * @param key 
     */
    getRes(key: string): IResource|undefined;

    /**
     * 是否包含该资源
     * @param key 
     */
    hasRes(key: string): boolean;

    /**
     * 添加并返回一个资源引用
     * @param key 
     * @param refKey 
     */
    addRef(key: string, refKey?: string): ResRef;

    /**
     * 删除一个资源引用
     * @param value 
     */
    removeRef(value: ResRef): void;

    /**
     * 资源清理
     */
    gc(ignoreTime?: boolean): void;

    /**
     * 资源列表
     */
    readonly resList: Array<IResource>;
}