import { LevelRecord } from "./LevelRecord";





/**
 * 游戏记录
 */
export class GameRecord {
    /**
     * 唯一ID
     */
    key: string;
    /**
     * 名称
     */
    name: string;
    /**
     * 关卡记录
     */
    levels: Map<number, LevelRecord>;

    constructor() {
        this.levels = new Map<number, LevelRecord>();
        this.levels.set(1, new LevelRecord());
    }

    /**
     * 更新关卡记录
     * @param id 
     * @param mode 
     * @param difficulty 
     * @param v 
     */
    update(id: number, mode: number, difficulty: number, v: boolean): void {
        let record: LevelRecord;
        if (!this.levels.has(id)) {
            record = new LevelRecord();
        } else {
            record = this.levels.get(id);
        }
        record.addOrUpdate(mode, difficulty, v);
    }
}