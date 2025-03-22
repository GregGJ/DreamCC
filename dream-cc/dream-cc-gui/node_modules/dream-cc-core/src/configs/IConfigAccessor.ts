

/**
 * 配置存取器接口
 */
export interface IConfigAccessor {
    /**
     * 表名
     */
    sheetName:string;
    /**
     * 保存
     * @param value 
     */
    save(value: any): boolean;
    /**
     * 获取所有元素
     */
    getElements<T>(): Array<T>;
    /**
     * 清理
     */
    destroy(): void;
}