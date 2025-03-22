import { Dictionary, ObjectUtils } from "dream-cc-core";
import { GameRecord } from "./GameRecord";





export class PlayerRecord {

    /**
     * 序号索引
     */
    index: number = 0;
    /**
    * 总音量
    */
    volume: number = 1;
    /**
     * 背景音乐音量
     */
    musicVolume: number = 1;
    /**
     * 音效音量
     */
    soundVolume: number = 1;
    /**
     * 游戏记录
     */
    private __records: Dictionary<string, GameRecord>;

    private __gameName: string = "gret_td_game";

    constructor(gameName: string) {
        this.__gameName = gameName;
        this.__records = new Dictionary<string, GameRecord>();
    }

    /**
     * 通过Json数据更新
     * @param data 
     */
    updateByJson(data: any): void {
        this.index = data.index;
        this.volume = data.volume;
        this.musicVolume = data.musicVolume;
        this.soundVolume = data.soundVolume;
        
        let list = data.list;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            let record = new GameRecord();
            ObjectUtils.oto(element, record);
            this.__records.set(record.key, record);
        }
    }

    /**
     * 创建新的游戏记录
     */
    createNewRecord(): void {
        this.index++;
        let record = new GameRecord();
        record.key = "record_" + this.index;
        record.name = "";
        this.__records.set(record.key, record);
    }

    /**
     * 从本地读取记录
     */
    read(): void {
        let str = localStorage.getItem(this.__gameName);
        if (!str) {
            this.createNewRecord();
        } else {
            try {
                let json = JSON.parse(str);
                this.updateByJson(json);
            } catch (error) {
                this.createNewRecord();
            }
        }
    }

    /**
     * 将记录保存到本地
     */
    save(): void {
        let map = this.__records["__map"];
        let dataList = this.__records.elements;
        for (let index = 0; index < dataList.length; index++) {
            const element = dataList[index];

        }
        let data = {
            index: this.index,
            list: map
        }
        let str = JSON.stringify(data, null, 4);
        console.log(str);
    }

    get records(): Dictionary<string, GameRecord> {
        return this.__records;
    }
}