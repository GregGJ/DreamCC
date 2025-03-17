import { Injector } from "../utils/Injector";
import { ILoader } from "./loaders/ILoader";
import { IRes } from "./resources/IRes";
import { ResImpl } from "./resources/ResImpl";
import { ResRequest } from "./ResRequest";
import { ResURL } from "./ResURL";


enum ResType {
    FGUI = "fgui",
    CONFIG = "config",
}

/**
 * 资源入口类
 */
export class Res {

    static readonly KEY: string = "Res"

    /**
     * 默认资源类型
     */
    static TYPE: typeof ResType = ResType;

    /**
     * 资源加载最大线程数
     */
    static MAX_LOADER_THREAD: number = 5;

    /**
     * key转url
     * @param key 
     * @returns 
     */
    static key2Url(key: string): ResURL {
        return this.impl.key2Url(key);
    }

    /**
     * url转key
     * @param url 
     * @returns 
     */
    static url2Key(url: ResURL): string {
        return this.impl.url2Key(url);
    }

    /**
    * url转资源路径
    * @param url
    */
    static url2Path(url: ResURL): string {
        return this.impl.url2Path(url);
    }

    /**
     * url是否相同
     * @param a 
     * @param b 
     */
    static urlEqual(a: ResURL | null, b: ResURL | null): boolean {
        return this.impl.urlEqual(a, b);
    }

    /**
     * 设置资源加载器
     * @param key 
     * @param loader 
     */
    static setLoader(key: any, loader: new () => ILoader): void {
        this.impl.setLoader(key, loader);
    }

    /**
     * 获取资源加载器
     * @param key 
     * @returns 
     */
    static getLoader(key: any): new () => ILoader {
        return this.impl.getLoader(key);
    }

    /**
     * 创建资源请求
     * @param url 
     * @param refKey 
     * @param progress 
     * @param cb 
     * @returns 
     */
    static create(url: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void, cb?: (err?: Error) => void): ResRequest {
        return this.impl.create(url, refKey, progress, cb);
    }
    
    /**
     * 加载AssetBundle
     * @param names 
     * @returns 
     */
    static loadAssetBundles(names: string | Array<string>): Promise<void> {
        return this.impl.loadAssetBundles(names);
    }


    private static __impl: IRes;
    private static get impl(): IRes {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new ResImpl();
        }
        return this.__impl;
    }

    /**
     * url转表名
     * @param url 
     * @returns 
     */
    static url2Sheet: (url: ResURL) => string;
    /**
     * 配置表名称转URL
     * @param sheet 
     * @param type 
     * @param bundle 
     * @returns 
     */
    static sheet2URL: ((sheet: string, type?: any, bundle?: string) => ResURL) | undefined;
}