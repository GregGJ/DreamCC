import { AssetManager, JsonAsset, SpriteFrame, assetManager } from "cc";
import { TowerSkinAsset, TowerSkinElement } from "./TowerSkinAsset";
import { TowerElementType } from "./TowerElementType";
import { ConfigManager, Event, EventDispatcher, ILoader, Res, Resource, ResourceManager, ResRequest, ResURL } from "dream-cc-core";
import { ConfigKeys } from "../configs/ConfigKeys";
import { TowerAccessor } from "../configs/TowerAccessor";



export class TowerSkinLoader extends EventDispatcher implements ILoader {

    private __url: ResURL | null = null;
    private __bundle: AssetManager.Bundle | null = null;
    constructor() {
        super();
    }

    load(url: ResURL): void {
        if (typeof url == "string") {
            throw new Error("未实现：" + url);
        }
        this.__url = url;
        let bundle = assetManager.getBundle(url.bundle);
        if (!bundle) {
            assetManager.loadBundle(url.bundle, (err, bundle) => {
                if (err) {
                    this.emit(Event.ERROR, url, err);
                    return;
                }
                this.__load(bundle);
            })
        } else {
            this.__load(bundle);
        }
    }
    private __load(bundle: AssetManager.Bundle): void {
        if (typeof this.__url == "string") {
            throw new Error("未实现：" + this.__url);
        }
        this.__bundle = bundle;
        this.__bundle.load(this.__url!.url, JsonAsset,
            (f, t) => {
                this.emit(Event.PROGRESS, this.__url, undefined, f / t * 0.5);
            },
            this.__bundleLoaded.bind(this)
        );
    }

    private __bundleLoaded(err: Error | null, asset: JsonAsset | null): void {
        if (err) {
            this.emit(Event.ERROR, this.__url, err);
            return;
        }
        this.__parseJson(asset!);
    }

    private __parseJson(asset: JsonAsset): void {
        if (typeof this.__url == "string") {
            throw new Error("未实现：" + this.__url);
        }
        if (!Array.isArray(asset.json)) {
            throw new Error("皮肤数据错误：" + asset.json);
        }
        let urls: Array<ResURL> = [];
        const acc = ConfigManager.getAccessor(ConfigKeys.Tower_Tower) as TowerAccessor;
        const towerConfig = acc.getById(Number(this.__url!.data))!;
        const jsonData: Array<any> = asset.json as Array<any>;
        const url_p: string = "entitys/towers/" + towerConfig.type + "/";
        for (let index = 0; index < jsonData.length; index++) {
            const element = jsonData[index];
            switch (element.type) {
                case TowerElementType.Image:
                    urls.push({
                        url: url_p + "images/" + element.url,
                        type: SpriteFrame,
                        bundle: this.__url!.bundle,
                        isSub: true
                    });
                    break;
                case TowerElementType.Animation:
                    urls.push({
                        url: url_p + "ani/" + element.url,
                        type: "ani",
                        bundle: this.__url!.bundle,
                        isSub: true
                    });
                    break;
                default:
                    throw new Error("未知皮肤元素类型：" + element.type);
            }
        }
        let request = Res.create(
            urls,
            "Battle",
            (progress: number) => {
                this.emit(Event.PROGRESS, this.__url, undefined, progress);
            },
            (err?: Error) => {
                if (err) {
                    request.dispose();
                    this.emit(Event.ERROR, this.__url, err);
                    return;
                }
                this.__elementAssetLoaded(jsonData, towerConfig, request);
            }
        );
        request.load();
    }

    private __elementAssetLoaded(jsonData: Array<any>, towerConfig: Config.Tower.Tower, request: ResRequest): void {
        if (typeof this.__url == "string") {
            throw new Error("未实现：" + this.__url);
        }
        let elements: Array<TowerSkinElement> = [];
        let element: TowerSkinElement;
        let urlKey: string;
        const url_p: string = "entitys/towers/" + towerConfig.type + "/";
        for (let index = 0; index < jsonData.length; index++) {
            const jsonelement = jsonData[index];
            switch (jsonelement.type) {
                case TowerElementType.Image:
                    urlKey = Res.url2Key({
                        url: url_p + "images/" + jsonelement.url,
                        type: SpriteFrame,
                        bundle: this.__url!.bundle
                    })
                    break;
                case TowerElementType.Animation:
                    urlKey = Res.url2Key({
                        url: url_p + "ani/" + jsonelement.url,
                        type: "ani",
                        bundle: this.__url!.bundle
                    })
                    break;
                default:
                    throw new Error("未知皮肤元素类型：" + jsonelement.type);
            }
            let map = request.getRefMap();
            const asset = map.get(urlKey);
            element = new TowerSkinElement(
                jsonelement.name,
                jsonelement.type,
                asset,
                jsonelement.ax,
                jsonelement.ay,
                jsonelement.x,
                jsonelement.y,
            );
            elements.push(element);
        }
        let res: Resource = new Resource();
        res.key = Res.url2Key(this.__url!);
        res.content = new TowerSkinAsset(elements, request);
        ResourceManager.addRes(res);
        this.emit(Event.COMPLETE, this.__url);
    }

    reset(): void {
        this.__url = null;
        this.__bundle = null;
    }
}