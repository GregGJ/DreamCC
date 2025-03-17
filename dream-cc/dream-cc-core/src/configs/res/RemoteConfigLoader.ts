



import { assetManager, JsonAsset } from "cc";
import { Event } from "../../events/Event";
import { EventDispatcher } from "../../events/EventDispatcher";
import { Res } from "../../res/Res";
import { ResURL } from "../../res/ResURL";
import { ConfigManager } from "../ConfigManager";
import { IConfigAccessor } from "../IConfigAccessor";
import { ILoader } from "../../res/loaders/ILoader";
import { Resource } from "../../res/resources/Resource";
import { ResourceManager } from "../../res/resources/ResourceManager";

/**
 * 远程配置加载器
 */
export class RemoteConfigLoader extends EventDispatcher implements ILoader {

    /**
     * 强制加载最新版本
     */
    static force: boolean = true;

    url?: ResURL;

    constructor() {
        super();
    }

    load(url: ResURL): void {
        this.url = url;
        if (typeof url == "string") {
            throw new Error("未实现！");
        }
        let self = this;
        let remote_url = url.url;
        if (RemoteConfigLoader.force) {
            remote_url += "?v=" + Date.now();
        }
        assetManager.loadRemote(remote_url, (err: Error, asset: JsonAsset) => {
            if (err) {
                self.emit(Event.ERROR, url, err);
                return;
            }
            const urlKey = Res.url2Key(url);
            let res: Resource = new Resource();
            res.key = urlKey;
            res.content = asset;
            let accessor = this.__parseConfig(url, asset);
            res.content = accessor;
            ResourceManager.addRes(res);
            self.emit(Event.COMPLETE, url);
        });
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
        this.url = undefined;
        this.offAllEvent();
    }
}