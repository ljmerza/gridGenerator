'use strict'

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    cssnano = require('gulp-cssnano'),
    ejs = require("gulp-ejs"),
    fs = require('fs')

// Sass tasks
gulp.task('sass', () => {
    return gulp.src([
        "./public/sass/*.s*ss"
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    //.pipe(autoprefixer('last 2 versions'))
    //.pipe(cssnano())
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.reload({stream:true}))
})

// HTML tasks
gulp.task('html', () => {
    return gulp.src('./public/*.html')
    .pipe(browserSync.reload({stream:true}))                           
})

// Node-sync task
gulp.task('nodemon', () => {
    nodemon({
        script: 'server.js',
        ignore: ['./gulpfile.js','./node_modules','./db', './public']
    })
    .on('restart', () => {
        setTimeout(() =>  {
            browserSync.reload({ stream: false })
        }, 1000)
    })
})

// Browser-sync task
gulp.task('browser-sync', ['nodemon'], () => {
    browserSync({
        proxy: "localhost:3000",
        port: 5000,
        notify: true
    })
})

// Watch tasks
gulp.task('watch', () => {
    gulp.watch('./public/*.html', ['html'])
    //gulp.watch('./public/js/**/*.js', ['javascript'])
    gulp.watch('./public/sass/*.s*ss', ['sass'])
})

// Default task
gulp.task('default', ['browser-sync', 'watch', 'sass'])