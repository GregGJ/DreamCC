import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { Injector } from 'dream-cc-core';
import { ILoadingView, LoadingView } from 'dream-cc-gui';
const { ccclass, property } = _decorator;

@ccclass('LoadingViewImpl')
export class LoadingViewImpl extends Component implements ILoadingView {

    @property({
        type: ProgressBar,
        visible: true,
    })
    progressBar: ProgressBar | undefined;

    @property({
        type: Label,
        visible: true,
    })
    label: Label | undefined;

    start() {
        Injector.inject(LoadingView.KEY, this);
    }

    changeData(data: { progress?: number; label?: string; tip?: string; }): void {
        if (this.progressBar != undefined && data.progress != undefined) {
            this.progressBar.progress = data.progress;
        }
        if (this.label != undefined && data.label != undefined) {
            this.label.string = data.label;
        }
    }

    show(): void {
        if (this.node.active) {
            return;
        }
        this.node.active = true;
    }
    
    hide(): void {
        if (!this.node.active) {
            return;
        }
        this.node.active = false;
    }
}


