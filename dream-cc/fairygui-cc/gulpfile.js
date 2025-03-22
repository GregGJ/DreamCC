const gulp = require('gulp')
const rollup = require('rollup')
const ts = require('gulp-typescript');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const dts = require('dts-bundle')
const tsProject = ts.createProject('tsconfig.json', { declaration: true });

const onwarn = warning => {
    // Silence circular dependency warning for moment package
    if (warning.code === 'CIRCULAR_DEPENDENCY')
        return

    console.warn(`(!) ${warning.message}`)
}

gulp.task('buildJs', () => {
    return tsProject.src().pipe(tsProject()).pipe(gulp.dest('./build'));
})

gulp.task("rollup", async function () {
    const subTask = await rollup.rollup({
        input: "build/fairygui-cc.js",
        external: ['cc', 'cc/env', "dream-cc-core"]
    });
    await subTask.write({
        file: 'dist/fairygui-cc.mjs',
        sourcemap: true,
        format: 'esm',
        extend: true,
        name: 'fgui',
    });
});

gulp.task("uglify", function () {
    return gulp.src("dist/fairygui-cc.mjs")
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify(/* options */))
        .pipe(gulp.dest("dist/"));
});

gulp.task('buildDts', function () {
    return new Promise(function (resolve, reject) {
        dts.bundle({ name: "fairygui-cc", main: "./build/fairygui-cc.d.ts", out: "../dist/fairygui-cc.d.ts" });
        resolve();
    });
})

gulp.task('build', gulp.series(
    'buildJs',
    'rollup',
    // 'uglify',
    'buildDts'
))