import { _decorator, Component, director } from 'cc';
import { FSMComponent } from 'dream-cc-ai';
import { I18N } from 'dream-cc-core';
import { LevelManager } from 'dream-cc-ecs';
import { GUIManager, GUIMediator, IGUIMediator, IViewCreator } from 'dream-cc-gui';
import { FGUIEvent } from 'fairygui-cc';
import { GUIKeys } from '../../games/consts/GUIKeys';
import { BattleBinder, UI_BattleView } from "./BattleBinder";
import { BattleModel } from './datas/BattleModel';
import { FSMStates } from './fsm/FSMStates';
import { BattleEntitys } from './levels/BattleEntitys';
import { BattleMode } from './levels/BattleMode';
import { LevelKeys } from './levels/LevelKeys';

const { ccclass, property } = _decorator;

@ccclass('BattleViewCreator')
export default class BattleViewCreator extends Component implements IViewCreator {

    createMediator(): IGUIMediator {
        BattleBinder.bindAll();
        return new BattleMediator();
    }
}

export class BattleMediator extends GUIMediator {

    constructor() {
        super();
        this.showLoadingView = true;
        this.closeLoadingView = false;
        this.loadingViewTotalRatio = 0.5;
    }

    init() {
        super.init();

        //初始化关卡
        let canvas = director.getScene().getChildByName("Canvas");
        let root2D = canvas.getChildByName("Root2D");
        LevelManager.single.initLevel(LevelKeys.Battle, root2D, 1000);

        this.bindAA(this.model, "life", this.view.m_ui_top.m_ui_info.m_txt_hp, "text");
        this.bindAA(this.model, "glod", this.view.m_ui_top.m_ui_info.m_txt_gold, "text");
        this.bindAM(this.model, ["waveIndex", "waveTotal"], this.__waveChanged, this);

        this.bindEvent(this.view.m_ui_top.m_btn_pause, FGUIEvent.CLICK, this.__pauseButtonClick, this);
    }

    show(data?: any): void {
        super.show(data);
        this.model.mediator = this;
        //进入战斗关卡
        LevelManager.single.enter(LevelKeys.Battle, new BattleMode(), data);
    }

    showedUpdate(data?: any): void {

    }

    tick(dt: number): void {

    }

    hide(): void {
        super.hide();
        LevelManager.single.exit(LevelKeys.Battle);
    }

    destroy(): void {
        super.destroy();

    }

    /**
     * 波次数据改变
     * @param propertys 
     */
    private __waveChanged(propertys: Array<string>): void {
        this.view.m_ui_top.m_ui_info.m_txt_wave.text = I18N.tr("MENU_HUD_WAVES", this.model.waveIndex, this.model.waveTotal);
    }

    private __pauseButtonClick(e: FGUIEvent): void {
        this.model.paused = true;
        GUIManager.open(GUIKeys.Settings, { state: 2, close: this.__settingsClose.bind(this) });
    }

    private __settingsClose(value: number): void {
        if (value == 1) {//退出
            this.close(true);
        } else if (value == 2) {//重新开始
            console.log("重新开始");
            this.model.fsm.switchState(FSMStates.Init,this.data);
        } else {
            console.log("继续");
            this.model.paused = false;
        }
    }

    private get view(): UI_BattleView {
        return this.ui as UI_BattleView;
    }

    private get model(): BattleModel {
        return BattleModel.single;
    }
}
