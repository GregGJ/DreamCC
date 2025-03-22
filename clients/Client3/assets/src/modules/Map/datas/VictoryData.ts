import { GameDifficulty } from "../../../games/enums/GameDifficulty";
import { GameMode } from "../../../games/enums/GameMode";



export class VictoryData {
    /**
     * 模式
     */
    mode: GameMode = GameMode.CAMPAIGN;
    /**
     * 难度
     */
    difficulty: GameDifficulty = GameDifficulty.EASY;
    /**
     * 关卡ID
     */
    level: number = 1;
    /**
     * 评分
     */
    stars: number = 1;
    
    constructor() {

    }
}