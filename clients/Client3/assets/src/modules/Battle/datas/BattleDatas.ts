

export interface ITerrainConfig {
    navWidth: number;
    navHeight: number;
    width: number;
    height: number;
    towers: Array<{ id: string, type: number, x: number, y: number }>;
    paths: any;
    areas: Array<{ type: number, points: Array<number> }>;
    images: Array<{ x: number, y: number, image: string }>;
}


export interface IPathData {
    name: string,
    list: Array<number>;
}

export interface ILevelWaveData {
    /**
     * 波次刷新时间
     */
    time: number;
    /**
     * 刷新前提示时间
     */
    tipTime: number;
    /**
     * 快速刷新时获得的金币值
     */
    glod: number;
    /**
     * 波次数据
     */
    spawns: Array<IWaveData>
}

export interface IWaveData {
    /**
     * 延迟多少秒开始
     */
    delay: number;
    /**
     * 间隔
     */
    interval: number;
    /**
     * 模板ID
     */
    creep: number;
    /**
     * 子路径索引
     */
    path: string;
    /**
     * 数量
     */
    count: number;
}