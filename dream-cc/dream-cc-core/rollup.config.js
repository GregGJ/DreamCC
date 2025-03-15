
import commonjs from '@rollup/plugin-commonjs';
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import typescript from 'rollup-plugin-typescript2';
export default [
    // {
    //     input: './src/dream-cc-core.ts',
    //     external: ["cc","cc/env","dream-cc-core"],
    //     plugins: [
    //         resolve({
    //             extensions: ['.ts', '.tsx']
    //         }),
    //         commonjs(),
    //         typescript()
    //     ],
    //     output: {
    //         file: "./dist/dream-cc-core.mjs",
    //         format: 'esm',
    //         name:"dream-cc-core",
    //     }
    // },
    {
        input:"./src/dream-cc-core.ts",
        plugins: [dts()],
        output:{
            format:"esm",
            file:"./dist/dream-cc-core.d.ts"
        }
    }
];