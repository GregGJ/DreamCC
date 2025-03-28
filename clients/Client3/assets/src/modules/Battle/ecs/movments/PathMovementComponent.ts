import { Vec2 } from "cc";
import { ECSComponent } from "dream-cc-ecs";




export class PathMovementComponent extends ECSComponent {
    /**
     * 路径
     */
    path: Array<Vec2>;
    /**
     * 速度
     */
    speed: number = 0;
    /**
     * 目标点
     */
    target: Vec2;
    
    constructor() {
        super();
    }

    setData(path: Array<Vec2>, speed: number = 0.1) {
        this.path = path;
        this.speed = speed;
    }
}