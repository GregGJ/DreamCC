import { IProtocol } from "./IProtocol";
import { ISocket } from "./ISocket";



/**
 * 长链接管理接口
 */
export interface ISocketManager {
    /**
     * 初始化socket
     * @param protocal 
     * @param name 
     */
    initSocket(protocal:IProtocol,name?:string):ISocket
    /**
     * socket是否存在
     * @param name 
     */
    hasSocket(name:string):boolean;
    /**
     * 获取指定socket
     * @param name 
     */
    getSocket(name:string): ISocket;
}