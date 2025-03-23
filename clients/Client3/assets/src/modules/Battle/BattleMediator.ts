import { _decorator, Component } from 'cc';
import { IGUIMediator,IViewCreator,GUIMediator, ITabData} from 'dream-cc-gui';
import { BattleBinder, UI_BattleView } from "./BattleBinder";

const { ccclass, property } = _decorator;

@ccclass('BattleViewCreator')
export default class BattleViewCreator extends Component implements IViewCreator {

    createMediator(): IGUIMediator {
        BattleBinder.bindAll();
        return new BattleMediator();
    }
}

export class BattleMediator extends GUIMediator {

    constructor() {
        super();
    }

    init() {
        super.init();

    }

    show(data?: ITabData): void {
        super.show(data);

    }

    showedUpdate(data?: any): void {

    }

    hide(): void {
        super.hide();

    }

    destroy(): void {
        super.destroy();

    }

    private get view(): UI_BattleView {
        return this.ui as UI_BattleView;
    }
}
