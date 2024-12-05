const gulp = require('gulp');
const { exec } = require('child_process');
const clean = require('gulp-clean');
const eslint = require('gulp-eslint');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Clean dist directory
gulp.task('clean', () => {
    return gulp.src('dist', { read: false, allowEmpty: true })
        .pipe(clean());
});

// Lint TypeScript files
gulp.task('lint', () => {
    return gulp.src('src/**/*.ts')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Run Rollup build
gulp.task('build:rollup', async () => {
    try {
        await execAsync('rollup -c');
        console.log('Rollup build completed successfully');
    } catch (error) {
        console.error('Rollup build failed:', error.message);
        throw error;
    }
});

// Production build with Rollup
gulp.task('build:rollup:prod', async () => {
    try {
        await execAsync('NODE_ENV=production rollup -c');
        console.log('Production build completed successfully');
    } catch (error) {
        console.error('Production build failed:', error.message);
        throw error;
    }
});

// Watch for changes
gulp.task('watch', () => {
    gulp.watch('src/**/*.ts', gulp.series('lint', 'build:rollup'));
});

// Default development build task
gulp.task('build', gulp.series('clean', 'lint', 'build:rollup'));

// Production build task
gulp.task('build:prod', gulp.series('clean', 'lint', 'build:rollup:prod'));

// Default task
gulp.task('default', gulp.series('build', 'watch'));