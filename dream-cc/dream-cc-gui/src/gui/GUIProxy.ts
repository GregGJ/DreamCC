import { assetManager, Component, Node } from "cc";
import { GUIPlugin } from "../GUIPlugin";
import { GUIManager } from "./GUIManager";
import { IGUIInfo } from "./IGUIInfo";
import { IGUIMediator } from "./IGUIMediator";
import { IViewCreator } from "./IViewCreator";
import { ILayer } from "./layer/ILayer";
import { LayerManager } from "./layer/LayerManager";
import { LoadingView } from "./loadingView/LoadingView";
import { Event, EventDispatcher, Module, ModuleManager, Res, ResRequest, ResURL } from "dream-cc-core";



enum LoadState {
    Null,
    Loading,
    Loaded
}

/**
 * GUI代理，将资源加载和Mediator逻辑隔离开
 */
export class GUIProxy {

    /**用于Creator创建器的统一帮助节点 */
    private static createNode: Node = new Node("createHelpNode");

    info?: IGUIInfo;

    /**GUI中介*/
    mediator?: IGUIMediator;

    /**关闭时间*/
    closeTime: number = 0;

    /**数据 */
    data: any;

    /**引用的资源 */
    urls: Array<ResURL>;

    assetsRequest: ResRequest;

    /**是否在显示中*/
    private __showing: boolean = false;

    /**加载状态 */
    private __loadState: LoadState = LoadState.Null;

    constructor(info: IGUIInfo) {
        this.info = info;
        if (!this.info) {
            throw new Error("UI信息不能为空！");
        }
        this.urls = [];
    }

    /**
     * 加载AssetBundle
     */
    private __loadAssetBundle(): void {
        this.__loadState = LoadState.Loading;
        if (!assetManager.getBundle(this.info.bundleName)) {
            assetManager.loadBundle(this.info.bundleName, this.__assetBundleLoaded.bind(this));
        } else {
            this.__assetBundleLoaded();
        }
    }

    /**
     * AssetBundle加载完成
     */
    private __assetBundleLoaded(): void {
        //UI界面包资源
        if (GUIPlugin.uiPackageURL == undefined) {
            throw new Error("GUIModule.uiPackageURL未定义!");
        }
        this.urls.push(GUIPlugin.uiPackageURL(this.info.packageName, Res.TYPE.FGUI, this.info.bundleName));
        //创建Mediator
        let viewCreatorCom: Component = GUIProxy.createNode.addComponent(this.info.key + "ViewCreator");
        let viewCreator: IViewCreator = <unknown>viewCreatorCom as IViewCreator;
        if (!viewCreator) {
            throw new Error(this.info.key + "ViewCreator类不存在或未实现IViewCreator!");
        }
        this.mediator = viewCreator.createMediator();
        //进度界面
        if (this.mediator.showLoadingView) {
            LoadingView.show();
        }
        //销毁组件
        viewCreatorCom.destroy();

        //加载依赖的模块
        if (this.mediator.modules && this.mediator.modules.length > 0) {
            ModuleManager.single.load(
                this.mediator.modules,
                (p_progress: number) => {
                    let progress: number = p_progress * 0.5 * this.mediator.loadingViewTotalRatio;
                    LoadingView.changeData({ label: this.info.key + " Modules startup...", progress: progress })
                },
                (err?: Error) => {
                    this.__loadAssets();
                }
            );
        } else {
            this.__loadAssets();
        }
    }

    //加载UI资源
    private __loadAssets(): void {
        //配置表
        if (this.mediator.configs && this.mediator.configs.length > 0) {
            for (let index = 0; index < this.mediator.configs.length; index++) {
                const sheet = this.mediator.configs[index];
                const url = Res.sheet2URL(sheet);
                this.urls.push(url);
            }
        }
        //依赖的资源
        if (this.mediator.assets && this.mediator.assets.length > 0) {
            for (let index = 0; index < this.mediator.assets.length; index++) {
                const url = this.mediator.assets[index];
                this.urls.push(url);
            }
        }

        this.assetsRequest = Res.create(
            this.urls,
            this.info.key,
            (p_progress: number) => {
                let progress: number = (0.5 + p_progress * 0.5) * this.mediator.loadingViewTotalRatio;
                LoadingView.changeData({ label: this.info.key + " Res Loading...", progress: progress })
            },
            (err?: Error) => {
                if (err) {
                    this.assetsRequest.dispose();
                    this.assetsRequest = null;
                    LoadingView.changeData({ label: this.info.key + " Res Load Err:" + err });
                    return;
                }
                this.__create_ui();
            }
        );
        this.assetsRequest.load();
    }

