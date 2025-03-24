









import { SpriteFrame } from "cc";
import { ConfigManager, Event, Res, ResURL, Task } from "dream-cc-core";
import { BattleModel } from "../datas/BattleModel";
import { GamePath } from "../../../games/GamePath";
import { ConfigKeys } from "../../../games/configs/ConfigKeys";
import { TowerAccessor } from "../../../games/configs/TowerAccessor";



/**
 * 加载塔资源
 */
export class LoadTowerTask extends Task {

    constructor() {
        super();
    }

    start(data?: any): void {
        //加载塔相关资源
        const acc = ConfigManager.getAccessor(ConfigKeys.Tower_Tower) as TowerAccessor;
        const levelConfig = this.model.levelConfig!;

        let configs = acc.getElements<Config.Tower.Tower>();

        let urls: Array<ResURL> = [];
        let url: ResURL;
        for (let index = 0; index < configs.length; index++) {
            const towerConfig = configs[index];
            if (levelConfig.disabledTowerType && levelConfig.disabledTowerType.indexOf(towerConfig.type) < 0) {
                //一级塔需要建造过程显示
                if (towerConfig.level == 1) {
                    //塔的建造
                    url = GamePath.battleURL("ui/constructing/tower_constructing_000" + towerConfig.type, SpriteFrame);
                    urls.push(url);
                }
                //皮肤
                // url = GamePath.BattleURL("entitys/towers/" + towerConfig.type + "/skin_" + towerConfig.level, "TowerSkin", towerConfig.id);
                url = GamePath.battleURL("entitys/towers/1/skin_" + towerConfig.level, "TowerSkin", towerConfig.id);
                urls.push(url);
                //TODO 塔技能相关资源未加载
            }
        }
        if (urls.length == 0) {
            this.emit(Event.COMPLETE);
            return;
        }
        let reqeust = Res.create(
            urls,
            "Battle",
            (progress: number) => {
                this.emit(Event.PROGRESS, null, undefined, progress);
            },
            (err?: Error) => {
                if (err) {
                    reqeust.dispose();
                    this.emit(Event.ERROR, null, err);
                    return;
                }
                this.model.assets.add(reqeust);
                this.emit(Event.COMPLETE);
            }
        )
        reqeust.load();
    }

    private get model(): BattleModel {
        return BattleModel.single;
    }
}