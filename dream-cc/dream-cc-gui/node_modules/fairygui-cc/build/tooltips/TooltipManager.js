import { Injector } from "dream-cc-core";
export class TooltipManager {
    constructor() {
    }
    /**
     * 注册
     * @param type
     * @param value
     */
    static register(type, value) {
        if (this.impl) {
            this.impl.register(type, value);
        }
    }
    /**
     * 注销
     * @param type
     */
    static unregister(type) {
        if (this.impl) {
            this.impl.unregister(type);
        }
    }
    /**
     * 显示
     * @param data
     */
    static show(data) {
        if (this.impl) {
            this.impl.show(data);
        }
    }
    /**
     * 隐藏
     */
    static hide() {
        if (this.impl) {
            this.impl.hide();
        }
    }
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.getInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(`${this.KEY} 未注入`);
        }
        return this.__impl;
    }
}
TooltipManager.KEY = "TooltipsManager";
/**提示层 */
TooltipManager.tooltipLayer = "Tooltip";
