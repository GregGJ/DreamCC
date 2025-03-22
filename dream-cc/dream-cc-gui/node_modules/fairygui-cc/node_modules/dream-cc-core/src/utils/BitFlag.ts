

/**
 * bit位操作
 */
export class BitFlag {

    private __flags: number = 0;

    private __elements: Array<number>;

    constructor() {
        this.__elements = [];
    }

    reset(): void {
        this.__flags = 0;
    }

    add(flag: number): void {
        this.__flags |= flag;
        if (this.__elements.indexOf(flag) < 0) {
            this.__elements.push(flag)
        }
    }

    remove(flag: number): void {
        this.__flags ^= flag;
        let index: number = this.__elements.indexOf(flag);
        if (index >= 0) {
            this.__elements.splice(index, 1);
        }
    }

    /**
     * 是否包含
     * @param flag 
     * @returns 
     */
    has(flag: number): boolean {
        return (this.__flags & flag) == flag;
    }

    /**
     * 位码
     */
    get flags(): number {
        return this.__flags;
    }

    get elements(): Array<number> {
        return this.__elements;
    }

    destroy(): void {
        this.__flags = 0;
        this.__elements.length = 0;
        this.__elements = null;
    }


    //======================================================静态工具
    private static TYPES: Map<new () => any, number> = new Map<new () => any, number>();
    private static BITS: Map<number, new () => any> = new Map<number, new () => any>();
    private static TYPE_IDX: number = 0;

    static getBit(value: new () => any): number {
        if (this.TYPES.has(value)) {
            return this.TYPES.get(value);
        }
        this.TYPE_IDX++;
        let result = Math.pow(2, this.TYPE_IDX);
        this.TYPES.set(value, result);
        this.BITS.set(result, value);
        return result;
    }

    static getType(bit: number): new () => any {
        return this.BITS.get(bit);
    }
}