import { EventKeyboard, Input, KeyCode, input } from "cc";
import { DEBUG } from "cc/env";
import { ConfigManager, DictionaryProperty, ModuleManager } from "dream-cc-core";
import { GUIManager, GUIMediator, SubGUIMediator } from "dream-cc-gui";
import { FGUIEvent, GComponent, GMovieClip, GObject } from "fairygui-cc";
import { MapAniUtils } from "../MapAniUtils";
import { UI_Flags, UI_Map } from "../MapBinder";
import { RecordPropertys } from "../../../models/playerPrefs/RecordPropertys";
import { EXI_Playerprefs } from "../../../models_exi/EXI_Playerprefs";
import { ModuleKeys } from "../../../games/ModuleKeys";
import { GameMode } from "../../../games/enums/GameMode";
import { VictoryData } from "../datas/VictoryData";
import { LevelAccessor } from "../../../games/configs/LevelAccessor";
import { ConfigKeys } from "../../../games/configs/ConfigKeys";
import { GUIKeys } from "../../../games/consts/GUIKeys";
import { GameDifficulty } from "../../../games/enums/GameDifficulty";
import { MapPathAccessor } from "../../../games/configs/MapPathAccessor";



/**
 * 关卡
 */
export class FlagsMeditor extends SubGUIMediator {

    /**
     * 关卡配置
     */
    private __levelConfigs: LevelAccessor | null = null;
    /**
     * 关卡记录
     */
    private __levels: DictionaryProperty | null = null;
    /**
     * 胜利数据
     */
    private __victoryData: VictoryData | null = null;

    constructor(ui: GComponent | null, owner: GUIMediator | null) {
        super(ui, owner);
        this.init();
    }

    init(): void {
        super.init();
        this.view.m_mapView.m_layer_flags._children.forEach((value) => {
            value.visible = false;
            this.bindEvent(value, FGUIEvent.CLICK, this.__flagsClick, this);
        });
        this.view.m_mapView.m_layer_path._children.forEach((value) => {
            value.visible = false;
        })
        //关卡配置
        this.__levelConfigs = ConfigManager.getAccessor(ConfigKeys.Level_Level) as LevelAccessor;

    }

    show(data: any): void {
        super.show(data);
        //当前关卡记录
        this.__levels = this.recordModule.currentGame.get(RecordPropertys.LEVELS) as DictionaryProperty;
        
        this.__victoryData = data as VictoryData;
        
        if (DEBUG) {
            // this.OpenToLevel(13);
            input.on(Input.EventType.KEY_DOWN, this.__keyDownHandler, this);
        }
        this.__refreshLevels1();
    }

    hide(): void {
        super.hide();
        if (DEBUG) {
            input.off(Input.EventType.KEY_DOWN, this.__keyDownHandler, this);
        }
    }

    destroy(): void {
        super.destroy();
        this.__levelConfigs = null;
        this.__levels = null;
    }

    private __currentLevel: number = 0;
    private __difficultyIdx: number = 0;
    private __modeIdx: number = 0;
    private __starIdx: number = 0;
    private __flagsClick(evt: FGUIEvent): void {
        const target = GObject.cast(evt.currentTarget) as UI_Flags;
        GUIManager.open(GUIKeys.LevelSelect, target.data);
    }

    private __keyDownHandler(e: EventKeyboard): void {
        if (e.type == Input.EventType.KEY_DOWN) {
            if (e.keyCode == KeyCode.KEY_L) {
                this.__currentLevel = (this.__currentLevel + 1) % 26;
                this.__difficultyIdx = 0;
                this.__modeIdx = 0;
                this.__starIdx = 0;
            }
            if (e.keyCode == KeyCode.KEY_D) {
                this.__difficultyIdx = (this.__difficultyIdx + 1) % 3;
            }
            if (e.keyCode == KeyCode.KEY_M) {
                this.__modeIdx = (this.__modeIdx + 1) % 3;
            }
            if (e.keyCode == KeyCode.KEY_S) {
                this.__starIdx = (this.__starIdx + 1) % 3;
            }
            //测试数据
            this.__victoryData = new VictoryData();
            this.__victoryData!.difficulty = this.__difficultyIdx;
            this.__victoryData!.level = this.__currentLevel;
            this.__victoryData!.mode = this.__modeIdx;
            this.__victoryData.stars = this.__starIdx + 1;

            console.log("通关：" + this.__currentLevel + " 难度:" + this.__difficultyIdx + " 模式:" + this.__modeIdx + " 评分：" + (this.__starIdx + 1));
            this.__refreshLevels1();
        }
    }

