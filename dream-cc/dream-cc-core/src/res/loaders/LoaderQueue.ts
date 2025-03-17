import { Dictionary } from "../../containers/Dictionary";
import { Event } from "../../events/Event";
import { Logger } from "../../loggers/Logger";
import { Res } from "../../res/Res";
import { ResURL } from "../../res/ResURL";
import { ITicker } from "../../ticker/ITicker";
import { TickerManager } from "../../ticker/TickerManager";
import { ILoader } from "./ILoader";
import { LoaderManager } from "./LoaderManager";



/**
 * 加载队列
 */
export class LoaderQueue implements ITicker {

    /**
     * 加载中
     */
    private running: Dictionary<string, ILoader> = new Dictionary<string, ILoader>();

    /**
     * 等待加载
     */
    private waiting: Dictionary<string, ResURL> = new Dictionary<string, ResURL>();

    /**
     * 对象池
     */
    private pool: Map<any, Array<ILoader>> = new Map<any, Array<ILoader>>();

    constructor() {
        TickerManager.addTicker(this);
    }

    tick(dt: number): void {
        while (this.running.size < Res.MAX_LOADER_THREAD && this.waiting.size > 0) {
            //获取需要加载的内容
            const url = this.waiting.elements[0];
            const urlKey = Res.url2Key(url);
            this.waiting.delete(urlKey);
            this.__load(url, urlKey);
        }
    }

    private __load(url: ResURL, urlKey: string): void {
        let loader: ILoader;
        let loaderClass: new () => ILoader;
        let type: any;
        if (typeof url == "string") {
            type = "string";
        } else {
            type = url.type;
        }
        let list = this.pool.get(type);
        if (list == null) {
            list = [];
            this.pool.set(type, list);
        }
        if (list.length > 0) {
            loader = list.shift()!;
        } else {
            if (typeof url == "string") {
                loaderClass = Res.getLoader("string");
            } else {
                loaderClass = Res.getLoader(url.type);
            }
            loader = new loaderClass();
        }
        if (loader != null) {
            this.running.set(urlKey, loader);
            this.__addEvent(loader);
            Logger.log("Start Load:" + Res.url2Key(url), Logger.TYPE.RES);
            loader.load(url);
        }
    }

    private __addEvent(target: ILoader): void {
        target.on(Event.COMPLETE, this.__eventHandler, this);
        target.on(Event.ERROR, this.__eventHandler, this);
        target.on(Event.PROGRESS, this.__eventHandler, this);
    }

    private __eventHandler(evt: Event): void {
        let target: ILoader = evt.target as ILoader;
        if (evt.type == Event.PROGRESS) {
            LoaderManager.childProgress(evt.data, evt.progress);
            return;
        }
        //删除所有事件监听
        target.offAllEvent();
        //从运行列表中删除
        this.running.delete(Res.url2Key(evt.data));
        if (evt.type == Event.ERROR) {
            Logger.log("Load Error:" + Res.url2Key(evt.data) + " e: " + evt.error.message, Logger.TYPE.RES);
            LoaderManager.childError(evt.data, evt.error!);
            return;
        }
        if (evt.type == Event.COMPLETE) {
            Logger.log("Load Complete:" + Res.url2Key(evt.data), Logger.TYPE.RES);
            LoaderManager.childComplete(evt.data);
            //重置并回收
            target.reset();
            let type: any;
            if (typeof evt.data == "string") {
                type = "string";
            } else {
                type = evt.data.type;
            }
            let list = this.pool.get(type);
            if (list == null) {
                list = [];
                this.pool.set(type, list);
            }
            list.push(target);
        }
    }

    load(url: ResURL): void {
        const urlKey = Res.url2Key(url);
        if (typeof url != "string" && url.isSub) {
            if (this.waiting.has(urlKey)) {
                this.waiting.delete(urlKey);
            }
            if (!this.running.has(urlKey)) {
                this.__load(url, urlKey);
            }
            return;
        }
        //已经在等待列表中
        if (this.waiting.has(urlKey)) {
            return;
        }
        //加载中
        if (this.running.has(urlKey)) {
            return;
        }
        //加入等待列表
        this.waiting.set(urlKey, url);
    }

    private static __instance: LoaderQueue;
    static get single(): LoaderQueue {
        if (LoaderQueue.__instance == null) {
            LoaderQueue.__instance = new LoaderQueue();
        }
        return LoaderQueue.__instance;
    }
}