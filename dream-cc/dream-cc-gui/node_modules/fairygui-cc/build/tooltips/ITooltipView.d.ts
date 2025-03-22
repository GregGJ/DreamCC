export interface ITooltipView {
    /**
     * view
     */
    viewComponent: any;
    /**
     * 更新数据
     * @param data
     */
    update(data?: any): void;
    /**
     * 销毁
     */
    destroy(): void;
}
