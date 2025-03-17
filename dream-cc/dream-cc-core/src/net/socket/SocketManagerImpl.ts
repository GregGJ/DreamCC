import { IProtocol } from "./IProtocol";
import { ISocket } from "./ISocket";
import { ISocketManager } from "./ISocketManager";
import { Socket } from "./Socket";




export class SocketManagerImpl implements ISocketManager {

    private __socketMap: Map<string, ISocket> = new Map<string, ISocket>();

    constructor() {

    }


    initSocket(protocal: IProtocol, name?: string): ISocket {
        if (this.__socketMap.has(name)) {
            throw new Error(`socket ${name} is exist`);
        }
        if (protocal == null) {
            throw new Error("protocal is null");
        }
        let socket: ISocket = new Socket(protocal);
        socket.name = name;
        this.__socketMap.set(name, socket);
        return socket;
    }

    /**
     * socket是否存在
     * @param name 
     * @returns 
     */
    hasSocket(name: string): boolean {
        return this.__socketMap.has(name);
    }

    /**
     * 获取指定类型的长链接
     * @param name 
     */
    getSocket(name: string): ISocket {
        if (!this.__socketMap.has(name)) {
            throw new Error(`socket ${name} is not exist`);
        }
        return this.__socketMap.get(name);
    }
}