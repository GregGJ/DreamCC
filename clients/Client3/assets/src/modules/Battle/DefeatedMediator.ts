import { _decorator, Component } from 'cc';
import { IGUIMediator,IViewCreator,GUIMediator} from 'dream-cc-gui';
import { BattleBinder, UI_DefeatedWindow } from "./BattleBinder";
import { FGUIEvent } from 'fairygui-cc';

const { ccclass, property } = _decorator;

@ccclass('DefeatedViewCreator')
export default class DefeatedViewCreator extends Component implements IViewCreator {

    createMediator(): IGUIMediator {
        BattleBinder.bindAll();
        return new DefeatedMediator();
    }
}

export class DefeatedMediator extends GUIMediator {

    private callback: (index: number) => void;
    constructor() {
        super();
    }

    init() {
        super.init();
        this.bindEvent(this.view.m_ui_view.m_btn_restart, FGUIEvent.CLICK, this.__restartButtonClick, this);
        this.bindEvent(this.view.m_ui_view.m_btn_exit, FGUIEvent.CLICK, this.__exitButtonClick, this);
    }

    show(data?: any): void {
        super.show(data);
        this.callback = data;
    }

    showedUpdate(data?: any): void {

    }

    hide(): void {
        super.hide();

    }

    destroy(): void {
        super.destroy();

    }

    private __restartButtonClick(e: FGUIEvent): void {
        if (this.callback) {
            this.callback(0);
        }
        this.close();
    }

    private __exitButtonClick(e: FGUIEvent): void {
        if (this.callback) {
            this.callback(1);
        }
        this.close();
    }

    private get view(): UI_DefeatedWindow {
        return this.ui as UI_DefeatedWindow;
    }
}
