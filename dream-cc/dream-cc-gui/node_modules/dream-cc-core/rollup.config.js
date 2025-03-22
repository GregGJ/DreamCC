
import commonjs from '@rollup/plugin-commonjs';
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import typescript from 'rollup-plugin-typescript2';

import path from 'path';

// 获取工程文件夹名称
const projectFolderName = path.basename(path.resolve('.'));

export default [
    // {
    //     input: './src/index.ts',
    //     external: ["cc","cc/env","index"],
    //     plugins: [
    //         resolve({
    //             extensions: ['.ts', '.tsx']
    //         }),
    //         commonjs(),
    //         typescript()
    //     ],
    //     output: {
    //         file: "./dist/index.mjs",
    //         format: 'esm',
    //         name:"index",
    //     }
    // },
    {
        input:"./src/index.ts",
        plugins: [dts()],
        output:{
            format:"esm",
            file:`./dist/${projectFolderName}.d.ts`
        }
    }
];