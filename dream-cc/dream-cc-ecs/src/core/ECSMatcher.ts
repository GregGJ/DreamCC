import { ECSEntity } from "./ECSEntity";
import { IECSComponent } from "./IECSComponent";

/**
 * 匹配器
 */
export class ECSMatcher {
    /**
     * 全部包含或任意包含
     */
    matcher: MatcherAllOf | MatcherAnyOf | undefined = undefined;

    /**
     * 可选任意包含
     */
    matcherAnyOf: MatcherAnyOf | undefined = undefined;

    /**
     * 不能包含的
     */
    matcherNoneOf: MatcherNoneOf | undefined = undefined;

    /**
     * 编组所匹配的元素(内部接口)
     */
    private __entitys: Set<ECSEntity> = new Set<ECSEntity>();

    /**
     * 关联组件
     */
    _dependencies = new Set<new () => IECSComponent>();

    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, matcherAnyOf?: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf) {
        this.matcher = allOrAny;
        this.matcherAnyOf = matcherAnyOf;
        this.matcherNoneOf = none;
        for (let index = 0; index < allOrAny.types.length; index++) {
            const type = allOrAny.types[index];
            this._dependencies.add(type);
        }
        if (matcherAnyOf) {
            for (let index = 0; index < matcherAnyOf.types.length; index++) {
                const type = matcherAnyOf.types[index];
                this._dependencies.add(type);
            }
        }
        if (none) {
            for (let index = 0; index < none.types.length; index++) {
                const type = none.types[index];
                this._dependencies.delete(type);
            }
        }
    }

    get entitys(): Set<ECSEntity> {
        return this.__entitys;
    }

    has(entity: ECSEntity): boolean {
        return this.__entitys.has(entity);
    }

    add(entity: ECSEntity): void {
        this.__entitys.add(entity);
    }

    remove(entity: ECSEntity): void {
        this.__entitys.delete(entity);
    }

    clear(): void {
        this.__entitys.clear();
    }

    destroy(): void {
        this.matcher = undefined;
        this.matcherNoneOf = undefined;
        this.__entitys = null;
        this._dependencies.clear();
        this._dependencies = null;
    }
}



/**
 * 匹配器
 */
export class Matcher {

    types: Array<new () => IECSComponent>;

    constructor(types: Array<new () => IECSComponent>) {
        this.types = types;
    }
}

/**
 * 必须所有成立
 */
export class MatcherAllOf extends Matcher {

}

/**
 * 任意一个成立
 */
export class MatcherAnyOf extends Matcher {

}

/**
 * 不能包含
 */
export class MatcherNoneOf extends Matcher {

}