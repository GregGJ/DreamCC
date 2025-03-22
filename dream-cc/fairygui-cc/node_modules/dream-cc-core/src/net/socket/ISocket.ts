import { IEventDispatcher } from "../../events/IEventDispatcher";



/**
 * 长连接接口
 */
export interface ISocket extends IEventDispatcher {
    /**
     * 名称
     */
    name:string;

    isConected(): boolean;
    /**
     * 连接
     * @param url 
     * @param arg 
     */
    connect(url: string, ...arg: any[]): void;
    /**
     * 重连
     * @param type 
     * @param url 
     */
    reconnect(): void;
    /**
     * 发送消息
     * @param type 
     * @param arg 
     */
    send(...arg: any[]): void;
    /**
     * 删除并返回指定已缓存的消息
     * @param code 
     */
    getCacheMsg(code:number|string):any;
    /**
     * 关闭
     */
    close(): void;
}