module.exports ={
  // 项目根目录
  "root": "/src",
  // 项目入口文件
  "entry": "voice",
  "headFolder": "head",
  // 输出目录
  "outFolder": "dist",
  // 是否监测文件改动重新打包
  "autoPack": true,
  // 是否压缩css
  "minifyCss": false,
  // 是否压缩js
  "minifyJs": false,
  // 页面目录
  "pageFolder": "page",
  // 强制打包所有样式
  "choiceAnimation": false,
  // 引用连接
  "scriptList": [{
    "name": "gif",
    "src": "./src/script/gif.js",
    "babel": true
  },{
    "name": "Animate",
    "src": "./src/script/Animate.js",
    "babel": false
  },{
    "name": "color",
    "src": "./src/script/color.js",
    "babel": false
  },{
    "name": "pixi-transform-tool",
    "src": "./src/script/pixi-transform-tool.js",
    "babel": false
  },{
    "name": "pixi.min",
    "src": "./src/script/pixi.min.js",
    "babel": false
  },{
    "name": "Scroller",
    "src": "./src/script/Scroller.js",
    "babel": false
  }] 
}