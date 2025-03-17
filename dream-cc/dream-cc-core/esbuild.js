
import esbuild from 'esbuild';
// 添加 path 模块的导入
import path from 'path'; 

// 获取当前工程文件夹名称
const projectFolderName = path.basename(path.resolve('.'));

esbuild.build(
    {
        entryPoints: ['./src/index.ts'],
        outfile: `./dist/${projectFolderName}.mjs`,
        bundle: true,
        sourcemap: true,
        // 细化最小化配置
        minifyWhitespace: true, // 移除多余空格
        minifyIdentifiers: true, // 压缩标识符
        minifySyntax: true, // 压缩语法
        format: "esm",
        external: ["cc", "cc/env"],
        target: ["es6"],
    }
);