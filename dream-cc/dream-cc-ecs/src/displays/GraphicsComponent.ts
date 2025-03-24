import { Graphics } from "cc";
import { DisplayComponent } from "./DisplayComponent";


/**
 * 绘画组件
 */
export class GraphicsComponent extends DisplayComponent {

    private __graphics: Graphics;

    constructor() {
        super();
    }

    enable(): void {
        super.enable();
        this.__graphics = this.node.addComponent(Graphics);
    }

    get graphics(): Graphics {
        return this.__graphics;
    }

    reset(): void {
        super.reset();
        if (this.__graphics) {
            this.__graphics.destroy();
            this.__graphics = null;
        }
    }
}