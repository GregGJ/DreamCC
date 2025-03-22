


export interface IAlert {
    
    /**
     * 显示一个警告框
     * @param msg       文本内容
     * @param title     标题
     * @param buttons   按钮文本
     * @param callback  点击按钮后的回调函数
     * @param buttonSkins 按钮皮肤
     */
    show(msg: string, title?: string, buttons?: string[], callback?: (btnIdx: number) => void, buttonSkins?: string[]): void;
}