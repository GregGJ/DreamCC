"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = void 0;
class StringUtils {
    static isEmpty(value) {
        if (value == null || value == undefined || value.length == 0) {
            return true;
        }
        return false;
    }
}
exports.StringUtils = StringUtils;
