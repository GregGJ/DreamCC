import { Pool } from "../pools/Pool";
import { LoaderManager } from "./loaders/LoaderManager";
import { Res } from "./Res";
import { ResourceManager } from "./resources/ResourceManager";
import { ResRef } from "./ResRef";
import { ResURL } from "./ResURL";


export enum State {
    ERROR,
    SUCCESS,
    LOADING,
    POOL,
}


/**
 * 资源请求
 * @example
 * 
 * if(this.request){
 *     this.request.dispose();
 *     this.request = null;
 * }
 * this.request = Res.create(
 *      url, 
 *      refKey,
 *      (progress:number)=>{
 *          //加载进度
 *          console.log(progress);
 *      }
 *      (err)=>{
 *          if(err){
 *              console.error(err);
 *              request.dispose();
 *              request=null;
 *              return;
 *          }
 *          //加载完成，获取资源引用
 *          let ref=request.getRef();
 *      }
 * );
 * this.request.load();
 */
export class ResRequest {
    /**
     * 状态
     */
    state: State = State.POOL;
    /**
     * 资源地址
     */
    urls: Array<ResURL>;
    /**
     * 引用KEY
     */
    refKey: string = "";
    /**
     * 完成回调
     */
    cb?: (err?: Error) => void;
    /**
     * 进度处理器
     */
    progress?: (progress: number) => void;

    private __loaded: Map<string, boolean>;
    private __loadProgress: Map<string, number>;

    private __resRefs: Array<ResRef>;

    constructor() {
        this.urls = [];
        this.__resRefs = [];
        this.__loaded = new Map<string, boolean>();
        this.__loadProgress = new Map<string, number>();
    }

    init(url: ResURL | Array<ResURL>, refKey: string, progress?: (progress: number) => void, cb?: (err?: Error) => void): void {
        if (Array.isArray(url)) {
            this.urls = url;
        } else {
            this.urls = [url];
        }
        //去重
        this.urls = this.removeDuplicates(this.urls);
        this.cb = cb;
        this.refKey = refKey;
        this.progress = progress;
    }

    load(): void {
        this.state = State.LOADING;
        LoaderManager.load(this);
    }

    childComplete(resURL: ResURL): void {
        const urlKey = Res.url2Key(resURL);
        this.__loaded.set(urlKey, true);
        this.checkComplete();
    }

    childProgress(resURL: ResURL, progress: number): void {
        const urlKey = Res.url2Key(resURL);
        this.__loadProgress.set(urlKey, progress);
        this.updateProgress();
    }

    childError(err: Error): void {
        this.state = State.ERROR;
        if (this.cb) {
            this.cb(err);
        }
    }

    updateProgress(): void {
        let loaded: number = this.getLoaded();
        let progress: number = loaded / this.urls.length;
        if (this.progress) {
            this.progress(progress);
        }
    }

    private checkComplete(): void {
        let loaded: number = this.__loaded.size;
        let progress: number = loaded / this.urls.length;
        //完成
        if (progress >= 1 && this.cb != null) {
            this.state = State.SUCCESS;
            for (let index = 0; index < this.urls.length; index++) {
                const url = this.urls[index];
                const urlKey = Res.url2Key(url);
                const ref = ResourceManager.addRef(urlKey, this.refKey);
                this.__resRefs.push(ref);
            }
            this.cb();
        }
    }

    private getLoaded(): number {
        let loaded: number = 0;
        for (let value of this.__loadProgress.values()) {
            loaded += value;
        }
        return loaded;
    }


    reset(): void {
        this.state = State.POOL;
        if (this.__resRefs) {
            for (let index = 0; index < this.__resRefs.length; index++) {
                const ref = this.__resRefs[index];
                ref.dispose();
            }
            this.__resRefs.splice(0, this.__resRefs.length);
        }
        this.__loaded.clear();
        this.__loadProgress.clear();
        this.urls = [];
        this.cb = undefined;
        this.progress = undefined;
    }

    destroy(): boolean {
        this.reset();
        this.__resRefs.splice(0, this.__resRefs.length);
        this.__loaded.clear();
        this.__loadProgress.clear();
        return true;
    }

    /**
     * 释放
     */
    dispose(): void {
        if (this.state == State.LOADING) {
            LoaderManager.unload(this);
        }
        Pool.release(ResRequest, this);
    }

    /**
     * 获取资源引用
     * @returns 
     */
    getRef(): ResRef {
        return this.__resRefs[0];
    }

    /**
     * 获取资源引用列表
     * @returns 
     */
    getRefList(): Array<ResRef> {
        return this.__resRefs;
    }

    /**
     * 获取资源引用映射表
     * @param result 
     * @returns 
     */
    getRefMap(result?: Map<string, ResRef>): Map<string, ResRef> {
        result = result || new Map<string, ResRef>();
        for (let index = 0; index < this.__resRefs.length; index++) {
            const ref = this.__resRefs[index];
            result.set(ref.key, ref);
        }
        return result;
    }

    private helpMap: Map<string, boolean> = new Map<string, boolean>();
    /**
     * 去重
     * @param urls 
     * @returns 
     */
    private removeDuplicates(urls: Array<ResURL>): Array<ResURL> {
        this.helpMap.clear();
        let result: Array<ResURL> = [];
        for (let index = 0; index < urls.length; index++) {
            const url = urls[index];
            const urlKey = Res.url2Key(url);
            if (this.helpMap.has(urlKey)) {
                continue;
            } else {
                this.helpMap.set(urlKey, true);
                result.push(url);
            }
        }
        return result;
    }
}