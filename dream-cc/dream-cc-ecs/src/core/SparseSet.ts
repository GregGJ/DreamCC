

/**
 * 稀疏集合
 */
export class SparseSet {

    /**无效值 */
    invalid: number = 0;
    private __maxCount: number = 0;
    private __packed: Uint32Array;
    private __index: number = 0;
    private __sparse: Uint32Array;

    constructor(maxCount: number) {
        this.__maxCount = this.invalid = maxCount;
        this.__packed = new Uint32Array(this.__maxCount);
        this.__packed.fill(this.invalid);
        this.__sparse = new Uint32Array(this.__maxCount);
        this.__sparse.fill(this.invalid);
    }

    /**
     * 添加
     * @param id 
     */
    add(id: number): void {
        if (id >= this.invalid) {
            throw new Error("超出最大索引:" + id + "/" + this.invalid)
        }
        this.__packed[this.__index] = id;
        this.__sparse[id] = this.__index;
        this.__index++;
    }

    /**
     * 是否包含
     * @param id 
     * @returns 
     */
    contains(id: number): boolean {
        if (id >= this.__sparse.length) {
            return false;
        }
        if (this.__sparse[id] == this.invalid) {
            return false;
        }
        return true;
    }

    /**
     * 删除
     * @param id 
     */
    remove(id: number): void {
        if (id >= this.__maxCount) {
            throw new Error("超出范围");
        }
        let delete_packIdx = this.__sparse[id];
        let lastIdx = this.__index - 1;
        if (this.length == 1 || delete_packIdx == lastIdx) {
            this.__packed[lastIdx] = this.invalid;
            this.__sparse[id] = this.invalid;
        } else {
            let swap_id = this.__packed[lastIdx];
            this.__packed[delete_packIdx] = swap_id;
            this.__sparse[id] = this.invalid;
            this.__sparse[swap_id] = delete_packIdx;
            this.__packed[lastIdx] = this.invalid;
        }
        this.__index--;
    }

    /**
     * 清除所有
     */
    clear(): void {
        this.__packed.fill(this.invalid);
        this.__sparse.fill(this.invalid);
        this.__index = 0;
    }

    destroy(): void {
        this.__packed = null;
        this.__sparse = null;
    }

    /**
     * 获取packed的索引值
     * @param id 
     * @returns 
     */
    getPackedIdx(id: number): number {
        if (id >= this.__sparse.length) {
            return this.invalid;
        }
        if (this.__sparse[id] == this.invalid) {
            return this.invalid;
        }
        //找到在packed中的索引位置
        const pIdx = this.__sparse[id];
        return pIdx;
    }

    /**
     * 最后一个entity
     */
    get lastEntity(): number {
        return this.__packed[this.__index - 1];
    }

    get packed(): Uint32Array {
        return this.__packed;
    }

    get length(): number {
        return this.__index;
    }

    get maxCount(): number {
        return this.__maxCount;
    }
}