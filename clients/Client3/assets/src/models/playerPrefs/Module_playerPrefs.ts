import { _decorator } from "cc";
import { ArrayProperty, DictionaryProperty, Module, NumberProperty, SerDesMode } from "dream-cc-core";
import { PlayerRecord } from "./PlayerRecord";
import { RecordPropertys } from "./RecordPropertys";
import { GameDifficulty } from "../../games/enums/GameDifficulty";
import { game } from "cc";
import { GameMode } from "../../games/enums/GameMode";



const { ccclass, property } = _decorator;

@ccclass('Module_playerPrefs')
export class Module_playerPrefs extends Module {

    /**
     * 游戏名称
     */
    gameName: string = "greg_td_game";
    /**
     * 玩家记录
     */
    playerRecord: DictionaryProperty;
    /**
     * 当前游戏记录
     */
    currentGame: DictionaryProperty;

    constructor() {
        super();
        this.playerRecord = new DictionaryProperty(this.gameName);
    }

    /**
     * 清除记录
     */
    clear(): void {
        localStorage.removeItem(this.gameName);
    }

    /**
     * 从本地读取记录
     */
    read(): void {
        let str = localStorage.getItem(this.gameName);
        if (!str) {
            this.__createDefaultRecord();
        } else {
            try {
                let json = JSON.parse(str);
                this.playerRecord.decode(SerDesMode.JSON, json);
            } catch (error) {
                this.__createDefaultRecord();
            }
        }
    }

    save(): void {
        let json = this.playerRecord.encode(SerDesMode.JSON);
        localStorage.setItem(this.gameName, JSON.stringify(json));
    }

    private __createDefaultRecord(): void {
        let index: number = 1;
        //序号
        this.playerRecord.add(new NumberProperty(RecordPropertys.INDEX, index));
        //音量
        this.playerRecord.add(new NumberProperty(RecordPropertys.VOLUME, 0.5));
        this.playerRecord.add(new NumberProperty(RecordPropertys.MUSIC_VOLUME, 0.5));
        this.playerRecord.add(new NumberProperty(RecordPropertys.SOUND_VOLUME, 0.5));
        //难度
        this.playerRecord.add(new NumberProperty(RecordPropertys.DIFFICULTY, GameDifficulty.EASY));
        //游戏记录列表
        let games = new ArrayProperty(RecordPropertys.GAMES);
        this.playerRecord.add(games);
        this.createGameRecord();
    }

    /**
     * 创建一个新的游戏记录
     * @param id 
     * @returns 
     */
    createGameRecord(): void {
        let games = this.playerRecord.get(RecordPropertys.GAMES) as ArrayProperty;
        let gameRecord = new DictionaryProperty("game_" + this.index.toString());
        //关卡列表
        let levels = new DictionaryProperty(RecordPropertys.LEVELS);
        levels.add(this.createLevelRecord(1));
        gameRecord.add(levels);
        games.push(gameRecord);
        this.index++;
    }

    /**
     * 删除游戏记录
     * @param data 
     */
    removeGameRecord(data: DictionaryProperty): void {
        let games = this.playerRecord.get(RecordPropertys.GAMES) as ArrayProperty;
        games.remove(data);
    }

    /**
     * 创建一个新的关卡记录
     * @param id 
     * @returns 
     */
    createLevelRecord(id: number): DictionaryProperty {
        let result = new DictionaryProperty(id.toString());
        //星级
        result.add(new NumberProperty(RecordPropertys.STARS, 0));
        //3种模式
        result.add(new NumberProperty(GameMode.CAMPAIGN.toString(), -1));
        result.add(new NumberProperty(GameMode.HEROIC.toString(), -1));
        result.add(new NumberProperty(GameMode.IRON.toString(), -1));
        return result;
    }

    /**
     * 开放关卡到指定关卡
     * @param level 
     */
    openToLevel(level: number): void {
        if (!this.currentGame) {
            return;
        }
        let levels = this.currentGame.get(RecordPropertys.LEVELS) as DictionaryProperty;
        for (let index = 1; index < level; index++) {
            let p_level = levels.get(index.toString()) as DictionaryProperty;
            if (!p_level) {
                p_level = this.createLevelRecord(index);
                levels.add(p_level);
            }
            p_level.update(GameMode.CAMPAIGN.toString(), index < (level - 1) ? 0 : -1);
            p_level.update(RecordPropertys.STARS, 1);
        }
    }

    get index(): number {
        let result = this.playerRecord.get(RecordPropertys.INDEX);
        return result.value;
    }

    set index(value: number) {
        let result = this.playerRecord.get(RecordPropertys.INDEX);
        result.value = value;
    }

    protected selfInit(): void {
        // this.clear();
        this.read();
        this.selfInitComplete();
    }
}