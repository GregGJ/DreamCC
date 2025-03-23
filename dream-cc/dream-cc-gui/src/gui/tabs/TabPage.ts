import { Binder } from "dream-cc-core";
import { ITabPage } from "./ITabPage";
import { TabData } from "./TabData";




export class TabPage extends Binder implements ITabPage {

    /**
     * UI
     */
    ui: any;

    /**
     * 所属的Mediator
     */
    owner: any;

    constructor() {
        super();
    }

    init(): void {
        super.init();
    }

    show(data?: any): void {
        this.bindByRecords();
    }

    showedUpdate(data?: any): void {

    }

    hide(): void {
        this.unbindByRecords();
    }

    destroy(): void {
        super.destroy();
    }
}