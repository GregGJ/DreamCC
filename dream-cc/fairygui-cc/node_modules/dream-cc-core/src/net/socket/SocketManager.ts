import { Injector } from "../../utils/Injector";
import { IProtocol } from "./IProtocol";
import { ISocket } from "./ISocket";
import { ISocketManager } from "./ISocketManager";
import { SocketManagerImpl } from "./SocketManagerImpl";


enum EventType {
    SOCKET_CONNECTED = "SOCKET_CONNECTED",
    SOCKET_ERROR = "SOCKET_ERROR",
    SOCKET_CLOSE = "SOCKET_CLOSE",
}

/**
 * 长连接管理器
 */
export class SocketManager {

    static KEY: string = "SocketManager";

    /**
     * sokcet事件类型枚举
     */
    static EventType: typeof EventType = EventType;

    private static __default_socket: string = "GameSocket";

    /**
     * 设置默认socket
     * @param type 
     */
    static setDefaultSocket(type: string) {
        this.__default_socket = type;
    }

    /**
     * socket是否存在
     * @param name 
     * @returns 
     */
    static hasSocket(name: string): boolean {
        return this.impl.hasSocket(name);
    }

    /**
     * 初始化socket
     * @param name 
     * @param protocal 
     * @returns 
     */
    static initSocket(protocal: IProtocol, name?: string): ISocket {
        if (name == undefined) {
            name = this.__default_socket;
        }
        if (name == undefined) {
            throw new Error("请先设置默认socket类型");
        }
        return this.impl.initSocket(protocal,name);
    }

    /**
     * 获取指定类型的长链接
     * @param name 
     * @returns 
     */
    static getSocket(name?: string): ISocket {
        if (name == undefined) {
            name = this.__default_socket;
        }
        if (name == undefined) {
            throw new Error("请先设置默认socket类型");
        }
        return this.impl.getSocket(name);
    }

    private static __impl: ISocketManager;
    private static get impl(): ISocketManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new SocketManagerImpl();
        }
        return this.__impl;
    }
}