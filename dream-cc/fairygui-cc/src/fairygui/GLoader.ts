import { Asset, assetManager, Color, ImageAsset, isValid, Node, resources, Sprite, SpriteFrame, Texture2D, UITransform, Vec2 } from "cc";
import { MovieClip } from "./display/MovieClip";
import { AlignType, VertAlignType, LoaderFillType, FillMethod, FillOrigin, PackageItemType, ObjectPropID } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
import { GObjectPool } from "./GObjectPool";
import { PackageItem } from "./PackageItem";
import { UIConfig } from "./UIConfig";
import { UIPackage } from "./UIPackage";
import { ByteBuffer } from "./utils/ByteBuffer";
import { ResURL } from "dream-cc-core";

export class GLoader extends GObject {
    public _content: MovieClip;

    private _url: ResURL;
    private _align: AlignType;
    private _verticalAlign: VertAlignType;
    private _autoSize: boolean;
    private _fill: LoaderFillType;
    private _shrinkOnly: boolean;
    private _showErrorSign: boolean;
    private _playing: boolean;
    private _frame: number = 0;
    private _color: Color;
    private _contentItem: PackageItem;
    private _container: Node;
    private _errorSign?: GObject;
    private _content2?: GComponent;
    private _updatingLayout: boolean;
    private _assetBundle: string;
    private _containerUITrans: UITransform;

    private static _errorSignPool: GObjectPool = new GObjectPool();

    public constructor() {
        super();

        this._node.name = "GLoader";
        this._playing = true;
        this._url = "";
        this._fill = LoaderFillType.None;
        this._align = AlignType.Left;
        this._verticalAlign = VertAlignType.Top;
        this._showErrorSign = true;
        this._color = new Color(255, 255, 255, 255);

        this._container = new Node("Image");
        this._container.layer = UIConfig.defaultUILayer;
        this._containerUITrans = this._container.addComponent(UITransform);
        this._containerUITrans.setAnchorPoint(0, 1);
        this._node.addChild(this._container);

        this._content = this._container.addComponent(MovieClip);
        this._content.sizeMode = Sprite.SizeMode.CUSTOM;
        this._content.trim = false;
        this._content.setPlaySettings();
    }

    public dispose(): void {
        if (this._contentItem == null) {
            if (this._content.spriteFrame)
                this.freeExternal(this._content.spriteFrame);
        }
        if (this._content2)
            this._content2.dispose();
        super.dispose();
    }

    public get url(): ResURL | null {
        return this._url;
    }

    public set url(value: ResURL | null) {
        if (this._url == value)
            return;

        this._url = value;
        this.loadContent();
        this.updateGear(7);
    }
    /**
     * 设置图片
     * @param url 
     * @param bundleStr 远程包名称
     */
    public setUrlWithBundle(url: ResURL, bundleStr: string = ''): void {
        this.bundle = bundleStr
        this.url = url;
    }

    public set bundle(val: string) {
        this._assetBundle = val;
    }

    public get bundle(): string {
        if (this._assetBundle) {
            return this._assetBundle;
        }
        return UIConfig.loaderAssetsBundleName;
    }

    public get icon(): ResURL | null {
        return this._url;
    }

    public set icon(value: ResURL | null) {
        this.url = value;
    }

    public get align(): AlignType {
        return this._align;
    }

    public set align(value: AlignType) {
        if (this._align != value) {
            this._align = value;
            this.updateLayout();
        }
    }

    public get verticalAlign(): VertAlignType {
        return this._verticalAlign;
    }

    public set verticalAlign(value: VertAlignType) {
        if (this._verticalAlign != value) {
            this._verticalAlign = value;
            this.updateLayout();
        }
    }

    public get fill(): LoaderFillType {
        return this._fill;
    }

    public set fill(value: LoaderFillType) {
        if (this._fill != value) {
            this._fill = value;
            this.updateLayout();
        }
    }

    public get shrinkOnly(): boolean {
        return this._shrinkOnly;
    }

    public set shrinkOnly(value: boolean) {
        if (this._shrinkOnly != value) {
            this._shrinkOnly = value;
            this.updateLayout();
        }
    }

    public get autoSize(): boolean {
        return this._autoSize;
    }

    public set autoSize(value: boolean) {
        if (this._autoSize != value) {
            this._autoSize = value;
            this.updateLayout();
        }
    }

