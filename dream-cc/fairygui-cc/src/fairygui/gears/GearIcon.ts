import { ResURL } from "dream-cc-core";
import { ByteBuffer } from "../utils/ByteBuffer";
import { GearBase } from "./GearBase";

export class GearIcon extends GearBase {
    private _storage: { [index: string]: ResURL };
    private _default: ResURL;

    protected init(): void {
        this._default = this._owner.icon;
        this._storage = {};
    }

    protected addStatus(pageId: string, buffer: ByteBuffer): void {
        if (!pageId)
            this._default = buffer.readS();
        else
            this._storage[pageId] = buffer.readS();
    }

    public apply(): void {
        this._owner._gearLocked = true;

        var data: any = this._storage[this._controller.selectedPageId];
        if (data !== undefined)
            this._owner.icon = data;
        else
            this._owner.icon = this._default;

        this._owner._gearLocked = false;
    }

    public updateState(): void {
        this._storage[this._controller.selectedPageId] = this._owner.icon;
    }
}
