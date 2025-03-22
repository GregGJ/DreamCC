
import { Res } from "../Res";
import { ResourceManager } from "../resources/ResourceManager";
import { ResRequest } from "../ResRequest";
import { ResURL } from "../ResURL";
import { ILoaderManager } from "./ILoaderManager";
import { LoaderQueue } from "./LoaderQueue";


export class LoaderManagerImpl implements ILoaderManager {

    private __requests: Map<string, Array<ResRequest>> = new Map<string, Array<ResRequest>>();

    constructor() {

    }

    /**
     * 加载
     * @param url 
     * @param refKey 
     * @param cb 
     * @param progress 
     * @returns 
     */
    load(request: ResRequest): void {
        if (request.urls.length == 0) {
            console.error("urls is empty!");
            return;
        }
        this.__addReqeuset(request);
        for (let index = 0; index < request.urls.length; index++) {
            const url = request.urls[index];
            const urlKey = Res.url2Key(url);
            //如果已经加载完成
            if (ResourceManager.hasRes(urlKey)) {
                this.childComplete(url);
            } else {
                LoaderQueue.single.load(url);
            }
        }
    }

    /**
     * 卸载
     * @param request 
     */
    unload(request: ResRequest): void {
        this.__deleteReqeuset(request);
    }

    childComplete(url: ResURL): void {
        const urlKey: string = Res.url2Key(url);
        let list = this.__requests.get(urlKey);
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const request = list[index];
                request.childComplete(url);
            }
            list.splice(0, list.length);
        }
        this.__requests.delete(urlKey);
    }

    childError(url: ResURL, err: Error): void {
        const urlKey: string = Res.url2Key(url);
        let rlist = this.__requests.get(urlKey);
        if (rlist) {
            //复制
            let list = rlist.concat();
            for (let index = 0; index < list.length; index++) {
                const request = list[index];
                //通知所有相关请求失败
                request.childError(err);
                this.__deleteReqeuset(request);
            }
        }
        this.__requests.delete(urlKey);
    }

    childProgress(url: ResURL, progress: number): void {
        const urlKey: string = Res.url2Key(url);
        let list = this.__requests.get(urlKey);
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const request = list[index];
                request.childProgress(url, progress);
            }
        }
    }

    /**
     * 添加
     * @param request 
     */
    private __addReqeuset(request: ResRequest): void {
        let list: Array<ResRequest>;
        for (let index = 0; index < request.urls.length; index++) {
            const url = request.urls[index];
            const urlKey = Res.url2Key(url);
            if (this.__requests.has(urlKey)) {
                list = this.__requests.get(urlKey)!;
            } else {
                list = [];
                this.__requests.set(urlKey, list);
            }
            list.push(request);
        }
    }

    /**
     * 删除
     * @param request 
     */
    private __deleteReqeuset(request: ResRequest): void {
        if (!request.urls || request.urls.length == 0) return;
        let list: Array<ResRequest>;
        let findex: number = 0;
        //遍历当前请求的所有资源
        for (let i = 0; i < request.urls.length; i++) {
            const url = request.urls[i];
            const urlKey = Res.url2Key(url);
            //从列表中找出并删除
            if (!this.__requests.has(urlKey)) {
                continue;
            }
            list = this.__requests.get(urlKey)!;
            if (!list || list.length == 0) {
                continue;
            }
            findex = list.indexOf(request);
            if (findex >= 0) {
                list.splice(findex, 1);
            }
        }
    }
}