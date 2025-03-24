import { _decorator, Component } from 'cc';
import { IGUIMediator, IViewCreator, GUIMediator, GUIManager, LoadingView } from 'dream-cc-gui';
import { BattleBinder, UI_BattleView } from "./BattleBinder";
import { FGUIEvent } from 'fairygui-cc';
import { GUIKeys } from '../../games/consts/GUIKeys';
import { ConfigKeys } from '../../games/configs/ConfigKeys';
import { BattleModel } from './datas/BattleModel';
import { Event, I18N, TaskQueue } from 'dream-cc-core';
import { LoadCommonTask } from './inits/LoadCommonTask';
import { LoadTerrainTask } from './inits/LoadTerrainTask';
import { LoadWaveTask } from './inits/LoadWaveTask';
import { LoadTowerTask } from './inits/LoadTowerTask';

const { ccclass, property } = _decorator;

@ccclass('BattleViewCreator')
export default class BattleViewCreator extends Component implements IViewCreator {

    createMediator(): IGUIMediator {
        BattleBinder.bindAll();
        return new BattleMediator();
    }
}

export class BattleMediator extends GUIMediator {


    private __taskQueue: TaskQueue;

    constructor() {
        super();
        this.showLoadingView = true;
        this.closeLoadingView = false;
        this.loadingViewTotalRatio = 0.5;

        this.configs = [
            ConfigKeys.Monster_Monster,
            ConfigKeys.Tower_Tower,
            ConfigKeys.Skills_Skill,
        ]
    }

    init() {
        super.init();


        this.bindAA(this.model, "life", this.view.m_ui_top.m_ui_info.m_txt_hp, "text");
        this.bindAA(this.model, "glod", this.view.m_ui_top.m_ui_info.m_txt_gold, "text");
        this.bindAM(this.model, ["waveIndex", "waveTotal"], this.__waveChanged, this);

        this.bindEvent(this.view.m_ui_top.m_btn_pause, FGUIEvent.CLICK, this.__pauseButtonClick, this);
    }

    show(data?: any): void {
        super.show(data);
        this.model.init(data);

        this.__taskQueue = new TaskQueue();
        this.__taskQueue.addEventHandler(this.__taskEventHandler, this);

        this.__taskQueue.addTask(new LoadCommonTask());
        this.__taskQueue.addTask(new LoadTerrainTask());
        this.__taskQueue.addTask(new LoadWaveTask());
        this.__taskQueue.addTask(new LoadTowerTask());
        //开始任务
        this.__taskQueue.start(data);
    }

    showedUpdate(data?: any): void {

    }

    hide(): void {
        super.hide();

    }

    destroy(): void {
        super.destroy();

    }

    private __taskEventHandler(e: Event): void {
        switch (e.type) {
            case Event.PROGRESS:
                LoadingView.changeData({ progress: this.loadingViewTotalRatio + e.progress * 0.2 })
                break;
            case Event.ERROR:
                LoadingView.changeData({ label: e.error.message });
                break;
            case Event.COMPLETE:
                this.__taskQueue.destroy();
                this.__taskQueue = null;
                LoadingView.hide();
                break;
        }
    }

    /**
     * 波次数据改变
     * @param propertys 
     */
    private __waveChanged(propertys: Array<string>): void {
        this.view.m_ui_top.m_ui_info.m_txt_wave.text = I18N.tr("MENU_HUD_WAVES", this.model.waveIndex, this.model.waveTotal);
    }

    private __pauseButtonClick(e: FGUIEvent): void {
        GUIManager.open(GUIKeys.Settings, { state: 2, close: this.__settingsClose.bind(this) });
    }

    private __settingsClose(value: number): void {
        if (value == 1) {//退出
            this.close(true);
        } else if (value == 2) {//重新开始
            // this.model.bm.Restart();
            console.log("重新开始");
        } else {
            // this.model.bm.Resume();
            console.log("继续");
        }
    }

    private get view(): UI_BattleView {
        return this.ui as UI_BattleView;
    }

    private get model(): BattleModel {
        return BattleModel.single;
    }
}
