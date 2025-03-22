import { BaseConfigAccessor } from "./BaseConfigAccessor";



/**
 * 以id为key的配置存储器
 */
export class IDConfigAccessor extends BaseConfigAccessor {

    constructor() {
        super();
        this.addStorage(["id"]);
    }
    
    /**
     * 通过ID获取配置项内容
     * @param id 
     * @returns 
     */
    getByID<T>(id: number): T {
        return this.getOne<T>("id", id);
    }
}