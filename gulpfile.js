"use strict";

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    rename = require('gulp-rename');

gulp.task("concatScripts", function() {
    return gulp.src([
        'app/app.js',
        'app/app.config.js',
        'app/app.routes.js',
        'app/admin/controller/*.controller.js',
        'app/admin/services/*.service.js',
        'app/auth/controller/*.controller.js',
        'app/auth/services/*.service.js',
        'app/categories/controller/*.controller.js',
        'app/common/*.services.js',
        'app/components/directives/*.directive.js',
        'app/components/*.js',
        'app/data/*.js',
        'app/home/controller/*.controller.js',
        'app/progress/controller/*.controller.js',
        'app/settings/controller/*.controller.js',
        'app/users/controller/*.controller.js',
        'app/users/services/*.service.js',
        'app/workouts/controller/*.*.controller.js',
        'app/workouts/controller/*.controller.js',
        'app/workouts/services/*.service.js'
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app'));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
    return gulp.src("app/app.js")
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('app/js'));
});


gulp.task('clean',['minifyScripts'], function() {
    del(['app']);
});

gulp.task("build", ['clean'], function() {
    return gulp.src([ "app/*.js"], { base: './'})
        .pipe(gulp.dest('app'));
});