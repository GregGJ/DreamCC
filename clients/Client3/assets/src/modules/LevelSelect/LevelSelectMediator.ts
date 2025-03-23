import { _decorator, Component } from 'cc';
import { GUIManager, GUIMediator, IGUIMediator, IViewCreator } from 'dream-cc-gui';
import { LevelSelectBinder, UI_LevelSelectView, UI_LevelSelectWindow } from './LevelSelectBinder';
import { LevelAccessor } from '../../games/configs/LevelAccessor';
import { ConfigManager, DictionaryProperty, I18N, ModuleManager } from 'dream-cc-core';
import { FGUIEvent } from 'fairygui-cc';
import { ConfigKeys } from '../../games/configs/ConfigKeys';
import { RecordPropertys } from '../../models/playerPrefs/RecordPropertys';
import { EXI_Playerprefs } from '../../models_exi/EXI_Playerprefs';
import { ModuleKeys } from '../../games/ModuleKeys';
import { GameMode } from '../../games/enums/GameMode';
import { GamePath } from '../../games/GamePath';
import { GUIKeys } from '../../games/consts/GUIKeys';


const { ccclass, property } = _decorator;

@ccclass('LevelSelectViewCreator')
export default class LevelSelectViewCreator extends Component implements IViewCreator {

    createMediator(): IGUIMediator {
        LevelSelectBinder.bindAll();
        return new LevelSelectMediator();
    }
}

export class LevelSelectMediator extends GUIMediator {

    /**
     * 关卡配置
     */
    private __levelAcc: LevelAccessor | null = null;
    private __levelConfig: Config.Level.Level | null = null;
    /**
     * 所有关卡记录
     */
    private __levels: DictionaryProperty | null = null;

    private __levelId: number = 1;
    /**
     * 当前关卡记录
     */
    private __levelPref: DictionaryProperty | null = null;

    constructor() {
        super();
        this.modules = [
            ModuleKeys.Playerprefs
        ]
    }

    init() {
        super.init();
        this.view.m_btn_c.title = I18N.tr("Campaign");
        this.view.m_btn_h.title = I18N.tr("Heroes");
        this.view.m_btn_i.title = I18N.tr("Iron");

        this.bindEvent(this.view.m_btn_close, FGUIEvent.CLICK, this.close, this);
        this.bindEvent(this.view.m_btn_difficulty, FGUIEvent.CLICK, this.__difficultyBtnClick, this);
        this.bindEvent(this.view.m_c1, FGUIEvent.STATUS_CHANGED, this.__modeChanged, this);
        this.bindEvent(this.view.m_btn_battle, FGUIEvent.CLICK, this.__battleButtonClick, this);
        //关卡配置
        this.__levelAcc = ConfigManager.getAccessor(ConfigKeys.Level_Level) as LevelAccessor;
        //关卡记录
        this.__levels = this.recordModule.currentGame.get(RecordPropertys.LEVELS) as DictionaryProperty;
    }

    show(data?: any): void {
        super.show(data);
        this.__levelId = Number(data);
        this.__refreshView();
    }


    showedUpdate(data?: any): void {

    }

    hide(): void {
        super.hide();

    }

    destroy(): void {
        super.destroy();
        this.__levelAcc = null;
        this.__levels = null;
        this.__levelPref = null;
        this.__levelConfig = null;
    }

    private __refreshView(): void {
        //关卡记录
        this.__levelPref = this.__levels!.get(this.__levelId?.toString()) as DictionaryProperty;

        //默认选择战役模式
        this.view.m_c1.selectedIndex = GameMode.CAMPAIGN;
        //关卡名称
        this.view.m_title_1.text = I18N.tr("LEVEL_" + this.__levelId + "_TITLE");
        //缩略图
        this.view.m_img_thumb.url = GamePath.imageURL("maps/thumbs/stage_thumbs_00" + (this.__levelId < 10 ? "0" + this.__levelId : this.__levelId));

        this.__refreshStars();

        //当前难度
        let difficulty = this.recordModule.playerRecord.get(RecordPropertys.DIFFICULTY).getValue();

        this.view.m_btn_difficulty.m_c1.selectedIndex = difficulty;
        this.__refreshMode(difficulty);
    }

