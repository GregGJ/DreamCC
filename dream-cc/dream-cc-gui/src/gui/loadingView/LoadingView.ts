import { Injector } from "dream-cc-core";
import { ILoadingView } from "./ILoadingView";

/**
 * 加载界面
 */
export class LoadingView {

    static KEY: string = "LoadingView";

    static show(): void {
        if (!this.impl) {
            return;
        }
        this.impl.show();
    }

    static hide(): void {
        if (!this.impl) {
            return;
        }
        this.impl.hide();
    }

    static changeData(...args:any[]): void {
        if (!this.impl) {
            return;
        }
        this.impl.changeData(...args);
    }
    
    private static __impl: ILoadingView;
    static get impl(): ILoadingView {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            console.warn(this.KEY + "未注入");
        }
        return this.__impl;
    }
}