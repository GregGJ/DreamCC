



import { JsonAsset } from "cc";
import { BattleModel } from "../datas/BattleModel";
import { ConfigManager, Event, IDConfigAccessor, Res, ResURL, Task } from "dream-cc-core";
import { GameMode } from "../../../games/enums/GameMode";
import { GamePath } from "../../../games/GamePath";
import { ConfigKeys } from "../../../games/configs/ConfigKeys";


export class LoadWaveTask extends Task {

    constructor() {
        super();
    }

    start(data?: any): void {
        let terrains: string = this.model.levelConfig!.terrains;
        let mode: number = this.model.levelConfig!.mode;
        let modeKey: string = "";
        switch (mode) {
            case GameMode.CAMPAIGN:
                modeKey = "campaign";
                break;
            case GameMode.HEROIC:
                modeKey = "heroic";
                break;
            case GameMode.IRON:
                modeKey = "iron";
                break;
        }
        let url = GamePath.battleURL("levels/waves/" + terrains + "_waves_" + modeKey, JsonAsset)
        let reqeust = Res.create(
            url,
            "Battle",
            (progress: number) => {
                this.emit(Event.PROGRESS, null, undefined, progress * 0.5);
            },
            (err?: Error) => {
                if (err) {
                    reqeust.dispose();
                    this.emit(Event.ERROR, null, err);
                    return;
                }
                //波次配置加载完毕
                this.model.assets.add(reqeust);
                let ref = reqeust.getRef();
                this.model.waveConfig = ref.content.json;
                this.__decodeWaves();
            }
        );
        reqeust.load();
    }

    //解析波次配置
    private __decodeWaves(): void {
        let list = this.model.waveConfig!;
        let monsterAcc = ConfigManager.getAccessor(ConfigKeys.Monster_Monster) as IDConfigAccessor;
        let monsterConfig: Config.Monster.Monster | null;
        let urls: Array<ResURL> = [];

        for (let index = 0; index < list.length; index++) {
            const waveConfig = list[index];
            for (let wIdx = 0; wIdx < waveConfig.spawns.length; wIdx++) {
                const spawn = waveConfig.spawns[wIdx];
                monsterConfig = monsterAcc.getByID<Config.Monster.Monster>(spawn.creep);
                if (monsterConfig == null) {
                    throw new Error("怪物配置表中不存在id:" + spawn.creep);
                }
                urls.push(GamePath.battleURL("entitys/monsters/" + monsterConfig!.skin, "ani"));
            }
        }
        let reqeust = Res.create(
            urls,
            "Battle",
            (progress: number) => {
                this.emit(Event.PROGRESS, null, undefined, 0.5 + progress * 0.5);
            },
            (err?: Error) => {
                if (err) {
                    reqeust.dispose();
                    this.emit(Event.ERROR, null, err);
                    return;
                }
                this.model.assets.add(reqeust);
                //TODO 怪物技能相关资源未加载
                this.emit(Event.COMPLETE);
            }
        )
        reqeust.load();
    }

    private get model(): BattleModel {
        return BattleModel.single;
    }
}