import { ResRequest } from "dream-cc-core";


export class TowerSkinAsset {

    elements: Array<TowerSkinElement> | null = null;

    private assetRequest: ResRequest;

    constructor(elements: Array<TowerSkinElement>, request: ResRequest) {
        this.elements = elements;
        this.assetRequest = request;
    }

    destroy(): void {
        this.assetRequest.dispose();
        this.assetRequest = null;
        this.elements!.length = 0;
        this.elements = null;
    }
}

export class TowerSkinElement {
    name: string;
    type: string;
    asset: any;
    ax: number = 0;
    ay: number = 0;
    x: number = 0;
    y: number = 0;

    constructor(name: string, type: string, asset: any, ax: number, ay: number, x: number, y: number) {
        this.name = name;
        this.type = type;
        this.asset = asset;
        this.ax = ax;
        this.ay = ay;
        this.x = x;
        this.y = y;
    }
}