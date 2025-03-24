import { RenderRoot2D } from "cc";
import { DisplayComponent } from "./DisplayComponent";




/**
 * 3D世界中的2D渲染组件
 */
export class RendererRoot2DComponent extends DisplayComponent {

    private __root2D: RenderRoot2D;

    constructor() {
        super();
    }

    enable(): void {
        super.enable();
        this.__root2D = this.node.addComponent(RenderRoot2D);
    }

    reset(): void {
        super.reset();
        if (this.__root2D) {
            this.__root2D.destroy();
            this.__root2D = null;
        }
    }
}