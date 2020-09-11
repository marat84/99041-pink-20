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
const minJs = require("gulp-terser");
const sync = require("browser-sync").create();

// Delete Build

const buildDelete = () => {
  return del("build/")
};

exports.buildDelete = buildDelete;

// Copy Fonts

const copyFont = () => {
  return gulp.src("source/fonts/*.*")
    .pipe(gulp.dest("build/fonts"))
};

exports.copyFont = copyFont;

// Image Minification

const imgmin = () => {
  return gulp.src("source/img/*.*")
    .pipe(imageMin([
      imageMin.svgo(),
      imageMin.gifsicle({interlaced: true}),
      imageMin.mozjpeg({progressive: true}),
      imageMin.optipng({optimizationLevel: 3}),
    ]))
    .pipe(gulp.dest("build/img"))
    .pipe(sync.stream());
};

exports.imgmin = imgmin;

// WEBP

const webpImg = () => {
  return gulp.src("source/img/*.*")
    .pipe(webp())
    .pipe(gulp.dest("build/img"))
    .pipe(sync.stream());
};

exports.webpImg = webpImg;

// SVG sprites

const sprite = () => {
  return gulp.src("source/img/icon-*.svg")
    .pipe(imageMin([
      imageMin.svgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
    ]))
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
    .pipe(sync.stream());
};

exports.sprite = sprite;

// PUG

const htmlPUG = () => {
  return gulp.src("source/pug/pages/*.pug")
    .pipe(pug())
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
      autoprefixer(['last 2 versions'])
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Javascript

const js = () => {
  return gulp.src("source/js/*.js")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(minJs())
    .pipe(rename("main.min.js"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
};

exports.js = js;

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
  gulp.watch("source/pug/**/*.pug", gulp.series("htmlPUG"));
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/**/*.js", gulp.series("js"));
};

const build = gulp.series(
  buildDelete,
  copyFont,
  imgmin,
  webpImg,
  sprite,
  htmlPUG,
  styles,
  js,
);

exports.build = build;

exports.start = gulp.series(
  build,
  server,
  watcher,
);
