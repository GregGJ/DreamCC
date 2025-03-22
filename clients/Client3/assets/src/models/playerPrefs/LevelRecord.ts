import { GameDifficulty } from "../../games/enums/GameDifficulty";
import { GameMode } from "../../games/enums/GameMode";



export class LevelRecord {

    id: string;
    /**
     * 关卡评分
     */
    stars: number = 0;
    /**
     * 关卡模式
     */
    records: Map<string, boolean>;

    constructor() {
        this.records = new Map<string, boolean>();
        this.addOrUpdate(GameMode.CAMPAIGN, GameDifficulty.EASY, false);
    }
    
    /**
     * 添加或更新
     * @param mode          模式
     * @param difficulty    难度
     * @param v             是否通关
     */
    addOrUpdate(mode: number, difficulty: number, v: boolean): void {
        this.records.set(mode + "_" + difficulty, v);
    }
}