    private __refreshStars(): void {
        let stars: number = this.__levelPref.get(RecordPropertys.STARS).getValue();
        for (let index = 0; index < 3; index++) {
            let starView = this.view.getChild("star_" + (index + 1));
            starView.visible = index < stars;
        }
        if (stars < 3) {
            this.view.m_btn_h.enabled = this.view.m_btn_i.enabled = false;
        } else {
            this.view.m_btn_h.enabled = this.view.m_btn_i.enabled = true;
        }
        if (this.__levelPref.get(GameMode.HEROIC.toString()).getValue() > 0) {
            this.view.m_star_4.visible = true;
        } else {
            this.view.m_star_4.visible = false;
        }
        if (this.__levelPref.get(GameMode.IRON.toString()).getValue() > 0) {
            this.view.m_star_5.visible = true;
        } else {
            this.view.m_star_5.visible = false;
        }
    }

    private __refreshMode(selectDifficulty: number): void {
        //模式
        let mode = this.view.m_c1.selectedIndex;
        //历史通关难度记录
        let difficulty = this.__levelPref.get(mode.toString()).getValue();
        if (difficulty < 0) {
            this.view.m_img_pass_diff.url = null;
        } else {
            this.view.m_img_pass_diff.url = GamePath.imageURL("levelSelect/levelSelect_difficultyCompleted_000" + (difficulty + 1));
        }
        this.__levelConfig = this.__levelAcc.getLevel(this.__levelId, selectDifficulty, mode);
        if (mode == GameMode.CAMPAIGN) {
            this.view.m_title_2.text = I18N.tr("Campaign")
            this.view.m_txt_desc.text = I18N.tr("LEVEL_" + this.__levelId + "_HISTORY");
        } else {
            this.view.m_title_2.text = mode == GameMode.HEROIC ? I18N.tr("Heroic") : I18N.tr("Iron");
            this.view.m_txt_desc.text = mode == GameMode.HEROIC ? I18N.tr("LEVEL_MODE_HEROIC_DESCRIPTION") : I18N.tr("LEVEL_MODE_IRON_DESCRIPTION")
        }
        //挑战规则
        this.view.m_title_3.text = I18N.tr("LEVEL_SELECT_CHALLENGE_RULES");
        //塔最大等级
        this.view.m_txt_lvl_limit.text = this.__levelConfig!.towerMaxLevel.toString();
        //是否允许英雄上场
        this.view.m_img_hero.visible = this.__levelConfig!.disableHero == 1;
        //禁用塔列表
        let list = this.__levelConfig.disabledTowerType ? this.__levelConfig.disabledTowerType : [];
        for (let index = 1; index < 5; index++) {
            const id = list[index];
            let img = this.view.getChild("img_dis_" + index);
            img.visible = list.indexOf(id) >= 0;
        }
    }

    private __battleButtonClick(e: FGUIEvent): void {
        this.close();
        GUIManager.open(
            GUIKeys.Battle,
            {
                level: this.__levelId,
                difficulty: this.view.m_btn_difficulty.m_c1.selectedIndex,
                mode: this.view.m_c1.selectedIndex
            }
        );
    }

    private __modeChanged(): void {
        let difficulty = this.view.m_btn_difficulty.m_c1.selectedIndex;
        this.__refreshMode(difficulty);
    }

    private __difficultyBtnClick(e: FGUIEvent): void {
        let difficulty: number = (this.view.m_btn_difficulty.m_c1.selectedIndex + 1) % 3;
        this.view.m_btn_difficulty.m_c1.selectedIndex = difficulty;
        //保存当前选择的难度
        this.recordModule.playerRecord.update(RecordPropertys.DIFFICULTY, difficulty);
        this.recordModule.save();
        //刷新界面
        this.__refreshMode(difficulty);
    }

    private get view(): UI_LevelSelectView {
        return (this.ui as UI_LevelSelectWindow).m_view as UI_LevelSelectView;
    }

    private get recordModule(): EXI_Playerprefs.Module_playerPrefs {
        return <any>this.getModule(ModuleKeys.Playerprefs) as EXI_Playerprefs.Module_playerPrefs;
    }
}
