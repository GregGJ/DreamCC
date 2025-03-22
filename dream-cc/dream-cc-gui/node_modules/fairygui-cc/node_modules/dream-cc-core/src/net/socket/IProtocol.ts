

export interface IProtocol {

    /**
     * 解析回调
     * @param code 
     * @param data 
     * @returns 
     */
    parse_callback: ((code: number | string, data: any) => void) | null;

    /**
     * 解码
     * @param data 
     */
    decode(data: any): void;
    /**
     * 编码
     * @param code 
     * @param data 
     */
    encode(code: number | string, data: any): any;
}