    /**
     * 直接开启到某一关卡
     * @param level 
     */
    OpenToLevel(level: number): void {
        this.__currentLevel = level - 2;
        this.recordModule.openToLevel(level);
        for (let curLevel = 1; curLevel < level - 1; curLevel++) {
            //显示路径
            let config = this.__levelConfigs!.get<Config.Level.Level>(["id", "difficulty", "mode"], [curLevel, GameDifficulty.EASY, GameMode.CAMPAIGN]);
            this.__unlockLevels(config.unlocks, false);
        }
    }

    private __refreshLevels1(): void {
        //遍历所有关卡
        for (let levelId = 1; levelId < this.__levelConfigs!.maxLevel; levelId++) {
            const flags = this.view.m_mapView.m_layer_flags.getChild("flags_" + (levelId - 1)) as UI_Flags;
            if (!flags) {
                // throw new Error("UI不存在:flags_" + index);
                continue;
            }
            flags.m_ani_star_0.visible = false;
            flags.m_ani_star_1.visible = false;
            flags.m_ani_star_2.visible = false;
            flags.m_ani_wing.visible = false;

            flags.data = levelId;
            //关卡记录数据
            const level = this.__levels!.get(levelId.toString()) as DictionaryProperty;
            if (level) {
                if (this.__victoryData && levelId == this.__victoryData.level) {
                    continue;
                }
                //读取已保存的关卡数据
                const campaign = level.get(GameMode.CAMPAIGN.toString()).getValue();
                const heroic = level.get(GameMode.HEROIC.toString()).getValue();
                const iron = level.get(GameMode.IRON.toString()).getValue();
                const stars = level.get(RecordPropertys.STARS).getValue();
                this.__showFlags(flags, campaign, heroic, iron, stars);
            } else {
                flags.visible = false;
            }
        }
        if (!this.__victoryData) {
            return;
        }
        const flags = this.view.m_mapView.m_layer_flags.getChild("flags_" + (this.__victoryData.level - 1)) as UI_Flags;
        //关卡记录数据
        const level = this.__levels!.get(this.__victoryData.level.toString()) as DictionaryProperty;
        if (!level) {
            return;
        }

        let campaign = level.get(GameMode.CAMPAIGN.toString()).getValue();
        let heroic = level.get(GameMode.HEROIC.toString()).getValue();
        let iron = level.get(GameMode.IRON.toString()).getValue();
        let stars = level.get("stars").getValue();
        //计算关卡新记录值
        let newCampaign: number = campaign;
        let newHeroic: number = heroic;
        let newIron: number = iron;
        let newStars: number = stars
        switch (this.__victoryData.mode) {
            case GameMode.CAMPAIGN:
                newCampaign = Math.max(this.__victoryData.difficulty, campaign);
                break;
            case GameMode.HEROIC:
                newHeroic = Math.max(this.__victoryData.difficulty, heroic);
                break;
            case GameMode.IRON:
                newIron = Math.max(this.__victoryData.difficulty, iron);
                break;
        }
        //根据记录计算出需要开启的关卡
        let unlockLevels: Array<number> = this.__getUnlockLevels(this.__victoryData!.level, this.__levels!);

        //该模式难度记录
        let difficulty: number = level.get(this.__victoryData.mode.toString()).getValue();
        //首通
        let isFirst: boolean = this.__isFirst(difficulty);
        if (isFirst) {
            switch (this.__victoryData.mode) {
                case GameMode.CAMPAIGN:
                    flags.m_c1.selectedIndex = 1;
                    newStars = Math.max(this.__victoryData.stars, stars);
                    //升级到蓝色
                    MapAniUtils.PlayFlagsAni(flags, MapAniUtils.UP_TO_BLUE, 1, undefined, () => {
                        MapAniUtils.PlayFlagsAni(flags, MapAniUtils.BLUE, -1);
                        MapAniUtils.PlayStarAni(flags, 0, newStars, () => {
                            //解锁关卡
                            this.__unlockLevels(unlockLevels);
                        })
                    })
                    break;
                case GameMode.HEROIC:
                    flags.m_c1.selectedIndex = 2;
                    MapAniUtils.ShowStars(flags, stars);
                    //旗帜飘扬(蓝色)
                    MapAniUtils.PlayFlagsAni(flags, MapAniUtils.BLUE, -1);
                    //播放翅膀动画
                    flags.m_ani_wing.visible = true;
                    flags.m_ani_wing.playing = true;
                    flags.m_ani_wing.setPlaySettings(0, 14, 1, 14, () => {
                        //解锁关卡
                        this.__unlockLevels(unlockLevels);
                    });
                    break;
                case GameMode.IRON:
                    flags.m_c1.selectedIndex = 3;
                    MapAniUtils.ShowStars(flags, stars);
                    flags.m_ani_wing.visible = true;
                    flags.m_ani_wing.playing = false;
                    flags.m_ani_wing.frame = 14;
                    //升级到白色
                    MapAniUtils.PlayFlagsAni(flags, MapAniUtils.UP_TO_WHITE, 1, undefined, () => {
                        //白色旗帜飘扬
                        MapAniUtils.PlayFlagsAni(flags, MapAniUtils.WHITE);
                        //解锁关卡
                        this.__unlockLevels(unlockLevels);
                    });
                    break;
            }
        } else {//非首通
            switch (this.__victoryData.mode) {
                case GameMode.CAMPAIGN:
                    newStars = Math.max(this.__victoryData.stars, stars);
                    if (this.__victoryData.stars > stars) {
                        this.__showFlags(flags, newCampaign, newHeroic, newIron, newStars);
                        MapAniUtils.PlayStarAni(flags, stars, newStars, () => {
                            //解锁关卡
                            this.__unlockLevels(unlockLevels);
                        });
                    } else {
                        this.__showFlags(flags, newCampaign, newHeroic, newIron, newStars);
                    }
                    break;
                case GameMode.HEROIC:
                case GameMode.IRON:
                    //解锁关卡
                    this.__unlockLevels(unlockLevels);
                    MapAniUtils.ShowStars(flags, stars);
                    this.__showFlags(flags, newCampaign, newHeroic, newIron, newStars);
                    break;
            }
        }
        //保存数据
        level.update(GameMode.CAMPAIGN.toString(), newCampaign);
        level.update(GameMode.HEROIC.toString(), newHeroic);
        level.update(GameMode.IRON.toString(), newIron);
        level.update(RecordPropertys.STARS, newStars);
        this.recordModule.save();
    }

