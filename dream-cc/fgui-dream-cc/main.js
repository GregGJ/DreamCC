"use strict";
//FYI: https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDestroy = exports.onPublish = void 0;
const csharp_1 = require("csharp");
const GenCode_TS_1 = require("./GenCode_TS");
function onPublish(handler) {
    if (!handler.genCode)
        return;
    handler.genCode = false; //prevent default output
    console.log('Handling gen code in plugin');
    (0, GenCode_TS_1.genCode)(handler); //do it myself
    //分模块
    handler.exportPath = handler.exportPath + "\\" + handler.pkg.name + "\\ui";
    if (!csharp_1.System.IO.File.Exists(handler.exportPath)) {
        csharp_1.System.IO.Directory.CreateDirectory(handler.exportPath);
    }
}
exports.onPublish = onPublish;
function onDestroy() {
    //do cleanup here
}
exports.onDestroy = onDestroy;
