import { IEventDispatcher } from "../events/IEventDispatcher";



/**
 * 引擎插件
 */
export interface IEnginePlugin extends IEventDispatcher {
    /**
     * 插件名称
     */
    readonly name: string;
    /**
     * 初始化
     * @param args 
     */
    init(...args:any[]):void;
    /**
     * 启动（派发Event.PROGRESS/Event.Error/Event.COMPONENT 来通知引擎，告知启动状态）
     */
    start(): void;
}