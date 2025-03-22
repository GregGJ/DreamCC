import { Injector } from "../../utils/Injector";
import { IResourceManager } from "./IResourceManager";
import { ResRef } from "../ResRef";
import { IResource } from "./IResource";
import { ResourceManagerImpl } from "./ResourceManagerImpl";



export class ResourceManager {

    static KEY = "ResourceManager";

    /**
     * GC检查时间间隔(毫秒)
     */
    static GC_CHECK_TIME: number = 5000;

    /**
     * 资源保留长时间(毫秒)GC
     */
    static GC_TIME: number = 15000;
    
    /**
     * 自动清理
     */
    static AUTO_GC: boolean = true;

    
    /**
     * 添加一个资源
     * @param value
     */
    static addRes(value: IResource): void {
        this.impl.addRes(value);
    }

    /**
     * 是否包含该资源
     * @param key 
     */
    static hasRes(key: string): boolean {
        return this.impl.hasRes(key);
    }

    /**
     * 获取资源（内部接口）
     * @param key 
     * @returns 
     */
    static getRes(key: string): IResource | undefined {
        return this.impl.getRes(key);
    }

    /**
     * 添加并返回一个资源引用
     * @param key 
     * @param refKey 
     */
    static addRef(key: string, refKey?: string): ResRef {
        return this.impl.addRef(key, refKey);
    }

    /**
     * 删除一个资源引用
     * @param value 
     */
    static removeRef(value: ResRef): void {
        return this.impl.removeRef(value);
    }

    /**
     * 资源清理
     */
    static gc(ignoreTime?: boolean): void {
        return this.impl.gc(ignoreTime);
    }

    /**
     * 资源列表
     * @returns 
     */
    static get resList(): Array<IResource> {
        return this.impl.resList;
    }

    private static __impl: IResourceManager;
    private static get impl(): IResourceManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new ResourceManagerImpl();
        }
        return this.__impl;
    }
}