import { Color } from "cc";
import { AsyncOperation, GComponent, GGraph, GObject, UIPackage } from "fairygui-cc";
import { GUIPlugin } from "../GUIPlugin";
import { BaseMediator } from "./BaseMediator";
import { GUIManager } from "./GUIManager";
import { IGUIInfo } from "./IGUIInfo";
import { IGUIMediator } from "./IGUIMediator";
import { SubGUIMediator } from "./SubGUIMediator";
import { ITabData } from "./tabs/ITabData";
import { TabContainer } from "./tabs/TabContainer";
import { Module, ModuleManager, ResURL } from "dream-cc-core";


/**
 * UI逻辑类
 */
export class GUIMediator extends BaseMediator implements IGUIMediator {

    info: IGUIInfo | null = null;
    /**依赖的配置表（构造函数中赋值）*/
    configs: Array<string>;
    /**依赖的资源（构造函数中赋值）*/
    assets: Array<ResURL>;
    /**依赖的模块（构造函数中赋值）*/
    modules: Array<string>;
    /**是否显示进度界面 */
    showLoadingView: boolean = false;
    /**显示界面时是否关闭进度条*/
    closeLoadingView: boolean = true;
    /**界面从开始加载到底层调用Show方法之前的进度总比值 */
    loadingViewTotalRatio: number = 1;
    /**根节点 */
    viewComponent: GComponent | null = null;
    /**页签容器*/
    tabContainer: TabContainer;
    /**
     * 播放显示动画
     * @param complete 
     */
    playShowAnimation?: (complete: () => void) => void;
    /**
     * 界面关闭时播放的动画
     * @param complete 
     */
    playHideAnimation?: (complete: () => void) => void;
    /**遮罩 */
    private __mask: GGraph | null = null;

    /**创建UI完成回调*/
    private __createdCallBack: () => void;

    /**子Mediator(用于代码拆分),记住只能在Init函数中赋值*/
    protected $subMediators: Array<SubGUIMediator>;

    constructor() {
        super();
    }

    /**
     * 创建UI
     * @param info 
     * @param created 
     */
    createUI(info: any, created: () => void): void {
        this.info = info;
        if (this.info == null) {
            throw new Error("GUI 信息不能为空");
        }
        this.__createdCallBack = created;
        this.__createUI(true);
    }

    private __asyncCreator: AsyncOperation
    private __createUI(async: boolean): void {
        let packageName: string = this.info.packageName;
        let com_name: string = this.info!.comName;
        if (this.info!.comName.startsWith("UI_")) {
            com_name = this.info!.comName.substring("UI_".length);
        }
        if (async) {
            this.__asyncCreator = new AsyncOperation();
            this.__asyncCreator.callback = this.__uiCreated.bind(this);
            this.__asyncCreator.createObject(packageName, com_name);
        } else {
            try {
                let ui: GObject = UIPackage.createObject(packageName, com_name);
                this.__uiCreated(ui);
            } catch (err) {
                throw new Error("创建界面失败：" + this.info!.packageName + " " + com_name);
            }
        }
    }

    private __uiCreated(ui: GObject): void {
        let uiCom: GComponent = ui.asCom;
        uiCom.makeFullScreen();
        //如果需要遮罩
        if (this.info!.modal) {
            this.ui = uiCom;
            this.viewComponent = new GComponent();
            this.viewComponent.makeFullScreen();

            this.__mask = new GGraph();
            this.__mask.touchable = true;
            this.__mask.makeFullScreen();

            this.__mask.drawRect(0, Color.BLACK, this.info.maskAlpha ? GUIPlugin.AlphaMaskColor : GUIPlugin.MaskColor);

            this.viewComponent.addChild(this.__mask);
            if (this.info!.modalClose) {
                this.__mask.onClick(this._maskClickHandler, this);
            }
            this.viewComponent.addChild(this.ui!);
        } else {
            this.ui = this.viewComponent = uiCom;
        }
        this.ui.name = this.info.key;
        if (this.__createdCallBack) {
            this.__createdCallBack();
            this.__createdCallBack = null;
        }
    }

    protected _maskClickHandler(): void {
        GUIManager.close(this.info.key);
    }

    init(): void {
        super.init();
    }

    show(data?: ITabData): void {
        super.show(data);
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.show(data);
            }
        }
        if (this.tabContainer) {
            this.tabContainer.show(data);
        }
    }

    showedUpdate(data?: ITabData): void {
        super.showedUpdate(data);
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.showedUpdate(data);
            }
        }
        if (this.tabContainer) {
            this.tabContainer.showedUpdate(data);
        }
    }

    hide(): void {
        super.hide();
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.hide();
            }
        }
        if (this.tabContainer) {
            this.tabContainer.hide();
        }
    }

    /**
     * 关闭
     * @param checkLayer 是否检查全屏层记录
     */
    close(checkLayer: boolean = true): void {
        GUIManager.close(this.info.key, checkLayer);
    }

    tick(dt: number): void {
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.tick(dt);
            }
        }
    }

    /**
     * 获取模块
     * @param key 
     * @returns 
     */
    getModule(key: string): Module | undefined {
        if (!this.modules || this.modules.length == 0 || this.modules.indexOf(key) < 0) {
            throw new Error("无法获取未引用的模块：" + key + ",请在Mediator构造函数中引用模块!");
        }
        return ModuleManager.single.getModule(key);
    }

    destroy(): void {
        super.destroy();
        if (this.__mask) {
            this.__mask.offClick(this._maskClickHandler, this);
            this.__mask.dispose();
            this.__mask = null;
        }
        (<GComponent>this.viewComponent).dispose();
        //子界面逻辑类
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.destroy();
            }
        }
        //依赖的配置
        this.configs = null;
        this.assets = null;
        if (this.tabContainer) {
            this.tabContainer.destroy();
            this.tabContainer = null;
        }
        if (this.modules && this.modules.length > 0) {
            for (const moduleName of this.modules) {
                ModuleManager.single.dispose(moduleName);
            }
            this.modules = null;
        }
        this.info = null;
    }
}
