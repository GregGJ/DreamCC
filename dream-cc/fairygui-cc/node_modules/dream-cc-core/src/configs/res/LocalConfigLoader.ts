import { AssetManager, assetManager, JsonAsset } from "cc";
import { Event } from "../../events/Event";
import { EventDispatcher } from "../../events/EventDispatcher";
import { ILoader } from "../../res/loaders/ILoader";
import { Res } from "../../res/Res";
import { Resource } from "../../res/resources/Resource";
import { ResourceManager } from "../../res/resources/ResourceManager";
import { ResURL } from "../../res/ResURL";
import { ConfigManager } from "../ConfigManager";
import { IConfigAccessor } from "../IConfigAccessor";


export class LocalConfigLoader extends EventDispatcher implements ILoader {

    private __url: ResURL;

    constructor() {
        super();
    }
    
    load(url: ResURL): void {
        this.__url = url;
        if (typeof this.__url == "string") {
            throw new Error("未实现！");
        }
        let self = this;
        let bundle = assetManager.getBundle(this.__url.bundle);
        if (!bundle) {
            assetManager.loadBundle(
                this.__url.bundle,
                (err: Error | null, bundle: AssetManager.Bundle) => {
                    if (err) {
                        this.emit(Event.ERROR, this.__url, err);
                        return;
                    }
                    this.__load(this.__url!, bundle);
                }
            );
        } else {
            this.__load(this.__url, bundle);
        }
    }

    private __load(url: ResURL, bundle: AssetManager.Bundle): void {
        if (typeof url == "string") {
            throw new Error("未实现！");
        }
        let urlStr = Res.url2Path(url);
        bundle.load(
            urlStr,
            JsonAsset,
            (finished: number, total: number) => {
                const progress = finished / total;
                this.emit(Event.PROGRESS, this.__url, undefined, progress);
            },
            (err: Error | null, asset: JsonAsset) => {
                if (err) {
                    this.emit(Event.ERROR, url, err);
                    return;
                }
                const urlKey = Res.url2Key(url);
                let res: Resource = new Resource();
                res.key = urlKey;
                res.content = asset;
                let accessor = this.__parseConfig(url, asset);
                res.content = accessor;
                ResourceManager.addRes(res);
                this.emit(Event.COMPLETE, url);
            }
        );
    }

    private __parseConfig(url: ResURL, data: JsonAsset): IConfigAccessor {
        let list = data.json as Array<any>;
        //存取器
        if (Res.url2Sheet == undefined) {
            throw new Error("Res.url2Sheet未定义!请在初始化前设置!");
        }
        const sheet_name = Res.url2Sheet(url);
        let accessorClass: new () => IConfigAccessor = ConfigManager.getAccessorClass(sheet_name);
        let accessor: IConfigAccessor = new accessorClass();
        accessor.sheetName = sheet_name;
        for (let idx = 0; idx < list.length; idx++) {
            const data = list[idx];
            accessor.save(data);
        }
        return accessor;
    }

    reset(): void {
        this.__url = undefined;
        this.offAllEvent();
    }
}