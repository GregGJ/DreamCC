"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const fs_1 = require("fs");
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const path_1 = require("path");
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    //excel导出
    openExcel() {
        Editor.Panel.open(package_json_1.default.name + ".excel");
    },
    openGUI() {
        Editor.Panel.open(package_json_1.default.name + ".gui");
    },
    initProject() {
        console.log("开始初始化项目");
        const assetPath = Editor.Project.path + "/assets/";
        //需要创建的文件夹
        let needCreateDirs = [
            assetPath + "res",
            assetPath + "res/configs",
            assetPath + "res/ui",
            assetPath + "src",
            assetPath + "src/games",
            assetPath + "src/games/consts"
        ];
        let createDirs = (dirs, cb) => {
            let createdIndex = 0;
            for (let index = 0; index < dirs.length; index++) {
                const dir_path = dirs[index];
                if (!(0, fs_1.existsSync)(dir_path)) {
                    (0, fs_1.mkdirSync)(dir_path);
                    (0, fs_1.mkdir)(dir_path, (err) => {
                        createdIndex++;
                        if (createdIndex >= dirs.length) {
                            cb && cb();
                        }
                    });
                }
                createdIndex++;
                if (createdIndex >= dirs.length) {
                    cb && cb();
                }
            }
        };
        //创建需要的文件夹
        createDirs(needCreateDirs, () => {
            //检测guiconfig.json文件是否存在,不存在则创建
            const guiconfigPath = Editor.Project.path + "/assets/res/configs/guiconfig.json";
            if (!(0, fs_1.existsSync)(guiconfigPath)) {
                const data = JSON.stringify([]);
                (0, fs_1.writeFileSync)(guiconfigPath, data, { encoding: "utf-8" });
            }
            //检测GUIKeys.ts文件是否存在,不存在则创建
            const guiEnumFile = Editor.Project.path + "/assets/src/games/consts/GUIKeys.ts";
            if (!(0, fs_1.existsSync)(guiEnumFile)) {
                let guiEnumFileClass = `export enum GUIKeys{
}`;
                (0, fs_1.writeFileSync)(guiEnumFile, guiEnumFileClass, { encoding: "utf-8" });
            }
            //检测LayerKeys.ts文件是否存在,不存在则创建
            const layerEnumFile = Editor.Project.path + "/assets/src/games/consts/LayerKeys.ts";
            if (!(0, fs_1.existsSync)(layerEnumFile)) {
                let layerEnumFileClass = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../static/template/LayerKeys.txt'), 'utf-8');
                (0, fs_1.writeFileSync)(layerEnumFile, layerEnumFileClass, { encoding: "utf-8" });
            }
            //reources文件夹
            const resourcesPath = Editor.Project.path + "/assets/resources/";
            if (!(0, fs_1.existsSync)(resourcesPath)) {
                (0, fs_1.mkdir)(resourcesPath, (err) => {
                    if (err) {
                        console.error("创建文件夹失败：" + resourcesPath);
                    }
                });
            }
            // //检测Main文件是否存在,不存在则创建
            // const main_file = Editor.Project.path + "/assets/loadingViews/Main.ts";
            // if (!existsSync(layerEnumFile)) {
            //     const main_class = readFileSync(join(__dirname, '../static/template/Main.txt'), 'utf-8');
            //     writeFileSync(main_file, main_class, { encoding: "utf-8" });
            // }
            // //检测Main文件是否存在,不存在则创建
            // const entence_file = Editor.Project.path + "/assets/src/games/Entrance.ts";
            // if (!existsSync(layerEnumFile)) {
            //     const entence_class = readFileSync(join(__dirname, '../static/template/Entrance.txt'), 'utf-8');
            //     writeFileSync(entence_file, entence_class, { encoding: "utf-8" });
            // }
            // //检测LoadingViewImpl文件是否存在,不存在则创建
            // const loadingView_file = Editor.Project.path + "/assets/src/games/LoadingViewImpl.ts";
            // if (!existsSync(layerEnumFile)) {
            //     const loadingView_Class = readFileSync(join(__dirname, '../static/template/LoadingViewImpl.txt'), 'utf-8');
            //     writeFileSync(loadingView_file, loadingView_Class, { encoding: "utf-8" });
            // }
        });
        Editor.Message.broadcast("refresh-asset", "db://assets/");
        console.log("初始化项目完毕");
    },
    clearSetting() {
        Editor.Profile.removeConfig(package_json_1.default.name + ".gui", "data", "local");
        Editor.Profile.removeConfig(package_json_1.default.name + ".excel", "data", "local");
        console.log("清除编辑器设置");
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
function load() { }
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() { }
exports.unload = unload;