    public get playing(): boolean {
        return this._playing;
    }

    public set playing(value: boolean) {
        if (this._playing != value) {
            this._playing = value;
            if (this._content instanceof MovieClip)
                this._content.playing = value;
            this.updateGear(5);
        }
    }

    public get frame(): number {
        return this._frame;
    }

    public set frame(value: number) {
        if (this._frame != value) {
            this._frame = value;
            if (this._content instanceof MovieClip)
                this._content.frame = value;
            this.updateGear(5);
        }
    }

    public get color(): Color {
        return this._color;
    }

    public set color(value: Color) {
        this._color.set(value);
        this.updateGear(4);
        this._content.color = value;
    }

    public get fillMethod(): FillMethod {
        return this._content.fillMethod;
    }

    public set fillMethod(value: FillMethod) {
        this._content.fillMethod = value;
    }

    public get fillOrigin(): FillOrigin {
        return this._content.fillOrigin;
    }

    public set fillOrigin(value: FillOrigin) {
        this._content.fillOrigin = value;
    }

    public get fillClockwise(): boolean {
        return this._content.fillClockwise;
    }

    public set fillClockwise(value: boolean) {
        this._content.fillClockwise = value;
    }

    public get fillAmount(): number {
        return this._content.fillAmount;
    }

    public set fillAmount(value: number) {
        this._content.fillAmount = value;
    }

    public get showErrorSign(): boolean {
        return this._showErrorSign;
    }

    public set showErrorSign(value: boolean) {
        this._showErrorSign = value;
    }

    public get component(): GComponent {
        return this._content2;
    }

    public get texture(): SpriteFrame {
        return this._content.spriteFrame;
    }

    public set texture(value: SpriteFrame) {
        this.url = null;

        this._content.spriteFrame = value;
        this._content.type = Sprite.Type.SIMPLE;
        if (value != null) {
            this.sourceWidth = value.rect.width;
            this.sourceHeight = value.rect.height;
        }
        else {
            this.sourceWidth = this.sourceHeight = 0;
        }

        this.updateLayout();
    }

    protected loadContent(): void {
        this.clearContent();

        if (!this._url)
            return;

        if (typeof this._url == "string" && this._url.startsWith("ui://"))
            this.loadFromPackage(this._url);
        else
            this.loadExternal();
    }

    protected loadFromPackage(itemURL: string) {
        let contentItem = UIPackage.getItemByURL(itemURL);
        this._contentItem = contentItem;
        if (!contentItem) {
            this.setErrorState();
            return;
        }

        contentItem = contentItem.getBranch();
        this.sourceWidth = contentItem.width;
        this.sourceHeight = contentItem.height;
        contentItem = contentItem.getHighResolution();
        contentItem.load();

        if (this._autoSize)
            this.setSize(this.sourceWidth, this.sourceHeight);

        if (contentItem.type == PackageItemType.Image) {
            if (!contentItem.asset) {
                this.setErrorState();
            }
            else {
                this._content.spriteFrame = <SpriteFrame>contentItem.asset;
                if (this._content.fillMethod == 0) {
                    if (contentItem.scale9Grid)
                        this._content.type = Sprite.Type.SLICED;
                    else if (contentItem.scaleByTile)
                        this._content.type = Sprite.Type.TILED;
                    else
                        this._content.type = Sprite.Type.SIMPLE;
                }
                else {
                    this._content.type = Sprite.Type.FILLED;
                }
                this.updateLayout();
            }
        }
        else if (contentItem.type == PackageItemType.MovieClip) {
            this._content.interval = contentItem.interval;
            this._content.swing = contentItem.swing;
            this._content.repeatDelay = contentItem.repeatDelay;
            this._content.frames = contentItem.frames;
            this.updateLayout();
        }
        else if (contentItem.type == PackageItemType.Component) {
            var obj: GObject = UIPackage.createObjectFromURL(itemURL);
            if (!obj)
                this.setErrorState();
            else if (!(obj instanceof GComponent)) {
                obj.dispose();
                this.setErrorState();
            }
            else {
                this._content2 = obj;
                this._container.addChild(this._content2.node);
                this.updateLayout();
            }
        }
        else
            this.setErrorState();
    }

