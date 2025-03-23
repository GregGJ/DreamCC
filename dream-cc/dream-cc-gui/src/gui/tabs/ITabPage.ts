

export interface ITabPage {
    /**
     * UI
     */
    ui: any;
    /**
     * 所属的Mediator
     */
    owner: any;
    /**
     * 初始化
     */
    init(): void;
    /**
     * 显示
     * @param data 
     */
    show(data?: any): void;
    showedUpdate(data?: any): void;
    /**
     * 隐藏
     */
    hide(): void;
    /**
     * 销毁
     */
    destroy(): void;
}