import { DisplayComponent } from "dream-cc-ecs";
import { DDLSSimpleView } from "dream-cc-pathfinding";





export class DDLSDebugComponent extends DisplayComponent{

    view:DDLSSimpleView;

    constructor(){
        super();
        this.view = new DDLSSimpleView();
    }

    enable(): void {
        super.enable();
        this.node.addChild(this.view);
    }

    reset(): void {
        super.reset();
        this.view.clear();
        this.view.removeFromParent();
    }
}