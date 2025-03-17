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
     * 启动（派发Event.PROGRESS/Event.Error/Event.COMPONENT 来通知引擎，告知启动状态）
     * @param data 
     */
    setup(...data: any[]): void;
}