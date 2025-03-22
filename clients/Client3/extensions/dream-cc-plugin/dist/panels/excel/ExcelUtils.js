"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelUtils = exports.ByteType = void 0;
var ByteType;
(function (ByteType) {
    ByteType[ByteType["nuil"] = -1] = "nuil";
    ByteType[ByteType["byte"] = 0] = "byte";
    ByteType[ByteType["ubyte"] = 1] = "ubyte";
    ByteType[ByteType["short"] = 2] = "short";
    ByteType[ByteType["ushort"] = 3] = "ushort";
    ByteType[ByteType["int"] = 4] = "int";
    ByteType[ByteType["uint"] = 5] = "uint";
    ByteType[ByteType["float"] = 6] = "float";
    ByteType[ByteType["number"] = 7] = "number";
    ByteType[ByteType["string"] = 8] = "string";
    ByteType[ByteType["arr_byte"] = 9] = "arr_byte";
    ByteType[ByteType["arr_ubyte"] = 10] = "arr_ubyte";
    ByteType[ByteType["arr_short"] = 11] = "arr_short";
    ByteType[ByteType["arr_ushort"] = 12] = "arr_ushort";
    ByteType[ByteType["arr_int"] = 13] = "arr_int";
    ByteType[ByteType["arr_uint"] = 14] = "arr_uint";
    ByteType[ByteType["arr_float"] = 15] = "arr_float";
    ByteType[ByteType["arr_number"] = 16] = "arr_number";
    ByteType[ByteType["arr_string"] = 17] = "arr_string";
})(ByteType || (exports.ByteType = ByteType = {}));
class ExcelUtils {
    static getByteTypes(fileName, sheetName, titleIndex, typeIndex, dataIndex, sheet, result) {
        result = result || [];
        let titleList = sheet.data[titleIndex];
        let typeList = sheet.data[typeIndex];
        // console.log(fileName, sheetName, titleIndex, typeIndex, dataIndex);
        let valueList;
        for (let colIndex = 0; colIndex < typeList.length; colIndex++) {
            let type = typeList[colIndex];
            let lowType = type.toLowerCase();
            let title = titleList[colIndex];
            //类型不在允许范围内
            if (this.typeCodes.indexOf(lowType) < 0 && this.arrTypeCodes.indexOf(lowType) < 0) {
                throw new Error("文件:" + fileName + " 表=>" + sheetName + " 字段=>" + title + " 类型不合法=>" + type);
            }
            //字符串
            if (lowType == "string") {
                result.push(ByteType.string);
                continue;
            }
            if (lowType == "[string]") {
                result.push(ByteType.arr_string);
                continue;
            }
            //数字
            valueList = [];
            for (let rowIndex = dataIndex; rowIndex < sheet.data.length; rowIndex++) {
                let value = sheet.data[rowIndex][colIndex];
                if (value == null || value == undefined) {
                    continue;
                }
                //如果是数组
                if (this.isArray(lowType)) {
                    let arr = value.toString().split("|");
                    if (arr.length > 0) {
                        if (arr.length == 1) {
                            //数字
                            if (Number(value) != undefined) {
                                valueList.push(Number(value));
                            }
                            else {
                                throw new Error("配置文件:" + fileName + " 表:" + sheetName + " 字段:" + title + " 无法转换为数字!");
                            }
                        }
                        else {
                            for (let index = 0; index < arr.length; index++) {
                                const element = arr[index];
                                //数字
                                if (Number(value) != undefined) {
                                    valueList.push(Number(element));
                                }
                                else {
                                    valueList.push(element);
                                }
                            }
                        }
                    }
                }
                else {
                    //数字
                    if (Number(value) != undefined) {
                        valueList.push(Number(value));
                    }
                    else {
                        valueList.push(value);
                    }
                }
            }
            let trueType;
            //占位
            if (valueList.length == 0) {
                trueType = this.__getLow2TrueType(type);
            }
            else {
                trueType = this.__getMinSizeNumberType(fileName, sheetName, title, valueList);
                // Editor.log(title+":"+trueType);
            }
            //数组
            if (this.isArray(lowType)) {
                result.push(ByteType["arr_" + ByteType[trueType]]);
            }
            else {
                result.push(trueType);
            }
        }
        return result;
    }
    static __getLow2TrueType(type) {
        if (this.isArray(type)) {
            const index = this.arrTypeCodes.indexOf(type);
            const lowType = this.typeCodes[index];
            return ByteType[lowType];
        }
        return ByteType[type];
    }
    static __getMinSizeNumberType(fileName, sheetName, title, nums) {
        let max = Number.MIN_SAFE_INTEGER;
        let min = Number.MAX_SAFE_INTEGER;
        let isFloat = false;
        for (let index = 0; index < nums.length; index++) {
            const num = nums[index];
            if (num.toString().indexOf(".") >= 0) {
                isFloat = true;
            }
            if (num > max) {
                max = num;
            }
            if (num < min) {
                min = num;
            }
        }
        //浮点数
        if (isFloat) {
            //float
            const floatMin = -3.4E+38;
            const floatMax = 3.4E+38;
            if (this.__inSection(min, floatMin, floatMax) && this.__inSection(max, floatMin, floatMax)) {
                return ByteType.float;
            }
            else {
                return ByteType.number;
            }
        }
        else { //整数
            let a = min < 0;
            let b = max < 0;
            //符号相同且都为正数
            if (a == b && min >= 0) {
                if (this.__inSection(min, ExcelUtils.UByteMin, ExcelUtils.UByteMax) && this.__inSection(max, ExcelUtils.UByteMin, ExcelUtils.UByteMax)) {
                    return ByteType.ubyte;
                }
                if (this.__inSection(min, ExcelUtils.UShortMin, ExcelUtils.UShortMax) && this.__inSection(max, ExcelUtils.UShortMin, ExcelUtils.UShortMax)) {
                    return ByteType.ushort;
                }
                if (this.__inSection(min, ExcelUtils.UintMin, ExcelUtils.UintMax) && this.__inSection(max, ExcelUtils.UintMin, ExcelUtils.UintMax)) {
                    return ByteType.uint;
                }
                throw new Error("配置文件:" + fileName + " 表:" + sheetName + " 字段:" + title + " 数值范围:" + min + "," + max + " 无法存储该值=>" + nums);
            }
            else { //有正有负或都为负数
                if (this.__inSection(min, ExcelUtils.ByteMin, ExcelUtils.ByteMax) && this.__inSection(max, ExcelUtils.ByteMin, ExcelUtils.ByteMax)) {
                    return ByteType.byte;
                }
                if (this.__inSection(min, ExcelUtils.ShortMin, ExcelUtils.ShortMax) && this.__inSection(max, ExcelUtils.ShortMin, ExcelUtils.ShortMax)) {
                    return ByteType.short;
                }
                if (this.__inSection(min, ExcelUtils.IntMin, ExcelUtils.IntMax) && this.__inSection(max, ExcelUtils.IntMin, ExcelUtils.IntMax)) {
                    return ByteType.int;
                }
                throw new Error("配置文件:" + fileName + " 表:" + sheetName + " 字段:" + title + " 数值范围:" + min + "," + max + " 无法存储该值=>" + nums);
            }
        }
    }
    static __inSection(value, min, max) {
        return value >= min && value <= max;
    }
    static isArray(value) {
        return ExcelUtils.arrTypeCodes.includes(value);
    }
}
exports.ExcelUtils = ExcelUtils;
ExcelUtils.UByteMin = 0;
ExcelUtils.UByteMax = 255;
ExcelUtils.UShortMin = 0;
ExcelUtils.UShortMax = 65535;
ExcelUtils.UintMin = 0;
ExcelUtils.UintMax = 9007199254740991;
ExcelUtils.ByteMin = -128;
ExcelUtils.ByteMax = 127;
ExcelUtils.ShortMin = -32768;
ExcelUtils.ShortMax = 32767;
ExcelUtils.IntMin = -9007199254740991;
ExcelUtils.IntMax = 9007199254740991;
ExcelUtils.typeCodes = ["byte", "ubyte", "short", "ushort", "int", "uint", "float", "number", "string"];
ExcelUtils.arrTypeCodes = ["[byte]", "[ubyte]", "[short]", "[ushort]", "[int]", "[uint]", "[float]", "[number]", "[string]"];
