import { Event, Res, ResRequest, ResURL, Task } from "dream-cc-core";
import { BattleModel } from "../datas/BattleModel";
import { GamePath } from "../../../games/GamePath";
import { JsonAsset } from "cc";
import { Prefab } from "cc";





export class LoadCommonTask extends Task {


    constructor() {
        super();
    }

    start(data?: any): void {
        let terrains: string = this.model.levelConfig!.terrains;
        let request = Res.create(
            GamePath.battleURL("levels/" + terrains, JsonAsset),
            "Battle",
            (progress: number) => {
                this.emit(Event.PROGRESS, null, undefined, progress * 0.5);
            },
            (err?: Error) => {
                if (err) {
                    request.dispose();
                    this.emit(Event.ERROR, null, err);
                    return;
                }
                this.__levelConfigsLoaded(request);
            }
        );
        request.load();
    }

    /**
     * 地形配置及波次配置加载完毕
     * @param list 
     */
    private __levelConfigsLoaded(request: ResRequest): void {
        let ref = request.getRef();
        //记录
        this.model.assets!.add(request);
        this.model.terrainConfig = ref.content.json;
        this.__loadLevelAssets();
    }

    private __loadLevelAssets(): void {
        let urls: Array<ResURL> = [
            GamePath.battleURL("ui/progress_bar/green_bar", Prefab),
            GamePath.battleURL("ui/progress_bar/yellow_bar", Prefab),
        ];
        let request = Res.create(
            urls,
            "Battle",
            (progress: number) => {
                this.emit(Event.PROGRESS, null, undefined, 0.5 + progress * 0.5);
            },
            (err?: Error) => {
                if (err) {
                    request.dispose();
                    this.emit(Event.ERROR, null, err);
                    return;
                }
                this.model.assets.add(request);
                this.emit(Event.COMPLETE);
            }
        )
        request.load();
    }

    private get model(): BattleModel {
        return BattleModel.single;
    }
}