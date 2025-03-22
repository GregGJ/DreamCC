import { GUIState } from "./GUIState";



/**
 * UI管理器接口
 */
export interface IGUIManager{

    /**
     * 注册
     * @param key 
     * @param mediatorClass 
     * @param data 
     */
    register(info: { key: string }): void;

    /**
     * 注销
     * @param key 
     */
    unregister(key: string): void;

    /**
     * 心跳
     * @param dt 
     */
    tick(dt: number): void;

    /**
     * 打开
     * @param key 
     * @param data 
     */
    open(key: string, data?: any): void;

    /**
     * 关闭
     * @param key 
     * @param checkLayer  是否检查全屏打开记录
     */
    close(key: string,checkLayer:boolean): void;

    /**
     * 关闭所有
     * @param key 
     */
    closeAll(): void;

    /**
     * 是否已打开
     * @param key 
     * @returns
     */
    getState(key: string): GUIState;

    /**
     * 获取GUI中的某个组件
     * @param key    界面全局唯一KEY
     * @param path   组件名称/路径
     */
    getUIComponent(key: string, path: string): any;
    
    /**
     * 是否已打开或打开中
     * @param key
     */
    isOpen(key: string): boolean;
}