"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelExport = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const ExcelUtils_1 = require("./ExcelUtils");
const ByteArray_1 = require("../../utils/ByteArray");
class ExcelExport {
    constructor() {
        /**表头所在行 */
        this.titleIndex = 0;
        this.typeIndex = 1;
        this.commentIndex = 2;
        /**数据开始行 */
        this.dataIndex = 3;
        this.fileIndex = 0;
    }
    /**
     * 导出
     * @param folder
     * @param dataFolder
     * @param scriptFolder
     * @param titleIndex
     * @param typeIndex
     * @param commentIndex
     * @param dataIndex
     * @param cb
     * @returns
     */
    export(folder, dataFolder, scriptFolder, titleIndex, typeIndex, commentIndex, dataIndex, progress, cb) {
        //文件夹不存在
        if (!(0, fs_1.existsSync)(folder)) {
            return;
        }
        this.fileIndex = 0;
        this.files = [];
        this.__readDir(folder, this.files);
        if (this.files.length == 0) {
            console.error("excel files equals to zero");
            return;
        }
        console.log("Start Export File Num:" + this.files.length);
        this.excelFolder = folder;
        this.dataFolder = dataFolder;
        this.scriptFolder = scriptFolder;
        this.titleIndex = titleIndex - 1;
        this.typeIndex = typeIndex - 1;
        this.commentIndex = commentIndex - 1;
        this.dataIndex = dataIndex - 1;
        this.progress = progress;
        this.callback = cb;
        this.tsTypeDefind = "";
        this.tsConfigEnum = "export enum ConfigKeys{\n";
        this.tryNext();
    }
    tryNext() {
        this.progress && this.progress(this.fileIndex / this.files.length);
        if (this.fileIndex < this.files.length) {
            this.__export();
        }
        else {
            //全部完成
            this.tsConfigEnum += "}";
            (0, fs_1.writeFileSync)(path_1.default.join(this.scriptFolder, "ConfigTypeDefind.d.ts"), this.tsTypeDefind);
            (0, fs_1.writeFileSync)(path_1.default.join(this.scriptFolder, "ConfigKeys.ts"), this.tsConfigEnum);
            this.callback && this.callback();
            return;
        }
        this.fileIndex++;
        setTimeout(() => {
            this.tryNext();
        }, 1);
    }
    __export() {
        const file = this.files[this.fileIndex];
        const filePath = this.excelFolder + "/" + file;
        const fileName = this.__getFileName(file, true);
        const excel = node_xlsx_1.default.parse(filePath);
        if (excel.length == 0) {
            return;
        }
        const spaceName = this.__getFristName(fileName);
        //以文件名为namespace
        this.tsTypeDefind += "declare namespace " + spaceName + " {\n";
        //文件夹
        const dir = this.dataFolder + "/" + fileName;
        if (!(0, fs_1.existsSync)(dir)) {
            (0, fs_1.mkdirSync)(dir);
        }
        for (let index = 0; index < excel.length; index++) {
            const sheet = excel[index];
            if (sheet.data.length < this.dataIndex) {
                continue;
            }
            const info = this.__exportSheetByte(fileName, sheet.name, sheet);
            this.tsTypeDefind += this.__generateTs(sheet.name, info.titles, info.trueTypes, info.comments);
            this.tsConfigEnum += this.__getConfigEnumTs(fileName, sheet.name);
            console.log("导出文件:" + filePath + "表:" + sheet.name);
        }
        this.tsTypeDefind += "}\n";
    }
    __getConfigEnumTs(fileName, sheetName) {
        const fileName1 = this.__getFristName(fileName);
        const sheetName1 = this.__getFristName(sheetName);
        //枚举定义
        return '   ' + fileName1 + "_" + sheetName1 + ' = "' + fileName + "/" + sheetName + '",\n';
    }
    __exportSheetByte(fileName, sheetName, sheet) {
        const sn = sheetName.match(/[^<]*\w+(?=>)*/)[0];
        //表头
        let titles = sheet.data[this.titleIndex];
        //数据类型
        let types = sheet.data[this.typeIndex];
        //注释
        let comments;
        //描述
        if (this.commentIndex >= 0) {
            comments = sheet.data[this.commentIndex];
        }
        else {
            comments = [];
        }
        //类型
        let trueTypes = [];
        let byte = new ByteArray_1.ByteArray();
        //表头
        byte.writeUnsignedInt(titles.length);
        for (let index = 0; index < titles.length; index++) {
            const title = titles[index];
            const titleName = title.replace(/^\s*|\s*$/g, "");
            byte.writeUTF(titleName);
        }
        //数据最小化类型列表
        ExcelUtils_1.ExcelUtils.getByteTypes(fileName, sheetName, this.titleIndex, this.typeIndex, this.dataIndex, sheet, trueTypes);
        if (types.length != trueTypes.length) {
            console.log(types);
            console.log(trueTypes);
            throw new Error("类型数量不一致！");
        }
        //类型数据
        byte.writeUnsignedInt(trueTypes.length);
        for (let index = 0; index < trueTypes.length; index++) {
            const type = trueTypes[index];
            byte.writeByte(type);
        }
        //数据
        byte.writeUnsignedInt(sheet.data.length - this.dataIndex);
        for (let colnmIndex = this.dataIndex; colnmIndex < sheet.data.length; colnmIndex++) {
            for (let index = 0; index < types.length; index++) {
                const value = sheet.data[colnmIndex][index];
                const type = types[index];
                const trueType = trueTypes[index];
                if (ExcelUtils_1.ExcelUtils.isArray(type)) {
                    this.__writeArray(trueType, value, byte);
                }
                else {
                    this.__writeValue(trueType, value, byte);
                }
            }
        }
        //.bin文件写入
        (0, fs_1.writeFileSync)(path_1.default.join(this.dataFolder + "/" + fileName + "/", sheetName + ".bin"), byte.bytes);
        return { titles, trueTypes, comments };
    }
    __writeArray(type, value, byte) {
        let arr;
        if (value == null || value == undefined) {
            arr = [];
        }
        else {
            arr = value.toString().split("|");
        }
        //数组的长度
        byte.writeUnsignedInt(arr.length);
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            switch (type) {
                case ExcelUtils_1.ByteType.nuil:
                    break;
                case ExcelUtils_1.ByteType.arr_byte:
                case ExcelUtils_1.ByteType.arr_ubyte:
                case ExcelUtils_1.ByteType.arr_short:
                case ExcelUtils_1.ByteType.arr_ushort:
                case ExcelUtils_1.ByteType.arr_int:
                case ExcelUtils_1.ByteType.arr_uint:
                case ExcelUtils_1.ByteType.arr_float:
                case ExcelUtils_1.ByteType.arr_number:
                    this.__writeNumber(type, element, byte);
                    break;
                case ExcelUtils_1.ByteType.arr_string:
                    byte.writeUTF((element == null || element == undefined) ? "" : element);
                    break;
                default:
                    throw new Error("未处理类型：" + type);
            }
        }
    }
    __writeValue(type, value, byte) {
        switch (type) {
            case ExcelUtils_1.ByteType.nuil:
                break;
            case ExcelUtils_1.ByteType.byte:
            case ExcelUtils_1.ByteType.ubyte:
            case ExcelUtils_1.ByteType.short:
            case ExcelUtils_1.ByteType.ushort:
            case ExcelUtils_1.ByteType.int:
            case ExcelUtils_1.ByteType.uint:
            case ExcelUtils_1.ByteType.float:
            case ExcelUtils_1.ByteType.number:
                this.__writeNumber(type, value, byte);
                break;
            case ExcelUtils_1.ByteType.string:
                byte.writeUTF((value == null || value == undefined) ? "" : value);
                break;
            default:
                throw new Error("未处理类型：" + type);
        }
    }
    __writeNumber(type, value, byte) {
        value = Number(value) == undefined ? 0 : value;
        switch (type) {
            case ExcelUtils_1.ByteType.nuil:
                break;
            case ExcelUtils_1.ByteType.byte:
            case ExcelUtils_1.ByteType.ubyte:
            case ExcelUtils_1.ByteType.arr_byte:
            case ExcelUtils_1.ByteType.arr_ubyte:
                byte.writeByte(Number(value));
                break;
            case ExcelUtils_1.ByteType.short:
            case ExcelUtils_1.ByteType.arr_short:
                byte.writeShort(Number(value));
                break;
            case ExcelUtils_1.ByteType.ushort:
            case ExcelUtils_1.ByteType.arr_ushort:
                byte.writeUnsignedShort(Number(value));
                break;
            case ExcelUtils_1.ByteType.int:
            case ExcelUtils_1.ByteType.arr_int:
                byte.writeInt(Number(value));
                break;
            case ExcelUtils_1.ByteType.uint:
            case ExcelUtils_1.ByteType.arr_uint:
                byte.writeUnsignedInt(Number(value));
                break;
            case ExcelUtils_1.ByteType.float:
            case ExcelUtils_1.ByteType.arr_float:
                byte.writeFloat(Number(value));
                break;
            case ExcelUtils_1.ByteType.number:
            case ExcelUtils_1.ByteType.arr_number:
                byte.writeDouble(Number(value));
                break;
            default:
                throw new Error("未处理类型：" + type);
        }
    }
    __generateTs(sheetName, titles, trueTypes, comments) {
        let result = "";
        //首字母大写
        const className = this.__getFristName(sheetName);
        result += `   export interface ${className}{\n`;
        let line = "";
        for (let index = 0; index < trueTypes.length; index++) {
            const trueType = trueTypes[index];
            const title = titles[index];
            const comment = comments.length > 0 ? comments[index] : title;
            // if (result.indexOf(title + ":") >= 0) {
            //     console.error(sheetName + "中存在重复字段：" + title);
            //     continue;
            // }
            if (comment == undefined) {
                line = "";
            }
            else {
                line = "      /**" + comment + "*/\n";
            }
            switch (trueType) {
                case ExcelUtils_1.ByteType.nuil:
                    line = "";
                    break;
                case ExcelUtils_1.ByteType.string:
                    line += `      ${title}:string;\n`;
                    break;
                case ExcelUtils_1.ByteType.byte:
                case ExcelUtils_1.ByteType.ubyte:
                case ExcelUtils_1.ByteType.short:
                case ExcelUtils_1.ByteType.ushort:
                case ExcelUtils_1.ByteType.int:
                case ExcelUtils_1.ByteType.uint:
                case ExcelUtils_1.ByteType.float:
                case ExcelUtils_1.ByteType.number:
                    line += `      ${title}:number;\n`;
                    break;
                case ExcelUtils_1.ByteType.arr_byte:
                case ExcelUtils_1.ByteType.arr_ubyte:
                case ExcelUtils_1.ByteType.arr_short:
                case ExcelUtils_1.ByteType.arr_ushort:
                case ExcelUtils_1.ByteType.arr_int:
                case ExcelUtils_1.ByteType.arr_uint:
                case ExcelUtils_1.ByteType.arr_float:
                case ExcelUtils_1.ByteType.arr_number:
                    line += `      ${title}:Array<number>;\n`;
                    break;
                case ExcelUtils_1.ByteType.arr_string:
                    line += `      ${title}:Array<string>;\n`;
                    break;
                default:
                    throw new Error(sheetName + ":" + title + "未知类型：" + trueType);
            }
            if (line == null || line == undefined || line == "" || line.length == 0) {
                continue;
            }
            result += line;
        }
        result += `   }\n`;
        return result;
    }
    __readDir(folder, result) {
        let files = (0, fs_1.readdirSync)(folder);
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const fullPath = path_1.default.join(folder, file);
            const fileInfo = (0, fs_1.statSync)(fullPath);
            if (fileInfo.isDirectory()) {
                this.__readDir(fullPath, result);
            }
            else if (fileInfo.isFile()) {
                const head = file.substring(0, 2);
                if (head === "~$") {
                    continue;
                }
                const extName = path_1.default.extname(file);
                if (extName === ".xlsx" || extName === ".xls") {
                    result.push(file);
                }
            }
        }
    }
    __getFileName(file, igExt) {
        let result;
        let pos = file.lastIndexOf("\\");
        result = file.substring(pos + 1);
        if (igExt) {
            result = result.replace(".xlsx", "");
            result = result.replace(".xls", "");
        }
        return result;
    }
    /**
     * 首字母大写返回
     * @param name
     * @returns
     */
    __getFristName(name) {
        return name.slice(0, 1).toUpperCase() + name.slice(1);
    }
}
exports.ExcelExport = ExcelExport;
