import { _decorator, Component } from 'cc';
import { IGUIMediator, IViewCreator, GUIMediator, GUIManager } from 'dream-cc-gui';
import { BattleBinder, UI_SettlementWindow } from "./BattleBinder";
import { FGUIEvent } from 'fairygui-cc';
import { GUIKeys } from '../../games/consts/GUIKeys';

const { ccclass, property } = _decorator;

@ccclass('SettlementViewCreator')
export default class SettlementViewCreator extends Component implements IViewCreator {

    createMediator(): IGUIMediator {
        BattleBinder.bindAll();
        return new SettlementMediator();
    }
}

export class SettlementMediator extends GUIMediator {

    constructor() {
        super();
    }

    init() {
        super.init();
        this.bindEvent(this.view.m_ui_view.m_btn_continue, FGUIEvent.CLICK, this.__continueButtonClick, this);
    }

    show(data?: any): void {
        super.show(data);
        this.view.m_ui_view.m_btn_continue.visible = false;
        let starFrame: number = 0;
        let endFrame: number = 0;
        switch (data.stars) {
            case 1:
                endFrame = 18;
                break;
            case 2:
                endFrame = 37
                break;
            case 3:
                endFrame = 53;
                break;
        }
        this.view.m_ui_view.m_ani_star.playing = true;
        this.view.m_ui_view.m_ani_star.setPlaySettings(starFrame, endFrame, 1, endFrame, () => {
            this.view.m_ui_view.m_btn_continue.visible = true;
        });
    }

    showedUpdate(data?: any): void {

    }

    hide(): void {
        super.hide();

    }

    destroy(): void {
        super.destroy();

    }

    private __continueButtonClick(e: FGUIEvent): void {
        this.close();
        //结算
        GUIManager.open(GUIKeys.Map, this.data);
    }

    private get view(): UI_SettlementWindow {
        return this.ui as UI_SettlementWindow;
    }
}
