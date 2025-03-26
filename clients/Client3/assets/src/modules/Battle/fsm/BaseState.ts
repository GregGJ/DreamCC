import { FSM, IState } from "dream-cc-ai";
import { BattleModel } from "../datas/BattleModel";
import { ECSWorld, Level, LevelManager } from "dream-cc-ecs";






export class BaseState implements IState {

    name: string;

    fsm: FSM | null = null;

    data: any | null = null;

    private __levelKey: string;

    constructor(name: string, level: string) {
        this.name = name;
        this.__levelKey = level;
    }

    init(fsm: FSM): void {
        this.fsm = fsm;
    }

    enter(data?: any): void {
        this.data = data;
    }

    tick(dt: number): void {

    }

    exit(): void {

    }

    destroy(): void {
        this.fsm = null;
        this.data = null;
    }

    get model(): BattleModel {
        return BattleModel.single;
    }

    get level():Level{
        return LevelManager.single.getLevel(this.__levelKey);
    }

    get world(): ECSWorld {
        return this.level.world;
    }
}