    protected loadExternal(): void {
        let url = this.url;
        let callback = (err: Error | null, asset: Asset) => {
            //因为是异步返回的，而这时可能url已经被改变，所以不能直接用返回的结果

            if (this._url != url || !isValid(this._node))
                return;

            if (err)
                console.warn(err);

            if (asset instanceof SpriteFrame)
                this.onExternalLoadSuccess(asset);
            else if (asset instanceof Texture2D) {
                let sf = new SpriteFrame();
                sf.texture = asset;
                this.onExternalLoadSuccess(sf);
            }
            else if (asset instanceof ImageAsset) {
                let texture = new Texture2D();
                texture.image = asset;
                let sf = new SpriteFrame();
                sf.texture = texture;
                this.onExternalLoadSuccess(sf);
            }
            else {
                console.warn("GLoader:cant load", this.url);
            }
        };
        if (typeof this._url == "string") {
            if (this._url.startsWith("http://")
                || this._url.startsWith("https://")
                || this._url.startsWith('/'))
                assetManager.loadRemote(this._url, callback);
            else if (this._url.startsWith('data:image/')) {
                const img = new Image();
                img.src = this._url;
                img.onload = () => {
                    const tex = new Texture2D();
                    tex.reset({
                        width: img.width,
                        height: img.height,
                    });
                    tex.uploadData(img, 0, 0);
                    callback(null, tex);
                }
            }
            else {
                let bundle = resources;
                //如果有设置远程包 从远程包加载
                if (this.bundle && assetManager.bundles.has(this.bundle)) {
                    bundle = assetManager.getBundle(this.bundle);
                }
                bundle.load(this._url + "/spriteFrame", Asset, callback);
            }
        } else {
            throw new Error("fgui底层未实现CCURL的非string资源加载！");
        }
    }

    protected freeExternal(texture: SpriteFrame): void {
    }

    protected onExternalLoadSuccess(texture: SpriteFrame): void {
        this._content.spriteFrame = texture;
        this._content.type = Sprite.Type.SIMPLE;
        this.sourceWidth = texture.originalSize.width;
        this.sourceHeight = texture.originalSize.height;
        if (this._autoSize)
            this.setSize(this.sourceWidth, this.sourceHeight);
        this.updateLayout();
    }

    protected onExternalLoadFailed(): void {
        this.setErrorState();
    }

    private setErrorState(): void {
        if (!this._showErrorSign)
            return;

        if (this._errorSign == null) {
            if (UIConfig.loaderErrorSign != null) {
                this._errorSign = GLoader._errorSignPool.getObject(UIConfig.loaderErrorSign);
            }
        }

        if (this._errorSign) {
            this._errorSign.setSize(this.width, this.height);
            this._container.addChild(this._errorSign.node);
        }
    }

    private clearErrorState(): void {
        if (this._errorSign) {
            this._container.removeChild(this._errorSign.node);
            GLoader._errorSignPool.returnObject(this._errorSign);
            this._errorSign = null;
        }
    }

    private updateLayout(): void {
        if (this._content2 == null && this._content == null) {
            if (this._autoSize) {
                this._updatingLayout = true;
                this.setSize(50, 30);
                this._updatingLayout = false;
            }
            return;
        }

        let cw = this.sourceWidth;
        let ch = this.sourceHeight;

        let pivotCorrectX = -this.pivotX * this._width;
        let pivotCorrectY = this.pivotY * this._height;

        if (this._autoSize) {
            this._updatingLayout = true;
            if (cw == 0)
                cw = 50;
            if (ch == 0)
                ch = 30;

            this.setSize(cw, ch);
            this._updatingLayout = false;

            this._containerUITrans.setContentSize(this._width, this._height);
            this._container.setPosition(pivotCorrectX, pivotCorrectY);
            if (this._content2) {
                this._content2.setPosition(pivotCorrectX + this._width * this.pivotX, pivotCorrectY - this._height * this.pivotY);
                this._content2.setScale(1, 1);
            }
            if (cw == this._width && ch == this._height)
                return;
        }

        var sx: number = 1, sy: number = 1;
        if (this._fill != LoaderFillType.None) {
            sx = this.width / this.sourceWidth;
            sy = this.height / this.sourceHeight;

            if (sx != 1 || sy != 1) {
                if (this._fill == LoaderFillType.ScaleMatchHeight)
                    sx = sy;
                else if (this._fill == LoaderFillType.ScaleMatchWidth)
                    sy = sx;
                else if (this._fill == LoaderFillType.Scale) {
                    if (sx > sy)
                        sx = sy;
                    else
                        sy = sx;
                }
                else if (this._fill == LoaderFillType.ScaleNoBorder) {
                    if (sx > sy)
                        sy = sx;
                    else
                        sx = sy;
                }
                if (this._shrinkOnly) {
                    if (sx > 1)
                        sx = 1;
                    if (sy > 1)
                        sy = 1;
                }
                cw = this.sourceWidth * sx;
                ch = this.sourceHeight * sy;
            }
        }

        this._containerUITrans.setContentSize(cw, ch);
        if (this._content2) {
            this._content2.setPosition(pivotCorrectX + this._width * this.pivotX, pivotCorrectY - this._height * this.pivotY);
            this._content2.setScale(sx, sy);
        }

        var nx: number, ny: number;
        if (this._align == AlignType.Left)
            nx = 0;
        else if (this._align == AlignType.Center)
            nx = Math.floor((this._width - cw) / 2);
        else
            nx = this._width - cw;
        if (this._verticalAlign == VertAlignType.Top)
            ny = 0;
        else if (this._verticalAlign == VertAlignType.Middle)
            ny = Math.floor((this._height - ch) / 2);
        else
            ny = this._height - ch;
        ny = -ny;
        this._container.setPosition(pivotCorrectX + nx, pivotCorrectY + ny);
    }

