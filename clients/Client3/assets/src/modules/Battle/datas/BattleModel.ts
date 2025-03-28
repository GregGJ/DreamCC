import { ConfigManager, DictionaryProperty, ModuleManager, ResRequest } from "dream-cc-core";
import { GameMode } from "../../../games/enums/GameMode";
import { DDLSMesh, DDLSPathFinder, Polygon } from "dream-cc-pathfinding";
import { Vec2 } from "cc";
import { ConfigKeys } from "../../../games/configs/ConfigKeys";
import { LevelAccessor } from "../../../games/configs/LevelAccessor";
import { RecordPropertys } from "../../../models/playerPrefs/RecordPropertys";
import { Module_playerPrefs } from "../../../models/playerPrefs/Module_playerPrefs";
import { EXI_Playerprefs } from "../../../models_exi/EXI_Playerprefs";
import { ModuleKeys } from "../../../games/ModuleKeys";
import { ILevelWaveData, ITerrainConfig } from "./BattleDatas";
import { GUIMediator } from "dream-cc-gui";
import { FSM } from "dream-cc-ai";





export class BattleModel {
    /**
     * 战斗界面
     */
    mediator: GUIMediator;
    /**
     * 状态机
     */
    fsm: FSM;
    /**
     * 所引用的资源
     */
    assets: Set<ResRequest> | null = null;
    /**
     * 暂停
     */
    paused: boolean = false;
    /**当前波次 */
    waveIndex: number = 0;
    /**总波次 */
    waveTotal: number = 0;
    /**关卡ID */
    level: number = 1;
    /**难度 */
    difficulty: number = 0;
    /**模式 */
    mode: number = 0;

    /**最大生命值*/
    maxlife: number = 0;
    /**生命值*/
    life: number = 0;
    /**金币*/
    glod: number = 0;

    /**当前关卡记录 */
    levelPref: DictionaryProperty | null = null;
    /**当前关卡配置 */
    levelConfig: Config.Level.Level | null = null;
    /**波次配置 */
    waveConfig: Array<ILevelWaveData> | null = null;
    /**地形配置 */
    terrainConfig: ITerrainConfig | null = null;

    /**导航网格*/
    navMesh: DDLSMesh | null = null;
    /**寻路工具 */
    pathfinder: DDLSPathFinder | null = null;
    /**路径 */
    paths: Map<string, Array<Vec2>> | null = null;
    /**结束区域*/
    end: Polygon | null = null;

    constructor() {
        this.assets = new Set<ResRequest>();
    }

    /**
     * 初始化
     * @param data 
     */
    init(data: { level: number, mode: GameMode, difficulty: number }): void {
        this.level = data.level;
        this.difficulty = data.difficulty;
        this.mode = data.mode;

        //关卡配置存取器
        let levelAcc = ConfigManager.getAccessor(ConfigKeys.Level_Level) as LevelAccessor;
        //关卡记录
        let levelsPref = this.playerprefs.currentGame.get(RecordPropertys.LEVELS) as DictionaryProperty;
        //当前关卡记录
        this.levelPref = levelsPref.get(this.level.toString()) as DictionaryProperty;
        //关卡配置
        this.levelConfig = levelAcc.getLevel(this.level, this.difficulty, this.mode);
    }

    clear(): void {
        this.waveIndex = 0;
        this.waveTotal = this.waveConfig!.length;
        this.life = this.maxlife = this.levelConfig!.hp;
        this.glod = this.levelConfig!.glod;
        let list = this.assets;
        for (const element of list) {
            element.dispose();
        }
        this.assets.clear();
        this.paused = false;
    }

    /**
     * 游戏记录模块
     */
    get playerprefs(): EXI_Playerprefs.Module_playerPrefs {
        return <any>ModuleManager.single.getModule(ModuleKeys.Playerprefs);
    }

    private static __instance: BattleModel;
    /**
     * 单例
     */
    static get single(): BattleModel {
        if (!this.__instance) {
            this.__instance = new BattleModel();
        }
        return this.__instance;
    }
}