import { BitmapFont, RichText, SpriteAtlas } from "cc";
import { PackageItemType, AutoSizeType } from "./FieldTypes";
import { GTextField } from "./GTextField";
import { UIConfig } from "./UIConfig";
import { UIPackage } from "./UIPackage";
import { toGrayedColor } from "./utils/ToolSet";
import { defaultParser } from "./utils/UBBParser";
export class RichTextImageAtlas extends SpriteAtlas {
    getSpriteFrame(key) {
        let pi = UIPackage.getItemByURL(key);
        if (pi) {
            pi.load();
            if (pi.type == PackageItemType.Image)
                return pi.asset;
            else if (pi.type == PackageItemType.MovieClip)
                return pi.frames[0].texture;
        }
        return super.getSpriteFrame(key);
    }
}
const imageAtlas = new RichTextImageAtlas();
export class GRichTextField extends GTextField {
    constructor() {
        super();
        this._node.name = "GRichTextField";
        this._touchDisabled = false;
        this.linkUnderline = UIConfig.linkUnderline;
    }
    createRenderer() {
        this._richText = this._node.addComponent(RichText);
        this._richText.handleTouchEvent = false;
        this.autoSize = AutoSizeType.None;
        this._richText.imageAtlas = imageAtlas;
    }
    get align() {
        return this._richText.horizontalAlign;
    }
    set align(value) {
        this._richText.horizontalAlign = value;
    }
    get underline() {
        return this._underline;
    }
    set underline(value) {
        if (this._underline != value) {
            this._underline = value;
            this.updateText();
        }
    }
    get bold() {
        return this._bold;
    }
    set bold(value) {
        if (this._bold != value) {
            this._bold = value;
            this.updateText();
        }
    }
    get italic() {
        return this._italics;
    }
    set italic(value) {
        if (this._italics != value) {
            this._italics = value;
            this.updateText();
        }
    }
    markSizeChanged() {
        //RichText貌似没有延迟重建文本，所以这里不需要
    }
    updateText() {
        var text2 = this.replaceHtmlColor(this._text);
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
        let c = this._color;
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
    replaceHtmlColor(html) {
        // 定义正则表达式，用于匹配带有颜色标签的内容
        const regex = /<font\s+color=(['"])#([0-9a-fA-F]{6})\1>(.*?)<\/font>/g;
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
    updateFont() {
        this.assignFont(this._richText, this._realFont);
    }
    updateFontColor() {
        this.assignFontColor(this._richText, this._color);
    }
    updateFontSize() {
        let fontSize = this._fontSize;
        let font = this._richText.font;
        if (font instanceof BitmapFont) {
            if (!font.fntConfig.resizable)
                fontSize = font.fntConfig.fontSize;
        }
        this._richText.fontSize = fontSize;
        this._richText.lineHeight = fontSize + this._leading * 2;
    }
    updateOverflow() {
        if (this._autoSize == AutoSizeType.Both)
            this._richText.maxWidth = 0;
        else
            this._richText.maxWidth = this._width;
    }
    handleSizeChanged() {
        if (this._updatingSize)
            return;
        if (this._autoSize != AutoSizeType.Both)
            this._richText.maxWidth = this._width;
    }
}