    /**
     * 创建UI
     */
    private __create_ui(): void {
        this.mediator!.createUI(this.info, this.__create_ui_callback.bind(this));
    }

    /**
     * UI创建完成回调
     */
    private __create_ui_callback(): void {
        LoadingView.changeData({ progress: this.mediator.loadingViewTotalRatio });
        this.__loadState = LoadState.Loaded;
        this.mediator!.init();
        this.mediator.inited = true;
        if (this.__showing) {
            this.__show();
        }
    }

    private __add_to_layer(): void {
        this.layer.addChildAt(this.mediator!.viewComponent, this.getLayerChildCount());
        this.mediator!.viewComponent!.visible = true;
    }

    tick(dt: number): void {
        if (this.__loadState == LoadState.Loaded) {
            if (this.mediator) {
                this.mediator.tick(dt);
            }
        }
    }

    show(data?: any): void {
        this.__showing = true;
        this.data = data;
        this.__show();
    }

    showedUpdate(data: any): void {
        if (this.mediator && this.__showing) {
            this.mediator.showedUpdate(data);
        }
    }

    private __show(): void {
        if (this.__loadState == LoadState.Null) {
            this.__loadAssetBundle();
        } else if (this.__loadState == LoadState.Loading) {
            //加载中啥也不干
        } else {
            this.__add_to_layer();
            //进度界面
            if (this.mediator!.showLoadingView && this.mediator!.closeLoadingView) {
                LoadingView.hide();
            }
            this.mediator!.show(this.data);
            this.data = null;
            //如果界面已经被关闭(这是有可能的！);
            if (!GUIManager.isOpen(this.info.key)) {
                return;
            }
            if (this.mediator.playShowAnimation) {
                this.mediator.playShowAnimation(this.__showAnimationPlayed.bind(this));
            } else {
                EventDispatcher.Main.emit(Event.SHOW, this.info!.key);
            }
        }
    }

    private __showAnimationPlayed(): void {
        EventDispatcher.Main.emit(Event.SHOW, this.info!.key);
    }

    hide(): void {
        if (this.__loadState == LoadState.Loading) {
            this.__loadState = LoadState.Null;
        } else if (this.__loadState == LoadState.Loaded) {
            //如果在显示中
            if (this.__showing) {
                if (this.mediator.playHideAnimation) {
                    this.mediator.playHideAnimation(this.__hideAnimationPlayed.bind(this));
                } else {
                    this.__hide();
                }
            }
        }
    }

    private __hideAnimationPlayed(): void {
        if (this.__showing) {
            this.__hide();
        }
    }

    private __hide(): void {
        this.mediator!.viewComponent!.visible = false;
        this.mediator!.hide();
        this.__showing = false;
        EventDispatcher.Main.emit(Event.HIDE, this.info!.key);
    }

    destroy(): void {
        console.log("UI销毁=>" + this.info?.key);
        if (this.assetsRequest) {
            this.assetsRequest.dispose();
            this.assetsRequest = null;
        }
        this.mediator!.destroy();
        this.mediator = undefined;
        this.info = undefined;
        this.data = null;
    }

    private getLayerChildCount(): number {
        return this.layer.getCount();
    }

    private get layer(): ILayer {
        let l: ILayer | undefined = LayerManager.getLayer(this.info!.layer);
        if (l === undefined) {
            throw new Error("layer：" + this.info!.layer + "不存在！");
        }
        return l;
    }

    /**
     * 获取组件
     * @param path 
     */
    getComponent(path: string): any {
        if (!this.mediator) {
            return null;
        }
        return this.mediator.getUIComponent(path);
    }
}
