'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    ts = require('gulp-typescript'),
    gzip = require('gulp-gzip'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean');

gulp.task('clean', () => {
    return gulp.src('./client/production', {read: false})
        .pipe(clean());
});

gulp.task('sass', () => {
  return gulp.src('./client/dev/*.scss')
    .pipe(sass().on('error', sass.logError))
//    .pipe(uglify())
    .pipe(gulp.dest('./client/production'));
});
 
gulp.task('sass:watch', () => {
    gulp.watch('./client/dev/*.scss', ['sass']);
});

gulp.task('ts', () => {
    return gulp.src('./client/dev/*.ts')
        .pipe(ts({ experimentalDecorators: true }))
        .pipe(uglify())
//        .pipe(gzip())
        .pipe(gulp.dest('./client/production'));
});

gulp.task('ts:watch', () => {
    gulp.watch('./client/dev/*.ts', ['ts']);
});

gulp.task('default', ['sass', 'ts']);
gulp.task('watch', ['sass:watch', 'ts:watch']);