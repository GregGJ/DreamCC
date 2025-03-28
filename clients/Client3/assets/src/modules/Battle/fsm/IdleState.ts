import { AudioManager } from "dream-cc-core";
import { GUIMediator, LoadingView } from "dream-cc-gui";
import { GamePath } from "../../../games/GamePath";
import { UI_BattleView } from "../BattleBinder";
import { BaseState } from "./BaseState";
import { FSMStates } from "./FSMStates";
import { BattleEntityFactory } from "../levels/BattleEntityFactory";




export class IdleState extends BaseState {
    
    constructor(level:string) {
        super("IdleState",level);
    }

    enter(data?: any): void {
        super.enter(data);

        LoadingView.hide();
        //播放战斗前置音乐
        AudioManager.playMusic(GamePath.soundURL("MusicBattlePreparationsForest"));

        this.__buildTerrains();

        this.ui.m_ui_bottom.m_ui_start.m_btn_start.enabled = true;
        this.ui.m_ui_bottom.m_ui_start.m_btn_start.onClick(this.__startButtonClick, this);
    }

    exit(): void {
        super.exit();
        this.ui.m_ui_bottom.m_ui_start.m_btn_start.offClick(this.__startButtonClick, this);
    }
    
    /**
     * 构建塔点
     */
    private __buildTerrains(): void {
        let list = this.model.terrainConfig!.towers;
        for (let index = 0; index < list.length; index++) {
            const config = list[index];
            BattleEntityFactory.createTowerPoint(this.world!, config);
        }
    }

    private __startButtonClick(): void {
        AudioManager.playSound(GamePath.soundURL("Sound_WaveIncoming"));
        this.fsm.switchState(FSMStates.Running);
    }

    get ui(): UI_BattleView {
        return this.model.mediator.ui as UI_BattleView;
    }
}