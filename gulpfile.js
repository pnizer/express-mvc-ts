var gulp = require('gulp');
var typescript  = require("gulp-typescript");
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
 
var tsProject = typescript.createProject("tsconfig.json");

gulp.task('clean', function(cb){
    return del('dist', cb)    
});
 
gulp.task('build', function() {
    var tsResult = gulp
        .src(["typings/index.d.ts","src/**/*.ts"])
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));
    return tsResult.js
        .pipe(sourcemaps.write('.', {
           sourceRoot: function(file){ return file.cwd + '/src'; }
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task('watch', ['build'], function () {
    var stream = nodemon({ 
        script: 'dist/server',
        watch: 'src',
        ext: 'ts',
        tasks: ['build']
    });

    return stream;
});
 
gulp.task('default', ['build']);
