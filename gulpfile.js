const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const npmRun = require('npm-run')
const path = require('path')

gulp.task('server', () =>
  nodemon({
    script: 'server',
    watch: 'server'
  }))

gulp.task('client', () => npmRun('start', {
  cwd: path.join(__dirname, 'client')
}))

gulp.task('default', ['server', 'client'])