import { Injector } from "../../utils/Injector";
import { ResRequest } from "../ResRequest";
import { ResURL } from "../ResURL";
import { ILoaderManager } from "./ILoaderManager";
import { LoaderManagerImpl } from "./LoaderManagerImpl";



export class LoaderManager {

    static KEY = "LoaderManager";

    /**
     * 加载资源
     * @param reqeust 
     */
    static load(reqeust:ResRequest):void {
        this.impl.load(reqeust);
    }

    /**
     * 卸载
     * @param request 
     */
    static unload(request: ResRequest): void {
        this.impl.unload(request);
    }

    static childComplete(url: ResURL): void {
        this.impl.childComplete(url);
    }

    static childError(url: ResURL, err: Error): void {
        this.impl.childError(url, err);
    }

    static childProgress(url: ResURL, progress: number): void {
        this.impl.childProgress(url, progress);
    }

    private static __impl: ILoaderManager;
    private static get impl(): ILoaderManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new LoaderManagerImpl();
        }
        return this.__impl;
    }
}