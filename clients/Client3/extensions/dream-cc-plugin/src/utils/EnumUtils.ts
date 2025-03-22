import { readFileSync } from "fs";
import { reactive, ref, Ref } from "vue";

export class EnumData {
    /**名称 */
    enumName:string="";
    commentsList = reactive(new Array<string>());
    enums = reactive(new Array<string>());
}

export class EnumUtils {

    static getEnumFile(path: string,result:EnumData): void {
        let fileStr = readFileSync(path, { encoding: "utf-8" });
        //枚举类名
        let enumNameReg = /(?<=export enum ).*?(?={)/g;
        result.enumName = fileStr.match(enumNameReg)[0];
        // console.log("枚举名称："+result.enumName);
        //枚举名
        let enumReg = /{[^}]+}/g;
        let matchs = fileStr.match(enumReg);
        //去除大括号
        let enumStr = matchs[0].substring(1, matchs[0].length - 1).trim();
        enumStr=enumStr.replace(/\s+/g, "");
        // console.log(enumStr);
        //枚举属性分割
        if (enumStr.length != 0) {
            let lines = enumStr.split(",");
            for (let index = 0; index < lines.length; index++) {
                const line = lines[index];
                const info = this.getComments(line);
                if(info.key==undefined){
                    continue;
                }
                result.commentsList.push(info.comments);
                result.enums.push(info.key);
            }
        }
    }

    static getComments(str: string): { comments: string, key: string } {
        let comments: string;
        let key: string;
        //去除多余的空格
        str = str.trim();
        //块注释
        if (str.startsWith("/**")) {
            let enumNameReg = /(?<=\/\*\*).*?(?=\*\/)/g;
            let matchs = str.match(enumNameReg);
            //单行形式
            if (matchs && matchs.length == 1) {
                comments = matchs[0].trim();
            } else {
                //多行形式
                let index = str.indexOf("*/");
                let data = str.substring(3, index - 2)
                data = data.replace(/\s+/g, "");
                comments = data.replace(/\*/g, "");
            }
            let endCommant = str.indexOf("*/");
            let data = str.substring(endCommant + 2);
            key = this.getEnumKey(data);
        } else if (str.startsWith("//")) {
            let isR: boolean = str.indexOf("\r") >= 0;
            let isN: boolean = str.indexOf("\n") >= 0;
            let lines: Array<string>;
            if (isR && isN) {
                lines = str.split("\r\n");
            } else if (isR) {
                lines = str.split("\r");
            } else if (isN) {
                lines = str.split("\n");
            } else {
                throw new Error("发现//注释之后没有枚举值:"+str);
            }
            comments = "";
            for (let index = 0; index < lines.length - 1; index++) {
                const element = lines[index];
                comments += element;
            }
            comments = comments.replace(/\/\//g, "");
            comments = comments.replace(/\s+/g, "");
            key = this.getEnumKey(lines.pop());
        }
        return { comments: comments, key };
    }

    static getEnumKey(str: string): string {
        str = str.trim();
        if (str.includes("=")) {
            let temp = str.split("=");
            return temp[0].trim();
        }
        return str;
    }
}