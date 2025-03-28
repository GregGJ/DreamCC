

import { SpawnData } from "./SpawnData";


/**
 * 波次数据
 */
export class WaveData{
    time:number;
    spawns:Array<SpawnData>;

    constructor(time:number,spawns:Array<SpawnData>){
        this.time=time;
        this.spawns=spawns;
    }
}