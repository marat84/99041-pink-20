const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const pug = require("gulp-pug");
const del = require("del");
const csso = require("gulp-csso");
const imageMin = require("gulp-imagemin");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const webp = require("gulp-webp");
const sync = require("browser-sync").create();

// Delete Build

const buildDelete = () => {
  return del("build/")
};

exports.buildDelete = buildDelete;

// Copy Fonts

const copyFont = () => {
  return gulp.src("source/fonts/*.{woff, woff2}")
    .pipe(gulp.dest("build/fonts"))
};

exports.copyFont = copyFont;

// Image Minification

const imgmin = () => {
  return gulp.src("source/img/**/*.*")
    .pipe(imageMin([
      imageMin.gifsicle({interlaced: true}),
      imageMin.mozjpeg({progressive: true}),
      imageMin.optipng({optimizationLevel: 3}),
      imageMin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
    .pipe(sync.stream());
};

exports.imgmin = imgmin;

// WEBP

const webpImg = () => {
  return gulp.src("source/img/**/*.*")
    .pipe(webp())
    .pipe(gulp.dest("build/img"))
    .pipe(sync.stream());
};

exports.webpImg = webpImg;

// SVG sprites

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
    .pipe(sync.stream());
};

exports.sprite = sprite;

// PUG

const htmlPUG = () => {
  return gulp.src("source/pug/pages/*.pug")
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest("build/"))
    .pipe(sync.stream());
};

exports.htmlPUG = htmlPUG;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build/'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("pug/**/*.pug", gulp.series("htmlPUG"));
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/pug/**/*.pug", gulp.series("htmlPUG"));
};

const build = gulp.series(
  buildDelete,
  copyFont,
  imgmin,
  webpImg,
  sprite,
  htmlPUG,
  styles,
);

exports.build = build;

exports.start = gulp.series(
  build,
  server,
  watcher,
);
