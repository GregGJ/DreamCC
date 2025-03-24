import { ECSComponent } from "../core/ECSComponent";



export class DataComponent extends ECSComponent {

    private __data: any;

    constructor() {
        super();
    }

    reset(): void {
        super.reset();
        this.__data = null;
    }

    set data(v: any) {
        if (this.__data == v) return;
        this.__data = v;
        this.markDirtied();
    }

    get data(): any {
        return this.__data;
    }
}