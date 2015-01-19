module.exports = {

  // ===== ftp setting ====== //
  ftp: {
    host: "1.2.3.4",
    user: "user",
    pass: "pass",
    remotePath: "/path/to/dir"
  },
  // ===== ftp path ====== //

  // ===== Sources path ====== //
  sources: {
    // dist
    html: "./dist/*.html",
    js: "./dist/js/",
    css: "./dist/styles/",
    imgDist: "./dist/img/",
    styl: "./assets/styles/styl/main.styl",
    stylChild: "./assets/styles/styl/**.styl",
    jsAssets: "./assets/js/**/**.js",
    jade: "./assets/jade/**.jade",
    jadeChild: "./assets/jade/**/**.jade",
    img: "./assets/img/**/*",
    sprites: "./assets/img/parts/*.png",
    spritesCss: "./assets/styles/styl/"
  }
  // ===== Sources path ====== //
};