    private clearContent(): void {
        this.clearErrorState();

        if (!this._contentItem) {
            var texture: SpriteFrame = this._content.spriteFrame;
            if (texture)
                this.freeExternal(texture);
        }
        if (this._content2) {
            this._container.removeChild(this._content2.node);
            this._content2.dispose();
            this._content2 = null;
        }
        this._content.frames = null;
        this._content.spriteFrame = null;
        this._contentItem = null;
    }

    protected handleSizeChanged(): void {
        super.handleSizeChanged();

        if (!this._updatingLayout)
            this.updateLayout();
    }

    protected handleAnchorChanged(): void {
        super.handleAnchorChanged();

        if (!this._updatingLayout)
            this.updateLayout();
    }

    protected handleGrayedChanged(): void {
        this._content.grayscale = this._grayed;
    }

    protected _hitTest(pt: Vec2, globalPt: Vec2): GObject {
        if (this._content2) {
            let obj: GObject = this._content2.hitTest(globalPt);
            if (obj)
                return obj;
        }

        if (pt.x >= 0 && pt.y >= 0 && pt.x < this._width && pt.y < this._height)
            return this;
        else
            return null;
    }

    public getProp(index: number): any {
        switch (index) {
            case ObjectPropID.Color:
                return this.color;
            case ObjectPropID.Playing:
                return this.playing;
            case ObjectPropID.Frame:
                return this.frame;
            case ObjectPropID.TimeScale:
                return this._content.timeScale;
            default:
                return super.getProp(index);
        }
    }

    public setProp(index: number, value: any): void {
        switch (index) {
            case ObjectPropID.Color:
                this.color = value;
                break;
            case ObjectPropID.Playing:
                this.playing = value;
                break;
            case ObjectPropID.Frame:
                this.frame = value;
                break;
            case ObjectPropID.TimeScale:
                this._content.timeScale = value;
                break;
            case ObjectPropID.DeltaTime:
                this._content.advance(value);
                break;
            default:
                super.setProp(index, value);
                break;
        }
    }

    public setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void {
        super.setup_beforeAdd(buffer, beginPos);

        buffer.seek(beginPos, 5);

        this._url = buffer.readS();
        this._align = buffer.readByte();
        this._verticalAlign = buffer.readByte();
        this._fill = buffer.readByte();
        this._shrinkOnly = buffer.readBool();
        this._autoSize = buffer.readBool();
        this._showErrorSign = buffer.readBool();
        this._playing = buffer.readBool();
        this._frame = buffer.readInt();

        if (buffer.readBool())
            this.color = buffer.readColor();
        this._content.fillMethod = buffer.readByte();
        if (this._content.fillMethod != 0) {

            this._content.fillOrigin = buffer.readByte();
            this._content.fillClockwise = buffer.readBool();
            this._content.fillAmount = buffer.readFloat();
        }

        if (this._url)
            this.loadContent();
    }
}