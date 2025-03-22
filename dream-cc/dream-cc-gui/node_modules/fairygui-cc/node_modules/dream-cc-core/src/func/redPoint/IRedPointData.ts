


export interface IRedPointData {
    /**
     * 全局唯一ID
     */
    id: number;
    children: Array<number | IRedPointData>;
}