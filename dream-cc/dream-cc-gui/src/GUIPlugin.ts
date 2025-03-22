import { Color, Node } from "cc";
import { GUIManager } from "./gui/GUIManager";
import { Layer } from "./gui/layer/Layer";
import { LayerManager } from "./gui/layer/LayerManager";
import { FGUILoader } from "./gui/res/FGUILoader";
import { Event, EventDispatcher, I18N, IEnginePlugin, Logger, Res, ResURL } from "dream-cc-core";
import { GRoot, registerFont, SmartLoader, UIObjectFactory, UIPackage } from "fairygui-cc";

/**
 * GUI插件
 */
export class GUIPlugin extends EventDispatcher implements IEnginePlugin {

    /**
     * 名称
     */
    readonly name = "GUIPlugin";

    /**
     * UI资源包URL
     * @param packname 
     * @param type 
     * @param bundle 
     * @returns 
     */
    static uiPackageURL: (packname: string, type?: any, bundle?: string) => ResURL;

    /**UI遮罩颜色值 */
    static MaskColor: Color = new Color(0, 0, 0, 255 * 0.5);
    /**透明遮罩颜色 */
    static AlphaMaskColor: Color = new Color(0, 0, 0, 0);


    private __root: Node;
    private __guiconfig?: ResURL;
    private __layer?: { layers: Array<string>, fullScrene: Array<string> };
    private __assets?: Array<ResURL>;
    private __fonts?: Array<{ name: string, url: ResURL }>;
    private __language?: ResURL;

    /**
     * 初始化
     * @param root          fgui根节点
     * @param guiconfig     UI配置
     * @param layer         层级配置
     * @param assets        公共资源
     * @param fonts         字体
     * @param language      fgui多语言xml文件
     */
    init(root: Node, guiconfig: ResURL, layer?: { layers: Array<string>, fullScrene: Array<string> }, assets?: Array<ResURL>, fonts?: Array<{ name: string, url: ResURL }>, language?: ResURL): void {
        this.__root = root;
        this.__guiconfig = guiconfig;
        this.__layer = layer;
        this.__assets = assets;
        this.__fonts = fonts;
        this.__language = language;
    }

    start(): void {
        Logger.log("Engine Init...", "gui");
        //如果ui资源包地址转换函数未赋值
        if (!GUIPlugin.uiPackageURL) {
            GUIPlugin.uiPackageURL = (packageName: string, type?: any, bundle?: string) => {
                return { url: "ui/" + packageName, type, bundle };
            }
        }
        //注册fgui加载器
        Res.setLoader(Res.TYPE.FGUI, FGUILoader);
        //加载器扩展
        UIObjectFactory.setLoaderExtension(SmartLoader);

        GRoot.create(this.__root);

        //创建层级
        this.__InitLayer();
        if (this.__assets && this.__assets.length > 0) {
            this.__loadCommonAssets();
        } else {
            if (this.__fonts && this.__fonts.length > 0) {
                this.__loadFonts();
            } else {
                this.__initUI();
            }
        }
    }

    private __InitLayer(): void {
        if (!this.__layer) {
            let layers = [
                "BattleDamage",
                "FullScreen",
                "Window",
                "Pannel",
                "Tooltip",
                "Alert",
                "Guide",
                "LoadingView"
            ]
            let fullScrene = [
                "FullScreen"
            ]
            this.__layer = { layers, fullScrene };
        }
        if (this.__layer.layers && this.__layer.layers.length > 0) {
            for (let index = 0; index < this.__layer.layers.length; index++) {
                const layerKey = this.__layer.layers[index];
                if (this.__layer.fullScrene && this.__layer.fullScrene.length > 0) {
                    LayerManager.addLayer(layerKey, new Layer(layerKey, this.__layer.fullScrene.indexOf(layerKey) >= 0));
                } else {
                    LayerManager.addLayer(layerKey, new Layer(layerKey))
                }
            }
        }
    }

