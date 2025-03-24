import { ECSEntity } from "./ECSEntity";
import { ECSMatcher, MatcherAllOf, MatcherAnyOf, MatcherNoneOf } from "./ECSMatcher";
import { ECSWorld } from "./ECSWorld";

/**
 * 系统
 */
export abstract class ECSSystem {

    private static HELP_ENTITY_LIST: Array<ECSEntity> = [];

    /**是否使用脏数据*/
    useDirty: boolean = false;

    /**匹配器 */
    _matcher: ECSMatcher;

    /**所属世界 */
    private __world: ECSWorld | null = null;

    /**
     * 系统
     * @param allOrAny  匹配所有或任意一个 
     * @param none      不能包含
     * @param useDirty  是否使用脏数据机制
     */
    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, matcherAnyOf?: MatcherAnyOf, none?: MatcherNoneOf, useDirty: boolean = false) {
        this._matcher = new ECSMatcher(allOrAny, matcherAnyOf, none);
        this.useDirty = useDirty;
    }

    /**设置所属世界 */
    setWorld(v: ECSWorld): void {
        this.__world = v;
    }

    /**心跳 */
    tick(dt: number): void {
        if (this._matcher.entitys.size == 0) return;
        this.$tick(this._matcher.entitys, dt);
        if (this.useDirty) {
            this._matcher.clear();
        }
    }

    hasEntity(entity: ECSEntity): boolean {
        return this._matcher.has(entity);
    }

    removeEntity(entity: ECSEntity): void {
        this._matcher.remove(entity);
    }

    addEntity(entity: ECSEntity): void {
        this._matcher.add(entity);
    }

    /**所属世界 */
    get world(): ECSWorld {
        return this.__world!;
    }

    protected $tick(entitys: Set<ECSEntity>, dt: number): void {

    }

    /**销毁 */
    destory(): void {
        this.__world = null;
        this._matcher = null;
    }
}