    private __isFirst(difficulty: number): boolean {
        return difficulty < 0;
    }

    /**
     * 正常显示旗帜并填充数据
     * @param flags 
     * @param campaign 
     * @param heroic 
     * @param iron 
     * @param stars 
     */
    private __showFlags(flags: UI_Flags, campaign: number, heroic: number, iron: number, stars: number): void {
        flags.visible = true;
        if (campaign < 0) {
            flags.m_c1.selectedIndex = 0;
            MapAniUtils.PlayFlagsAni(flags, MapAniUtils.RED, -1);
        } else if (iron >= 0) {
            flags.m_c1.selectedIndex = 3;
            flags.m_ani_wing.playing = false;
            flags.m_ani_wing.frame = 14;
            flags.m_ani_wing.visible = true;
            MapAniUtils.PlayFlagsAni(flags, MapAniUtils.WHITE, -1);
        } else if (heroic >= 0) {
            flags.m_c1.selectedIndex = 2;
            flags.m_ani_wing.playing = false;
            flags.m_ani_wing.frame = 14;
            flags.m_ani_wing.visible = true;
            MapAniUtils.PlayFlagsAni(flags, MapAniUtils.BLUE, -1);
        } else {
            flags.m_c1.selectedIndex = 1;
            MapAniUtils.PlayFlagsAni(flags, MapAniUtils.BLUE, -1);
        }
        //stars
        if (campaign >= 0) {
            MapAniUtils.ShowStars(flags, stars);
        }
    }

