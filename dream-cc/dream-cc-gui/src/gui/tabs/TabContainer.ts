import { ITabPage } from "./ITabPage";
import { GComponent } from "fairygui-cc";
import { TabPage } from "./TabPage";
import { Binder } from "dream-cc-core";
import { TabData } from "./TabData";





/**
 * 页签容器组件
 */
export class TabContainer extends Binder {
    /**Tab容器 */
    ui: GComponent;
    /**所属*/
    owner: any;

    private __pageInstanceMap: Map<number, ITabPage>;
    /**当前页签索引 */
    currentIndex: number;
    /**当前页签 */
    currentPage: ITabPage;
    /**页签创建函数*/
    private __createPage: (index: number) => ITabPage;
    private __showing: boolean;

    constructor(content: GComponent, createPage: (index: number) => ITabPage, owner: any) {
        super();
        this.__pageInstanceMap = new Map<number, ITabPage>();
        this.ui = content;
        this.__createPage = createPage;
        this.owner = owner;
        this.init();
    }

    /**切换到某个页签 */
    switchPage(index: number, data?: any): void {
        if (index == this.currentIndex) {
            return;
        }
        this.currentIndex = index;
        //先隐藏当前页签
        if (this.currentPage) {
            if (this.currentPage.ui.parent) {
                this.currentPage.hide();
                this.ui.removeChild(this.currentPage.ui);
            }
            this.currentPage = null;
        }
        this.currentPage = this.getPage(index);
        if (this.__showing) {
            //显示
            this.currentPage.show(data);
            this.ui.addChild(this.currentPage.ui);
        }
    }

    init(): void {
        super.init();
    }

    show(data?: any): void {
        this.__showing = true;
        let page: number = data ? data.page || 0 : 0;
        let pageData: TabData = data ? data.pageData || null : null;
        this.switchPage(page, pageData);
        this.bindByRecords();
    }

    showedUpdate(data?: any): void {
        let page: number = data ? data.page || 0 : this.currentIndex;
        let pageData: TabData = data ? data.pageData || null : null;
        if (page == this.currentIndex) {
            this.currentPage.showedUpdate(pageData);
        } else {
            this.switchPage(page, pageData);
        }
    }

    hide(): void {
        if (this.currentPage) {
            this.currentPage.hide();
            this.ui.removeChild(this.currentPage.ui);
            this.currentPage = null;
        }
        this.currentIndex = -1;
        this.__showing = false;
        this.unbindByRecords();
    }

    private getPage(index: number): ITabPage {
        if (this.__pageInstanceMap.has(index)) {
            return this.__pageInstanceMap.get(index);
        }
        if (!this.__createPage) {
            throw new Error("Page创建函数未定义！");
        }
        let result: ITabPage = this.__createPage(index);
        result.owner = this.owner;
        result.ui.setSize(this.ui.width, this.ui.height);
        result.init();
        this.__pageInstanceMap.set(index, result);
        return result;
    }

    destroy(): void {
        super.destroy();
        let values: IterableIterator<ITabPage> = this.__pageInstanceMap.values();
        let page: TabPage;
        for (let index = 0; index < this.__pageInstanceMap.size; index++) {
            page = values.next().value;
            page.destroy();
        }
        this.__pageInstanceMap.clear();
        this.__pageInstanceMap = null;
        this.ui = null;
        this.currentPage = null;
        this.currentIndex = undefined;
    }
}