    private __loadCommonAssets(): void {
        let reqeust = Res.create(
            this.__assets,
            "Engine",
            (progress: number) => {
                //进度
                let v = 0.2 + progress * 0.2;
                this.emit(Event.PROGRESS, Event.create(Event.PROGRESS, this, null, null, v));
            },
            (err?: Error) => {
                if (err) {
                    reqeust.dispose();
                    reqeust = null;
                    this.__onError(err);
                    return;
                }
                if (this.__fonts && this.__fonts.length > 0) {
                    this.__loadFonts();
                } else {
                    this.__initUI();
                }
            }
        );
        reqeust.load();
    }

    private __loadFonts(): void {
        let urls = [];
        let fontNames = new Map<string, string>();
        for (let index = 0; index < this.__fonts.length; index++) {
            const config = this.__fonts[index];
            urls.push(config.url);
            fontNames.set(Res.url2Key(config.url), config.name);
        }
        let request = Res.create(
            urls,
            "Engine",
            (progress: number) => {
                //进度
                let v = 0.4 + progress * 0.2;
                this.emit(Event.PROGRESS, Event.create(Event.PROGRESS, this, null, null, v));
            },
            (err?: Error) => {
                if (err) {
                    request.dispose();
                    request = null;
                    this.__onError(err);
                    return;
                }
                let refs = request.getRefList();
                //字体注册
                for (let index = 0; index < refs.length; index++) {
                    const ref = refs[index];
                    const name = fontNames.get(ref.key);
                    registerFont(name, ref.content);
                }
                this.__initUI();
            }
        );
        request.load();
    }

    private __initUI(): void {
        if (this.__guiconfig) {
            //加载guiconfig.json
            let request = Res.create(
                this.__guiconfig,
                "Engine",
                (progress: number) => {
                    const v = 0.6 + progress * 0.2;
                    this.emit(Event.PROGRESS, Event.create(Event.PROGRESS, this, null, null, v));
                },
                (err?: Error) => {
                    if (err) {
                        request.dispose();
                        request = null;
                        this.__onError(err);
                        return;
                    }
                    let ref = request.getRef();
                    let list = ref.content.json;
                    for (let index = 0; index < list.length; index++) {
                        const element = list[index];
                        GUIManager.register(element);
                    }
                    if (this.__language) {
                        this.__loadLangenge();
                    } else {
                        this.__allComplete();
                    }
                }
            );
            request.load();
        } else {
            if (this.__language) {
                this.__loadLangenge();
            } else {
                this.__allComplete();
            }
        }
    }

    /**
     * 加载FGUI语言包
     * @param url 
     * @param p_progress 
     * @param cb 
     */
    private __loadLangenge(): void {
        let request = Res.create(
            this.__language,
            "Engine",
            (progress: number) => {
                const v = 0.8 + progress * 0.2;
                this.emit(Event.PROGRESS, Event.create(Event.PROGRESS, this, null, null, v));
            },
            (err?: Error) => {
                if (err) {
                    request.dispose();
                    request = null;
                    //语言包报错不影响游戏运行，忽略
                    this.__allComplete();
                    return;
                }
                let ref = request.getRef();
                UIPackage.setStringsSource(this.parseXML(ref.content.text));
                this.__allComplete();
            }
        );
        request.load();
    }

    private parseXML(value: string): string {
        var xml = new DOMParser().parseFromString(value, "text/xml").documentElement;
        var nodes = xml.childNodes;
        var length1: number = nodes.length;
        for (var i1: number = 0; i1 < length1; i1++) {
            var cxml: any = nodes[i1];
            if (cxml.tagName == "string") {
                var key: string = cxml.getAttribute("name");
                var text: string = cxml.childNodes.length > 0 ? cxml.firstChild.nodeValue : "";
                var i: number = key.indexOf("-");
                if (i == -1)
                    continue;
                let t_str = I18N.tr(text);
                cxml.textContent = t_str;
            }
        }
        const serializer = new XMLSerializer();
        return serializer.serializeToString(xml);
    }

    private __onError(err: Error): void {
        Logger.error("Engine Init Error:" + err.message, "gui");
    }

    private __allComplete(err?: Error): void {
        if (err) {
            Logger.error("Engine Init Error" + err.message, "gui");
            return;
        }
        Logger.log("Engine Init Completed", "gui");
        this.emit(Event.COMPLETE, Event.create(Event.COMPLETE, this));
    }
}