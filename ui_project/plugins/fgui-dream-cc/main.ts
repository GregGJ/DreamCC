//FYI: https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md

import { FairyEditor, System } from 'csharp';
import { genCode } from './GenCode_TS';
function onPublish(handler: FairyEditor.PublishHandler) {
    if (!handler.genCode) return;

    handler.genCode = false; //prevent default output

    console.log('Handling gen code in plugin');
    genCode(handler); //do it myself
    //分模块
    handler.exportPath = handler.exportPath + "\\" + handler.pkg.name+"\\ui";
    if (!System.IO.File.Exists(handler.exportPath)) {
        System.IO.Directory.CreateDirectory(handler.exportPath);
    }
}

function onDestroy() {
    //do cleanup here
}

export { onPublish, onDestroy };