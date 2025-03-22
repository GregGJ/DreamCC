import {DictionaryProperty,Module,Dictionary} from "dream-cc-core";
   export namespace EXI_Playerprefs {
   export interface GameRecord {
    /**     * 名称     */      name:string;
    /**     * 唯一ID     */      key:string;
    /**     * 关卡记录     */      levels:Map<number,LevelRecord>;
    /**     * 更新关卡记录     * @param id      * @param mode      * @param difficulty      * @param v      */      update(id:number,mode:number,difficulty:number,v:boolean):void
   }
   export interface LevelRecord {
    /**     * 关卡模式     */      records:Map<string,boolean>;
      id:string;
    /**     * 关卡评分     */      stars:number;
    /**     * 添加或更新     * @param mode          模式     * @param difficulty    难度     * @param v             是否通关     */      addOrUpdate(mode:number,difficulty:number,v:boolean):void
   }
   export interface Module_playerPrefs {
    /**     * 当前关卡记录数据     */      currentLevel:DictionaryProperty;
    /**     * 游戏名称     */      gameName:string;
    /**     * 玩家记录     */      playerRecord:DictionaryProperty;
    /**     * 删除游戏记录     * @param data      */      removeGameRecord(data:DictionaryProperty):void
      set index(value:number);
      createLevelRecord(id:number):DictionaryProperty
    /**     * 清除记录     */      clear():void
      save():void
    /**     * 从本地读取记录     */      read():void
    /**     * 创建一个新的游戏记录     * @param id      * @returns      */      createGameRecord():void
   }
   export interface PlayerRecord {
    /**     * 序号索引     */      index:number;
    /**     * 背景音乐音量     */      musicVolume:number;
    /**    * 总音量    */      volume:number;
    /**     * 音效音量     */      soundVolume:number;
    /**     * 从本地读取记录     */      read():void
    /**     * 通过Json数据更新     * @param data      */      updateByJson(data:any):void
    /**     * 创建新的游戏记录     */      createNewRecord():void
    /**     * 游戏记录     */      get records():Dictionary<string,GameRecord>
    /**     * 将记录保存到本地     */      save():void
   }
   export enum RecordPropertys {
    INDEX = "index",
    VOLUME = "volume",
    MUSIC_VOLUME = "music_volume",
    SOUND_VOLUME = "sound_volume",
    DIFFICULTY = "difficulty",
    GAMES = "games",
    LEVELS = "levels",
    STARS = "stars",
   }
}