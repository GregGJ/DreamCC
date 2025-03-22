import { Module } from "./Module";



export class ModuleProxy{

    module: Module;
    /**
     * 引用计数器
     */
    refCount: number = 0;

    constructor(module: Module) {
        this.module = module;
        this.refCount = 0;
    }

    addRef(): void {
        this.refCount++;
    }

    removeRef(): void {
        this.refCount--;
    }

    destroy(): boolean {
        this.module.destroy();
        this.module = null;
        return true;
    }
}