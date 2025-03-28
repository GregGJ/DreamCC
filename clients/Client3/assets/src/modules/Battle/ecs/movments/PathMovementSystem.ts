import { DisplayComponent, ECSEntity, ECSSystem, MatcherAllOf, TransformComponent } from "dream-cc-ecs";
import { PathMovementComponent } from "./PathMovementComponent";
import { Vec2 } from "cc";
import { Direction8Utils } from "../../directions/Direction8Utils";
import { sp } from "cc";





export class PathMovementSystem extends ECSSystem {

    target: Vec2 = new Vec2();
    aPoint: Vec2 = new Vec2();
    bPoint: Vec2 = new Vec2();

    constructor() {
        super(
            new MatcherAllOf([
                DisplayComponent,
                PathMovementComponent,
                TransformComponent
            ])
        );
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {
        for (const entity of entitys) {
            const trans = this.world.getComponent(entity, TransformComponent);
            const movement = this.world.getComponent(entity, PathMovementComponent);

            let path = movement.path;
            if (movement.target == null) {
                let index = this.findClosestPointIndex(trans.x, trans.y, path);
                movement.target = path[index];
            }
            //当前位置
            let currentPos = this.bPoint;
            currentPos.set(trans.x, trans.y);

            //计算距离
            const dis = Vec2.distance(currentPos, movement.target);
            //速度，由于游戏可以暂停，所以其实还是使用逐帧计算速度
            const speed = movement.speed * 17;
            //需要移动的距离
            let needMoveDis = speed;
            //需要移动的距离
            if (dis < speed) {
                trans.setPosition(movement.target.x, movement.target.y);
                //计算下一个点
                let index = path.indexOf(movement.target);
                if (index + 1 < path.length) {
                    movement.target = path[index + 1];
                    needMoveDis = speed - dis;
                    if (needMoveDis > 0) {
                        this.__move(trans, movement, needMoveDis);
                    }
                } else {
                    //到达终点
                    this.world.removeComponent(entity, PathMovementComponent);
                }
            } else {
                this.__move(trans, movement, needMoveDis);
            }
        }
    }

    private __move(trans: TransformComponent, movement: PathMovementComponent, moveDis: number): void {
        //当前位置
        let currentPos = this.aPoint;
        currentPos.set(trans.x, trans.y);

        //计算向量
        let vector = this.bPoint;
        Vec2.subtract(vector, movement.target, currentPos);
        vector.normalize();
        vector.multiplyScalar(moveDis);
        //计算结束点
        Vec2.scaleAndAdd(this.target, currentPos, vector, moveDis);
        //设置位置
        trans.setPosition(this.target.x, this.target.y);
        //计算8方向
        let dir = Direction8Utils.getDirection(movement.target.x, movement.target.y, currentPos.x, currentPos.y);
        let dirVec = Direction8Utils.getDirectionVec(dir);
        trans.setDirection(dirVec.x, dirVec.y);
    }

    /**
    * 寻找路径中最近的一个点的索引值
    * @param x 
    * @param y 
    * @param path 
    * @returns 
    */
    findClosestPointIndex(x: number, y: number, path: Array<Vec2>): number {
        let min: number = Number.MAX_SAFE_INTEGER;
        this.target.x = x;
        this.target.y = y;
        let result: number = -1;
        for (let index = 0; index < path.length; index++) {
            this.aPoint.x = path[index].x;
            this.aPoint.y = path[index].y;
            const dis = Vec2.squaredDistance(this.target, this.aPoint);
            if (dis < min) {
                min = dis;
                result = index;
            }
        }
        return result;
    }
}