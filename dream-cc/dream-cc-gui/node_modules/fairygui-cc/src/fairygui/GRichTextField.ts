import { BitmapFont, HorizontalTextAlignment, RichText, SpriteAtlas, SpriteFrame } from "cc";
import { PackageItemType, AutoSizeType } from "./FieldTypes";
import { GTextField } from "./GTextField";
import { PackageItem } from "./PackageItem";
import { UIConfig } from "./UIConfig";
import { UIPackage } from "./UIPackage";
import { toGrayedColor } from "./utils/ToolSet";
import { defaultParser } from "./utils/UBBParser";

export class RichTextImageAtlas extends SpriteAtlas {

    public getSpriteFrame(key: string): SpriteFrame {
        let pi: PackageItem = UIPackage.getItemByURL(key);
        if (pi) {
            pi.load();
            if (pi.type == PackageItemType.Image)
                return <SpriteFrame>pi.asset;
            else if (pi.type == PackageItemType.MovieClip)
                return pi.frames[0].texture;
        }

        return super.getSpriteFrame(key);
    }
}

const imageAtlas: RichTextImageAtlas = new RichTextImageAtlas();

export class GRichTextField extends GTextField {
    public _richText: RichText;

    private _bold: boolean;
    private _italics: boolean;
    private _underline: boolean;

    public linkUnderline: boolean;
    public linkColor: string;

    public constructor() {
        super();

        this._node.name = "GRichTextField";
        this._touchDisabled = false;
        this.linkUnderline = UIConfig.linkUnderline;
    }

    protected createRenderer() {
        this._richText = this._node.addComponent(RichText);
        this._richText.handleTouchEvent = false;
        this.autoSize = AutoSizeType.None;
        this._richText.imageAtlas = imageAtlas;
    }

    public get align(): HorizontalTextAlignment {
        return this._richText.horizontalAlign;
    }

    public set align(value: HorizontalTextAlignment) {
        this._richText.horizontalAlign = value;
    }

    public get underline(): boolean {
        return this._underline;
    }

    public set underline(value: boolean) {
        if (this._underline != value) {
            this._underline = value;

            this.updateText();
        }
    }

    public get bold(): boolean {
        return this._bold;
    }

    public set bold(value: boolean) {
        if (this._bold != value) {
            this._bold = value;

            this.updateText();
        }
    }

    public get italic(): boolean {
        return this._italics;
    }

    public set italic(value: boolean) {
        if (this._italics != value) {
            this._italics = value;

            this.updateText();
        }
    }

    protected markSizeChanged(): void {
        //RichText貌似没有延迟重建文本，所以这里不需要
    }

    protected updateText(): void {
        var text2: string = this.replaceHtmlColor(this._text);

        if (this._templateVars)
            text2 = this.parseTemplate(text2);

        if (this._ubbEnabled) {
            defaultParser.linkUnderline = this.linkUnderline;
            defaultParser.linkColor = this.linkColor;

            text2 = defaultParser.parse(text2);
        }

        if (this._bold)
            text2 = "<b>" + text2 + "</b>";
        if (this._italics)
            text2 = "<i>" + text2 + "</i>";
        if (this._underline)
            text2 = "<u>" + text2 + "</u>";
        let c = this._color
        if (this._grayed)
            c = toGrayedColor(c);
        text2 = "<color=" + c.toHEX("#rrggbb") + ">" + text2 + "</color>";

        if (this._autoSize == AutoSizeType.Both) {
            if (this._richText.maxWidth != 0)
                this._richText["_maxWidth"] = 0;
            this._richText.string = text2;
            if (this.maxWidth != 0 && this._uiTrans.contentSize.width > this.maxWidth)
                this._richText.maxWidth = this.maxWidth;
        }
        else
            this._richText.string = text2;
    }

    private replaceHtmlColor(html: string): string {
        // 定义正则表达式，用于匹配带有颜色标签的内容
        const regex = /<font\s+color=(['"])#([0-9a-fA-F]{6})\1>(.*?)<\/font>/g
        // /<font\s+color=(['"#]?)([0-9a-fA-F]{6})\1>(.*?)<\/font>/g;
        // /<font color="#([0-9a-fA-F]{6})">(.*?)<\/font>/g;
        // 使用正则表达式执行匹配操作
        let match;
        let result = html;
        let index = 0;

        // 遍历所有匹配的结果
        while ((match = regex.exec(html)) !== null) {
            // 提取颜色代码和内容
            const colorCode = match[2];
            const content = match[3];
            // 构建替换后的字符串
            const replacement = `<color=${colorCode}>${content}</color>`;
            // 在原始字符串中替换匹配项
            result = result.slice(0, match.index) + replacement + result.slice(regex.lastIndex);
            // 更新索引，以便下一次匹配从正确的位置开始
            index = regex.lastIndex;
        }

        return result;
    }

    protected updateFont() {
        this.assignFont(this._richText, this._realFont);
    }

    protected updateFontColor() {
        this.assignFontColor(this._richText, this._color);
    }

    protected updateFontSize() {
        let fontSize: number = this._fontSize;
        let font: any = this._richText.font;
        if (font instanceof BitmapFont) {
            if (!font.fntConfig.resizable)
                fontSize = font.fntConfig.fontSize;
        }

        this._richText.fontSize = fontSize;
        this._richText.lineHeight = fontSize + this._leading * 2;
    }

    protected updateOverflow() {
        if (this._autoSize == AutoSizeType.Both)
            this._richText.maxWidth = 0;
        else
            this._richText.maxWidth = this._width;
    }

    protected handleSizeChanged(): void {
        if (this._updatingSize)
            return;

        if (this._autoSize != AutoSizeType.Both)
            this._richText.maxWidth = this._width;
    }
}