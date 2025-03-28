import { AudioManager, ConfigManager, IDConfigAccessor } from "dream-cc-core";
import { LevelManager, TransformComponent } from "dream-cc-ecs";
import { GamePath } from "../../../games/GamePath";
import { UI_BattleView } from "../BattleBinder";
import { ActionKeys } from "../actions/ActionKeys";
import { UnitAnimationComponent } from "../ecs/display/UnitAnimationComponent";
import { BattleEntityFactory } from "../levels/BattleEntityFactory";
import { BattleEntitys } from "../levels/BattleEntitys";
import { Timeline } from "../utils/Timeline";
import { BaseState } from "./BaseState";
import { SpawnData } from "../datas/SpawnData";
import { FGUIEvent } from "fairygui-cc";
import { ConfigKeys } from "../../../games/configs/ConfigKeys";




export class RunningState extends BaseState {

    spawns: Array<SpawnData>;
    private __tips: Map<number, boolean>;
    private __time: number = 0;
    constructor(level: string) {
        super("RunningState", level);
        this.__tips = new Map<number, boolean>();
        this.spawns = [];
    }

    enter(data?: any): void {
        super.enter(data);
        //播放战斗前置音乐
        AudioManager.playMusic(GamePath.soundURL("MusicBattleUnderAttackForest1"));
        //清理
        this.__tips.clear();
        this.spawns.splice(0, this.spawns.length);
    }

    tick(dt: number): void {
        if (this.model.paused) {
            return;
        }
        Timeline.single.tick(dt);
        this.__time += dt;
        //游戏结束
        if (this.gameover) {

        }
        //波次检查
        this.__checkWave();
        this.__spawnMonster();
    }

    exit(): void {
        super.exit();
    }

    private get gameover(): boolean {
        return false;
    }

    /**
     * 检查波次
     */
    private __checkWave(): void {
        let list = this.model.waveConfig;
        if (this.model.waveIndex >= list.length) {
            return;
        }
        let waveConfig = list[this.model.waveIndex];
        if (this.__time >= waveConfig.time) {
            for (let sIdx = 0; sIdx < waveConfig.spawns.length; sIdx++) {
                const spawnConfig = waveConfig.spawns[sIdx];
                const count = spawnConfig.count;
                for (let index = 0; index < count; index++) {
                    let spawn = new SpawnData(
                        this.model.waveIndex,
                        this.__time + spawnConfig.delay + (spawnConfig.interval * index),
                        spawnConfig.path,
                        spawnConfig.creep,
                        index
                    );
                    this.spawns.push(spawn);
                }
            }
            this.model.waveIndex++;
            if (this.ui.m_ui_bottom.m_ui_start.m_btn_start.enabled) {
                //取消提示
                this.__closeTip();
            }
        } else {
            if (this.model.waveIndex == 0) {
                return;
            }
            if (this.__tips.has(this.model.waveIndex)) {
                return;
            }
            if (this.__time + waveConfig.tipTime >= waveConfig.time) {
                this.__tips.set(this.model.waveIndex, true);
                //需要提示下一波即将到来
                console.log("下一波即将到来");
                this.ui.m_ui_bottom.m_ui_start.m_btn_start.enabled = true;
                this.ui.m_ui_bottom.m_ui_start.m_btn_start.onClick(this.__startButtonClick, this);
            }
        }
    }

    /**
     * 生成怪物
     */
    private __spawnMonster(): void {
        //怪物配置
        for (let index = 0; index < this.spawns.length; index++) {
            const spawn = this.spawns[index];
            if (this.__time >= spawn.time) {
                this.spawns.splice(index, 1);
                index--;
                BattleEntityFactory.createMonster(this.world, spawn);
            }
        }
    }

    private __startButtonClick(e: FGUIEvent): void {
        this.__closeTip();
        const waveConfig = this.model.waveConfig![this.model.waveIndex];
        if (waveConfig.glod != undefined) {
            const starTip = waveConfig.time - waveConfig.tipTime;
            const t = this.__time - starTip;
            const p = 1 - (t / waveConfig.tipTime);
            if (p > 0.7) {
                this.model.glod += waveConfig.glod;
            } else {
                this.model.glod += Math.floor(waveConfig.glod * p);
            }
        }
        this.__time = waveConfig.time;
    }

    private __closeTip(): void {
        this.ui.m_ui_bottom.m_ui_start.m_btn_start.offClick(this.__startButtonClick, this);
        this.ui.m_ui_bottom.m_ui_start.m_btn_start.enabled = false;
    }

    private get ui(): UI_BattleView {
        return this.model.mediator.ui as UI_BattleView;
    }
}