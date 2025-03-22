import { Injector } from "dream-cc-core";
import { GUIManagerImpl } from "./GUIManagerImpl";
import { GUIState } from "./GUIState";
import { IGUIManager } from "./IGUIManager";
import { ITabData } from "./tabs/ITabData";

/**
     * GUI 管理器
     */
export class GUIManager {

    static KEY: string = "GUIManager";

    /**
     * 在界面关闭后多长时间不使用则销毁(秒)
     */
    static GUI_GC_INTERVAL: number = 30;

    /**
     * 注册
     * @param info 
     * @returns 
     */
    static register(info: { key: string }): void {
        return this.impl.register(info);
    }

    /**
     * 注销
     * @param key 
     * @returns 
     */
    static unregister(key: string): void {
        return this.impl.unregister(key);
    }

    /**
     * 打开指定UI界面
     * @param key 
     * @param data 
     */
    static open(key: string, data?: ITabData): void {
        this.impl.open(key, data);
    }

    /**
     * 关闭
     * @param key 
     * @param checkLayer 是否检查全屏记录
     */
    static close(key: string, checkLayer: boolean = true): void {
        this.impl.close(key, checkLayer);
    }

    /**
     * 关闭所有界面
     */
    static closeAll(): void {
        this.impl.closeAll();
    }

    /**
     * 获取界面状态
     * @param key 
     * @returns  0 未显示  1显示中
     */
    static getGUIState(key: string): GUIState {
        return this.impl.getState(key);
    }

    /**
     * 是否已打开或再打开中
     * @param key 
     * @returns 
     */
    static isOpen(key: string): boolean {
        return this.impl.isOpen(key);
    }

    /**
     * 获取GUI中的某个组件
     * @param key    界面全局唯一KEY
     * @param path   组件名称/路径
     */
    static getUIComponent(key: string, path: string): any {
        return this.impl.getUIComponent(key, path);
    }

    private static __impl: IGUIManager;
    private static get impl(): IGUIManager {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new GUIManagerImpl();
        }
        return this.__impl;
    }
}