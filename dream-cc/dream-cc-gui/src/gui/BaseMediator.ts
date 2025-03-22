import { Binder } from "dream-cc-core";
import { GComponent } from "fairygui-cc";







/**
 * 基础Mediator类
 */
export class BaseMediator extends Binder {

    /**UI组件 */
    ui: GComponent | null = null;

    /**外部传参*/
    data: any;

    constructor() {
        super();
    } 

    init(): void {
        super.init();
    }

    tick(dt: number): void {

    }

    show(data: any): void {
        this.data = data;
        this.bindByRecords();
    }

    showedUpdate(data?: any): void {
        this.data = data;
    }

    hide(): void {
        this.unbindByRecords();
    }
    
    /**
     * 根据名称或路径获取组件
     * @param path 
     * @returns 
     */
    getUIComponent(path: string): any {
        let paths: Array<string> = path.split("/");
        let ui: any = this.ui;
        let index: number = 0;
        let uiName: string;
        while (ui && index < paths.length) {
            uiName = paths[index];
            //兼容m_写法
            if (uiName.startsWith("m_")) {
                uiName = uiName.replace("m_", "");
            }
            ui = ui.getChild(uiName);
            index++;
        }
        return ui;
    }
}