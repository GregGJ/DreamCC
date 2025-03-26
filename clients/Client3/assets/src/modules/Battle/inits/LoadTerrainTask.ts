

import { JsonAsset, Prefab, SpriteFrame } from "cc";
import { Event, Res, ResRequest, ResURL, Task } from "dream-cc-core";
import { BattleModel } from "../datas/BattleModel";
import { GamePath } from "../../../games/GamePath";


/**
 * 加载并解析地形数据
 */
export class LoadTerrainTask extends Task {

    constructor() {
        super();
    }

    start(data?: any): void {
        let urls: Array<ResURL> = [];
        //img
        let images = this.model.terrainConfig!.images;
        for (let index = 0; index < images.length; index++) {
            const imageUrl = images[index];
            urls.push(GamePath.battleURL("levels/images/" + imageUrl.image.replace(".png", ""), SpriteFrame));
        }
        //towerPoint
        let list = this.model.terrainConfig!.towers;
        for (let index = 0; index < list.length; index++) {
            const terrain = list[index];
            const url = GamePath.battleURL("ui/build_terrains/build_terrain_" + terrain.type, Prefab);
            urls.push(url);
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
                //通知完成
                this.emit(Event.COMPLETE);
            }
        );
        reqeust.load();
    }

    private get model(): BattleModel {
        return BattleModel.single;
    }
}