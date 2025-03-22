


export interface IDeserialization {
    /**
     * 反序列化
     * @param target 
     * @param data 
     */
    decode(target: any, data: any): void;
}