    /**
     * 获取需要解锁的关卡ID
     */
    private __getUnlockLevels(levelId: number, levels: DictionaryProperty): Array<number> {
        const level = levels.get(levelId.toString()) as DictionaryProperty;
        if (!level) {
            return [];
        }
        const campaign = level.get(GameMode.CAMPAIGN.toString()).getValue();
        const heroic = level.get(GameMode.HEROIC.toString()).getValue();
        const iron = level.get(GameMode.IRON.toString()).getValue();
        let config = this.__levelConfigs!.get<Config.Level.Level>(["id", "difficulty", "mode"], [levelId, this.__victoryData.difficulty, this.__victoryData.mode])
        if (this.__victoryData!.mode == GameMode.CAMPAIGN && this.__victoryData!.difficulty > campaign) {
            return config.unlocks;
        }
        if (this.__victoryData!.mode == GameMode.HEROIC && this.__victoryData!.difficulty > heroic) {
            return config.unlocks;
        }
        if (this.__victoryData!.mode == GameMode.IRON && this.__victoryData!.difficulty > iron) {
            return config.unlocks;
        }
        return [];
    }

    /**
     * 开启关卡
     * @param levels 
     */
    private __unlockLevels(levels: Array<number>, ani: boolean = true): void {
        if (levels.length <= 0) {
            return;
        }
        for (let index = 0; index < levels.length; index++) {
            const levelId = levels[index];
            this.__unlocklevel(levelId, ani);
        }
    }
    private __unlocklevel(levelId: number, ani: boolean = true): void {
        //关卡记录
        let level = this.__levels!.get(levelId.toString()) as DictionaryProperty;
        if (level) {
            return;
        }
        const flags = this.view.m_mapView.m_layer_flags.getChild("flags_" + (levelId - 1)) as UI_Flags;
        if (!flags) {
            return;
        }
        flags.m_c1.selectedIndex = 0;
        flags.m_ani_wing.visible = false;
        flags.m_ani_star_0.visible = false;
        flags.m_ani_star_1.visible = false;
        flags.m_ani_star_2.visible = false;

        //地图路径配置
        let configAcc = ConfigManager.getAccessor(ConfigKeys.Maps_MapPath) as MapPathAccessor;
        let mapPathConfig = configAcc.get<Config.Maps.MapPath>(["level"], [levelId]);
        if (mapPathConfig) {
            let mapPath = this.view.m_mapView.m_layer_path.getChild(mapPathConfig.pathAni) as GMovieClip;
            if (mapPath) {
                mapPath.visible = true;
                if (ani) {
                    mapPath.playing = true;
                    mapPath.setPlaySettings(0, undefined, 1, undefined, () => {
                        this.__plantFlags(flags, levelId);
                    })
                } else {
                    mapPath.playing = false;
                    mapPath.frame = mapPath._content.frameCount;
                }
                return;
            }
        }
        if (ani) {
            this.__plantFlags(flags, levelId);
        }
    }

    /**
     * 插旗
     * @param flags 
     * @param levelId 
     */
    private __plantFlags(flags: UI_Flags, levelId: number): void {
        flags.visible = true;
        MapAniUtils.PlayFlagsAni(flags, MapAniUtils.PLANT_FLAGS, 1, undefined, () => {
            //红色旗帜
            MapAniUtils.PlayFlagsAni(flags, MapAniUtils.RED);
            //关卡记录
            let level = this.__levels!.get(levelId.toString()) as DictionaryProperty;
            if (!level) {
                level = this.recordModule.createLevelRecord(levelId);
                this.__levels!.add(level);
                this.recordModule.save();
            }
            const campaign = level.get(GameMode.CAMPAIGN.toString()).getValue();
            const heroic = level.get(GameMode.HEROIC.toString()).getValue();
            const iron = level.get(GameMode.IRON.toString()).getValue();
            const start = level.get(RecordPropertys.STARS).getValue();
            this.__showFlags(flags, campaign, heroic, iron, start);
        })
    }

    /**
     * 保存通关数据
     * @param vData 
     * @param level 
     * @param stars 
     */
    private __saveLevel(vData: VictoryData, level: DictionaryProperty, stars: number): void {
        const difficulty = level.get(vData.mode.toString()).getValue();
        if (vData.difficulty > difficulty) {
            level.update(vData.mode.toString(), vData.difficulty);
        }
        if (vData.stars > stars) {
            level.update(RecordPropertys.STARS, vData.stars);
        }
        //保存
        this.recordModule.save();
    }

    private get view(): UI_Map {
        return this.ui as UI_Map;
    }

    private get recordModule(): EXI_Playerprefs.Module_playerPrefs {
        return <any>ModuleManager.single.getModule(ModuleKeys.Playerprefs) as EXI_Playerprefs.Module_playerPrefs;
    }
}