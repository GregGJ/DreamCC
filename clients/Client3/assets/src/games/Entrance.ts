import { _decorator, Component } from 'cc';
import { Engine, Event, TaskQueue } from 'dream-cc-core';
import { GUIManager, LoadingView } from 'dream-cc-gui';
import { GUIKeys } from './consts/GUIKeys';
import { ConfigInitTask } from './inits/ConfigInitTask';
import { EngineInitTask } from './inits/EngineInitTask';
const { ccclass, property } = _decorator;

@ccclass('Entrance')
export class Entrance extends Component {

    private __taskQueue: TaskQueue;

    start() {
        this.__taskQueue = new TaskQueue();
        this.__taskQueue.addTask(
            [
                new EngineInitTask(),
                new ConfigInitTask()
            ]
        );
        this.__taskQueue.start(this.node);
        this.__taskQueue.addEventHandler(this.__taskEventHandler, this);
    }

    private __taskEventHandler(e: Event) {
        if (e.type == Event.PROGRESS) {
            LoadingView.changeData({ progress: e.progress });
        } else if (e.type == Event.ERROR) {
            LoadingView.changeData({ progress: e.progress, label: e.error.message });
        } else if (e.type == Event.COMPLETE) {
            this.__taskQueue.removeEventHandler(this.__taskEventHandler, this);
            this.__taskQueue.destroy();
            this.__taskQueue = null;
            LoadingView.hide();
            GUIManager.open(GUIKeys.Home);
        }
    }

    update(deltaTime: number) {
        Engine.tick(deltaTime);
    }
}