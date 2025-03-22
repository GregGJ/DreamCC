import { Binder } from "dream-cc-core";
import { ITabData } from "./ITabData";
import { ITabPage } from "./ITabPage";




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

    show(data?: ITabData): void {
        this.bindByRecords();
    }

    showedUpdate(data?: ITabData): void {

    }

    hide(): void {
        this.unbindByRecords();
    }

    destroy(): void {
        super.destroy();
    }
}