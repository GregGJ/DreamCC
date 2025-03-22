import { ModuleManager } from "./ModuleManager";
import { ModuleQueue } from "./ModuleQueue";




export class ModuleRequest {
    /**
     * 是否是子服务(子服务在加载时不占用加载线程)
     */
    isSub: boolean = false;
    modules: Array<string>;
    private __progress: (progress: number) => void;
    private __callback: (err: Error) => void;
    private __loadedMap: Map<string, number>;

    constructor(modules: Array<string>, progress?: (progress: number) => void, callback?: (err: Error) => void, isSub?: boolean) {
        this.__loadedMap = new Map<string, number>();
        this.isSub = isSub;
        this.modules = modules;
        this.__progress = progress;
        this.__callback = callback;
    }

    load(): void {
        this.__loadedMap.clear();
        let isLoading: boolean = false;
        for (let index = 0; index < this.modules.length; index++) {
            const module_name = this.modules[index];
            const module = ModuleManager.single.getModule(module_name);
            if (module) {
                this.__loadedMap.set(module_name, 1);
            } else {
                isLoading = true;
                ModuleQueue.single.load(module_name, this.isSub);
            }
        }
        if (!isLoading) {
            this.__checkComplete();
        }
    }

    childComplete(module_name: string): void {
        this.__loadedMap.set(module_name, 1);
        this.__checkComplete();
    }

    childError(module_name: string, err: Error): void {
        if (this.__callback) {
            this.__callback(err);
        }
    }

    childProgress(module_name: string, progress: number): void {
        this.__loadedMap.set(module_name, progress);
        let totalProgress: number = this.loaded / this.modules.length;
        if (this.__progress) {
            this.__progress(totalProgress);
        }
    }

    private __checkComplete(): void {
        let progress: number = this.loaded / this.modules.length;
        if (this.__progress) {
            this.__progress(progress);
        }
        //完成
        if (progress == 1 && this.__callback != null) {
            this.__callback(null);
            this.destroy();
        }
    }

    private get loaded(): number {
        let loaded: number = 0;
        for (let value of this.__loadedMap.values()) {
            loaded += value;
        }
        return loaded;
    }

    destroy(): void {
        this.modules = null;
        this.__progress = null;
        this.__callback = null;
    }
}