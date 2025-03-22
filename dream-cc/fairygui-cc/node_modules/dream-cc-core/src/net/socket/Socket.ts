import { EventDispatcher } from "../../events/EventDispatcher";
import { Logger } from "../../loggers/Logger";
import { IProtocol } from "./IProtocol";
import { ISocket } from "./ISocket";
import { SocketManager } from "./SocketManager";


export class Socket extends EventDispatcher implements ISocket {
    /**名称 */
    name: string;
    /**
     * 最大允许错误次数
     */
    static MAX_ERROR_COUNT: number = 3;
    /**
     * 当前错误次数
     */
    private error_count: number = 0;

    private is_conected: boolean = false;

    web_socket: WebSocket;
    message_protocol: IProtocol;
    /**
     * 缓存的未处理消息
     */
    private cache_msgs: Map<number | string, any>;
    constructor(message_parser: IProtocol) {
        super();
        if (message_parser == null) throw new Error("message_parser is null");
        this.cache_msgs = new Map();
        this.message_protocol = message_parser;
        this.message_protocol.parse_callback = this.onMessageParseCallback.bind(this);
    }

    getCacheMsg(code: number | string): any {
        if (!this.cache_msgs.has(code)) return null;
        let msg = this.cache_msgs.get(code);
        this.cache_msgs.delete(code);
        return msg;
    }

    isConected(): boolean {
        return this.is_conected;
    }

    /**
     * 链接
     * @param url 
     * @param binaryType 
     */
    connect(url: string, binaryType: BinaryType = "arraybuffer"): void {
        this.web_socket = new WebSocket(url,);
        this.web_socket.binaryType = binaryType;
        this.web_socket.onclose = this.onclose.bind(this);
        this.web_socket.onerror = this.onerror.bind(this);
        this.web_socket.onopen = this.onopen.bind(this);
        this.web_socket.onmessage = this.onmessage.bind(this);
        this.error_count = 0;
    }

    /**
     * 重新链接
     * @returns 
     */
    reconnect(): void {
        const readyState = this.web_socket.readyState;
        if (readyState == WebSocket.CONNECTING || readyState == WebSocket.OPEN) return;
        //关闭之前的链接对象
        if (this.web_socket) {
            this.web_socket.close();
            this.web_socket.onclose = null;
            this.web_socket.onerror = null;
            this.web_socket.onopen = null;
            this.web_socket.onmessage = null;
        }
        this.web_socket = new WebSocket(this.web_socket.url);
        this.web_socket.onclose = this.onclose.bind(this);
        this.web_socket.onerror = this.onerror.bind(this);
        this.web_socket.onopen = this.onopen.bind(this);
        this.web_socket.onmessage = this.onmessage.bind(this);
    }

    /**
     * 关闭
     */
    close(): void {
        this.web_socket.close();
        this.is_conected = false;
    }

    private onopen(e: Event): void {
        this.is_conected = true;
        this.emit(SocketManager.EventType.SOCKET_CONNECTED);
    }

    /**
     * 发送协议
     * @param code 
     * @param data 
     */
    send(code: number | string, data: any): void {
        Logger.log("[" + this.name + "]" + "[C2S]" + code + "  =>" + JSON.stringify(data), Logger.TYPE.NET);
        this.web_socket.send(this.message_protocol.encode(code, data));
    }

    private onmessage(e: MessageEvent): void {
        this.message_protocol.decode(e.data as ArrayBuffer);
    }

    private onMessageParseCallback(code: number | string, data: any): void {
        Logger.log("[" + this.name + "]" + "[S2C]" + code + "    <=" + JSON.stringify(data), Logger.TYPE.NET);
        //有人监听了该消息
        if (this.hasEvent(code)) {
            this.emit(code, data);
        } else {
            //缓存该消息
            console.log(this.name + " 检测到未处理消息:" + code + ",内部将缓存该消息");
            this.cache_msgs.set(code, data);
        }
    }

    private onclose(e: CloseEvent): void {
        this.emit(SocketManager.EventType.SOCKET_CLOSE);
    }

    private onerror(e: Event): void {
        this.is_conected = false;
        this.error_count++;
        if (this.error_count < Socket.MAX_ERROR_COUNT) {
            this.reconnect();
        } else {
            this.emit(SocketManager.EventType.SOCKET_ERROR, null, new Error(this.name + " socket 链接错误!"));
        }
    }
}