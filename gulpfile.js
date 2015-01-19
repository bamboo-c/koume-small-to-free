"use strict";

var gulp = require("gulp"),

// variables
$ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "gulp.*"],
    replaceString: /\bgulp[\-.]/
}),

browserSync  = require("browser-sync"),
reload       = browserSync.reload,
pagespeed    = require("psi"),

config       = require("./config.js"),
sources      = config.sources,
ftpConf       = config.ftp;

// ===== Jade compile ====== //
gulp.task("jade", function () {
  return gulp.src(sources.jade)
    .pipe(plumber())
    .pipe($.jade({
      pretty: false
    }))
    .pipe(gulp.dest("dist"));
});
// ===== jade compile ====== //

// ===== stylus compile ====== //
gulp.task("styles:styl", function () {
  gulp.src(sources.styl)
    .pipe($.plumber())
    .pipe($.stylus())
    .pipe($.wait(100))
    .pipe(gulp.dest(sources.css));
});
// ===== stylus compile ====== //

// ===== css optimaize ====== //
gulp.task("styles:css", function () {
  gulp
    .src(sources.css + "*.css")
    .pipe($.plumber())
    .pipe($.autoprefixer({
      browsers : ["last 2 versions", "ie 8", "ie 9"]
    }))
    .pipe(gulp.dest(sources.css))
    .pipe(reload({stream: true}))
    .pipe($.size({title: "styles:css"}));
});
// ===== css optimaize ====== //

// ===== output final css style ====== //
gulp.task("styles", ["styles:styl", "styles:css"]);
// ===== output final css style ====== //

// ===== css sprite ====== //
gulp.task("sprite", function () {
  var spriteData = gulp.src(sources.sprites).pipe($.spritesmith({
    imgName: "parts.png",
    cssName: "_parts.styl",
    imgPath: "../img/parts.png",
    padding: 10,
    cssFormat : "stylus"
  }));
  spriteData.img.pipe(gulp.dest(sources.imgDist));
  spriteData.css.pipe(gulp.dest(sources.spritesCss));
});
// ===== css sprite ====== //

// ===== JavaScript Optimaize ====== //
gulp.task("scripts", function () {
  return gulp.src(["assets/js/vender/jquery.min.js", "assets/js/Main.js", "assets/js/lib/*.js"])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
      .pipe($.concat("Main.js"))
    .pipe($.sourcemaps.write())
    .pipe($.uglify())
    .pipe(gulp.dest(sources.js));
});
// ===== JavaScript Optimaize ====== //

// ===== JShint ====== //
gulp.task("jshint", function () {
  return gulp.src(sources.js + ".js")
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter("jshint-stylish"))
    .pipe($.jshint.reporter("fail"))
    .pipe(reload({stream: true, once: true}));
});
// ===== JShint ====== //

// ===== CSShint ====== //
gulp.task("csslint", function () {
  return gulp.src($.sources.css + "*.css")
    .pipe($.plumber())
    .pipe($.csslint())
    .pipe($.csslint.reporter());
});
// ===== CSShint ====== //

// ===== image optimize ====== //
gulp.task("images", function () {
  return gulp.src(sources.img)
    .pipe($.plumber())
    .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    })))
    .pipe(gulp.dest("dist/img"));
});
// ===== image optimize ====== //

// ===== cache clear ====== //
gulp.task("clear", function ( i_done ) {
  return $.cache.clearAll( i_done );
});
// ===== cache clear ====== //

// ===== gzip ====== //
gulp.task("gzip", function() {
  gulp.src(sources.js + "*.js")
    .pipe($.gzip())
    .pipe(gulp.dest(sources.js));
  gulp.src(sources.css + "*.css")
    .pipe($.gzip())
    .pipe(gulp.dest(sources.css));
});
// ===== gzip ====== //

// ===== ftp ====== //
gulp.task("ftp", function() {
  return gulp.src("dist/**")
    .pipe($.ftp(ftpSet))
    .pipe($.util.noop());
});
// ===== ftp ====== //

// ===== files watch and make a local server ====== //
gulp.task("default", function () {
  browserSync.init(null, {
    server: {
        baseDir: ["dist"]
    },
    notify: false
  });

  gulp.watch([sources.sprites], ["sprite"]);
  gulp.watch([sources.stylChild], ["styles"]);
  gulp.watch([sources.jadeChild], ["jade"]);
  gulp.watch([sources.jade], ["jade"]);
  gulp.watch([sources.css + "*.css"], reload);
  gulp.watch([sources.html], reload);
  gulp.watch([sources.js + "*.js"], ["jshint"]);
  gulp.watch([sources.jsAssets], ["scripts"]);
  gulp.watch([sources.img], ["images"]);
});
// ===== files watch and make a local server ====== //

// ===== build ====== //
gulp.task("build", function ( i_cb ) {
 runSequence("styles", ["jshint", "csslint", "jade", "images"], i_cb);
});
// ===== build ====== //

// ===== deploy ====== //
gulp.task("deploy", function() {
  return gulp.src("dist/**")
    .pipe($.ftp(ftpConf));
});
// ===== deploy ====== //

// ===== google pageSpeed ====== //
gulp.task("pagespeed", pagespeed.bind(null, {
   url: "https://example.com",
   strategy: "mobile"
}));
// ===== google pageSpeed ====== //
