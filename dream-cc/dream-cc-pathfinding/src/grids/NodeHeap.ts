import { INodeSearchState } from "./searchs/INodeSearchState";


export interface INodeHeapOptions {
    setNodeId: (item: INodeSearchState, index: number) => void;
    compare?: (a: INodeSearchState, b: INodeSearchState) => number;
}

export class NodeHeap {

    private __data: INodeSearchState[] = [];

    private __length: number = 0;

    compare: (a: INodeSearchState, b: INodeSearchState) => number;

    setNodeId: (item: INodeSearchState, index: number) => void;

    constructor(options?: INodeHeapOptions) {
        this.__data = [];
        this.__length = this.__data.length;
        this.compare = options.compare || this.__defaultCompare;
        this.setNodeId = options.setNodeId;

        if (this.__length > 0) {
            for (let index = (this.__length >> 1); index >= 0; index--) {
                this._down(index)
            }
        }
        if (options.setNodeId) {
            for (let index = 0; index < this.__length; index++) {
                this.setNodeId(this.__data[index], index);
            }
        }
    }

    push(item: INodeSearchState): void {
        this.__data.push(item);
        this.setNodeId(item, this.__length);
        this.__length++;
        this._up(this.__length - 1);
    }

    pop(): INodeSearchState | undefined {
        if (this.__length == 0) return undefined;
        let top = this.__data[0];
        this.__length--;
        if (this.__length > 0) {
            this.__data[0] = this.__data[this.__length];
            this.setNodeId(this.__data[0], 0);
            this._down(0);
        }
        this.__data.pop();
        return top;
    }

    updateItem(pos: number): void {
        this._down(pos);
        this._up(pos);
    }

    peek(): INodeSearchState | undefined {
        return this.__data[0];
    }

    _up(pos: number): void {
        let item = this.__data[pos];
        while (pos > 0) {
            let parent = (pos - 1) >> 1;
            let current = this.__data[parent];
            if (this.compare(item, current) >= 0) {
                break;
            }
            this.__data[pos] = current;
            this.setNodeId(current, pos);
            pos = parent;
        }
        this.__data[pos] = item;
        this.setNodeId(item, pos);
    }

    _down(pos: number): void {
        let item = this.__data[pos];
        let halfLength = this.__length >> 1;

        while (pos < halfLength) {
            let left = (pos << 1) + 1;
            let right = left + 1;
            let best = this.__data[left];

            if (right < this.__length && this.compare(this.__data[right], best) < 0) {
                left = right;
                best = this.__data[right];
            }
            if (this.compare(best, item) > 0) {
                break;
            }
            this.__data[pos] = best;
            this.setNodeId(best, pos);
            pos = left;
        }

        this.__data[pos] = item;
        this.setNodeId(item, pos);
    }

    get length():number{
        return this.__length;
    }

    private __defaultCompare(a: INodeSearchState, b: INodeSearchState): number {
        return a.fScore - b.fScore;
    }
}