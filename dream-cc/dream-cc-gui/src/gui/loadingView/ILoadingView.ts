




/**
 * 加载界面
 */
export interface ILoadingView {

    /**
     * 更新
     * @param data 
     */
    changeData(...args:any[]): void;

    /**
     * 显示
     */
    show(): void;

    /**
     * 隐藏
     */
    hide(): void;
}