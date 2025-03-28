


/**
 * 怪物生成数据
 */
export class SpawnData{
    wave:number;
    time:number;
    path:string;
    creep:number;
    index:number;
    constructor(wave:number,time:number,path:string,creep:number,index:number){
        this.wave=wave;
        this.time=time;
        this.path=path;
        this.creep=creep;
        this.index=index;
    }
}