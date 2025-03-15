
import esbuild from 'esbuild';

esbuild.build(
    {
        entryPoints: ['./src/dream-cc-core.ts'],
        outdir: './dist',
        bundle: true,
        sourcemap: true,
        // 细化最小化配置
        minifyWhitespace: true, // 移除多余空格
        minifyIdentifiers: true, // 压缩标识符
        minifySyntax: true, // 压缩语法
        format: "esm",
        outExtension:{
            ".js":".mjs"
        },
        external: ["cc", "cc/env"],
        target: ["es6"],
    }
);