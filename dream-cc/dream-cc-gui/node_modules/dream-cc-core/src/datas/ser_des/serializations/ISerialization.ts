

export interface ISerialization {
    /**
     * 序列化
     * @param target 
     * @param data 
     */
    encode(target:any,data:any): any;
}