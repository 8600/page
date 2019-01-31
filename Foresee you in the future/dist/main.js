// 对象合并方法
function assign(a, b) {
  var newObj = {}
  for (var key in a) {
    newObj[key] = a[key]
  }
  for (var key in b) {
    newObj[key] = b[key]
  }
  return newObj
}

// 运行页面所属的方法
function runPageFunction(pageName, entryDom) {
  // ozzx-name处理
  window.ozzx.domList = {}
  pgNameHandler(entryDom)

  // 判断页面是否有自己的方法
  var newPageFunction = window.ozzx.script[pageName]
  if (!newPageFunction) return
  // console.log(newPageFunction)
  // 如果有created方法则执行
  if (newPageFunction.created) {
    // 注入运行环境
    newPageFunction.created.apply(assign(newPageFunction, {
      $el: entryDom,
      data: newPageFunction.data,
      methods: newPageFunction.methods,
      activePage: window.ozzx.activePage,
      domList: window.ozzx.domList
    }))
  }

  // 判断页面是否有下属模板,如果有运行所有模板的初始化方法
  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key]
    if (templateScript.created) {
      // 获取到当前配置页的DOM
      // 待修复,临时获取方式,这种方式获取到的dom不准确
      var domList = entryDom.getElementsByClassName('ox-' + key)
      if (domList.length !== 1) {
        console.error('我就说会有问题吧!')
        console.log(domList)
      }
      // 为模板注入运行环境
      templateScript.created.apply(assign(newPageFunction.template[key], {
        $el: domList[0].children[0],
        data: templateScript.data,
        methods: templateScript.methods,
        activePage: window.ozzx.activePage,
        domList: window.ozzx.domList
      }))
    }
  }
}

// ozzx-name处理
function pgNameHandler(dom) {
  // 遍历每一个DOM节点
  for (var i = 0; i < dom.children.length; i++) {
    var tempDom = dom.children[i]

    // 判断是否存在@name属性
    var pgName = tempDom.attributes['@name']
    if (pgName) {
      // console.log(pgName.textContent)
      window.ozzx.domList[pgName.textContent] = tempDom
    }
    // 判断是否有点击事件
    var clickFunc = tempDom.attributes['@click']

    if (clickFunc) {
      tempDom.onclick = function() {
        var clickFor = this.attributes['@click'].textContent
        // 判断页面是否有自己的方法
        var newPageFunction = window.ozzx.script[window.ozzx.activePage]

        // console.log(this.attributes)
        // 判断是否为模板
        var templateName = this.attributes['template']
        // console.log(templateName)
        if (templateName) {
          newPageFunction = newPageFunction.template[templateName.textContent]
        }
        // console.log(newPageFunction)
        // 取出参数
        var parameterArr = []
        var parameterList = clickFor.match(/[^\(\)]+(?=\))/g)
        if (parameterList && parameterList.length > 0) {
          // 参数列表
          parameterArr = parameterList[0].split(',')
          // 进一步处理参数
          for (var i = 0; i < parameterArr.length; i++) {
            var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, "")
            // console.log(parameterValue)
            // 判断参数是否为一个字符串
            if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 2)
            }
            if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 2)
            }
            // console.log(parameterArr[i])
          }
          clickFor = clickFor.replace('(' + parameterList + ')', '')
        }
        // console.log(newPageFunction)
        // 如果有方法,则运行它
        if (newPageFunction.methods[clickFor]) {
          // 绑定window.ozzx对象
          // console.log(tempDom)
          newPageFunction.methods[clickFor].apply({
            $el: this,
            activePage: window.ozzx.activePage,
            domList: window.ozzx.domList,
            data: newPageFunction.data,
            methods: newPageFunction.methods
          }, parameterArr)
        }
      }
    }
    // 递归处理所有子Dom结点
    if (tempDom.children.length > 0) {
      pgNameHandler(tempDom)
    }
  }
} // 页面资源加载完毕事件
window.onload = function() {
  var page = globalConfig.entry
  window.ozzx.activePage = page
  var entryDom = document.getElementById('ox-' + page)
  if (entryDom) {
    runPageFunction(page, entryDom)
  } else {
    console.error('找不到页面入口!')
  }
}
window.ozzx = {
  script: {}
};
var globalConfig = {
  "root": "/src",
  "entry": "voice",
  "headFolder": "head",
  "outFolder": "dist",
  "autoPack": true,
  "minifyCss": false,
  "minifyJs": false,
  "pageFolder": "page",
  "choiceAnimation": false,
  "isOnePage": true
};
window.ozzx.script = {
  "voice": {
    "data": {
      "app": null,
      "loader": null,
      "container": null,
      "titleStart": null,
      "scroller": null,
      "twoContainer": null,
      "progress": 3,
      "people": null,
      "peopleImgID": 1,
      "imgArr": ["./images/1-title.png", "./images/1.png", "./images/logo.png", "./images/3-colour.png", "./images/1-clock.png", "./images/1-point.png", "./images/1-hand.png", "./images/1-butterfly.png", "./images/people-1.png", "./images/people-2.png", "./images/people-3.png", "./images/people-4.png", "./images/people-5.png", "./images/people-6.png", "./images/people-7.png", "./images/people-8.png", "./images/people-9.png", "./images/people-10.png", "./images/people-11.png", "./images/2.png", "./images/3.png", "./images/3-light.png", "./images/4.png", "./images/5.png", "./images/6.png", "./images/7.png", "./images/8.png", "./images/9.png", "./images/10.png", "./images/11.png", "./images/share.png", "./images/5-colour.png", "./images/7-light.png", "./images/7-colour.png", "./images/9-colour.png", "./images/11-light.png", "./images/11-colour.png", "./images/3-cloud.png", "./images/4-cloud.png", "./images/5-cloud.png", "./images/6-cloud.png", "./images/7-cloud.png", "./images/8-cloud.png", "./images/9-cloud.png", "./images/10-cloud.png", "./images/11-petal-colour.png"],
      "animationList": {}
    },
    "created": function created() {
      var _this = this;
      document.body.addEventListener('touchmove', function(e) {
        return;
      });
      document.addEventListener('WeixinJSBridgeReady', function() {
        $('#bgm')[0].play();
      });
      var loadingTextDom = $('#loadingText')[0];
      var bodySize = this.calculationScene(this);
      this.data.loader = new PIXI.loaders.Loader();
      this.data.loader.add(this.data.imgArr).onProgress.add(function(e) {
        loadingTextDom.innerText = parseInt(e.progress) + '%';
        if (Math.ceil(e.progress) >= 100) {
          _this.data.animationList.oneButterfly = TweenMax.fromTo(oneButterfly, 0.8, {
            y: 0
          }, {
            y: -1,
            ease: Linear.easeNone
          }).repeat(-1);
          _this.data.animationList.oneButterfly.play();
          _this.data.app.stage.addChild(one);
          $('#loadingBox').remove();
          $('#clock')[0].style.display = 'block';
        }
      });
      this.data.container = new PIXI.Container();
      this.data.container.interactive = true;
      var one = new PIXI.Container();
      one.x = 0;
      one.y = 0;
      var bg1Image = this.methods.createSprite("./images/1.png", {
        width: bodySize.w,
        height: bodySize.h,
        x: 0,
        y: 0
      });
      var logoImageHeight = bodySize.h / 10;
      var logoImageWidth = logoImageHeight * 3.6451;
      var logoImage = this.methods.createSprite("./images/logo.png", {
        width: logoImageWidth,
        height: logoImageHeight,
        x: bodySize.w / 2 - logoImageWidth / 2,
        y: bodySize.h - logoImageHeight - 10
      });
      var oneTitleHeight = bodySize.h / 20;
      var oneTitleWidth = oneTitleHeight * 9.818;
      var oneTitle = this.methods.createSprite("./images/1-title.png", {
        width: oneTitleWidth,
        height: oneTitleHeight,
        x: bodySize.w / 2 - oneTitleWidth / 2,
        y: bodySize.h * 0.1
      });
      var clockHeight = bodySize.h / 1.2;
      var clockWidth = clockHeight * 1.7801;
      var pointHeight = bodySize.h / 4;
      var butterflyHeight = bodySize.h / 1;
      var butterflyWidth = bodySize.w;
      var oneButterfly = this.methods.createSprite("./images/1-butterfly.png", {
        width: butterflyWidth,
        height: butterflyHeight,
        x: 0,
        y: 0,
        z: -1
      });
      one.addChild(bg1Image, logoImage, oneTitle, oneButterfly);
      $("#clock").on("touchstart", function(e) {
        var touchInfo = _this.calculationTouch(e);
        console.log(touchInfo);
        if (touchInfo.xRatio > 0.41 && touchInfo.xRatio < 0.46 && touchInfo.yRatio > 0.41 && touchInfo.yRatio < 0.48) {
          console.log('范围内了');
          $("#clock").on("touchend", function(e) {
            $("#clock").off("touchmove");
          });
          $("#clock").on("touchmove", function(e) {
            var proportion = _this.calculationTouch(e);
            proportion = (proportion.xRatio - 0.438) / 0.06;
            if (proportion > 0.6) proportion = 0.6;
            if (proportion < 0) proportion = 0;
            $('#onePoint')[0].style.transform = "rotate(".concat(50 * proportion, "deg)");
            if (proportion >= 0.6) {
              $('#clockDial')[0].classList.add("flip-play");
              $("#clock").off("touchmove");
              _this.data.animationList.oneButterfly.kill();
              oneButterfly.destroy();
              setTimeout(function() {
                $('#clock')[0].classList.add('scale-play');
                setTimeout(function() {
                  logoImage.destroy();
                  bg1Image.destroy();
                  setTimeout(function() {
                    _this.data.app.stage.removeChild(one);
                  }, 0);
                  $("#clock").off("touchstart");
                  $('#clock')[0].style.display = 'none';
                  console.log('首页已销毁');
                  _this.two();
                }, 1000);
              }, 1000);
            }
          });
        }
      });
      this.data.loader.load(function(loader) {});
      var shareDom = document.getElementById("shareBox");
      shareDom.ontouchend = function() {
        console.log(shareDom);
        shareDom.style.display = 'none';
        return false;
      };
    },
    "methods": {
      "createSprite": function createSprite(name, opt) {
        var newSprite = new PIXI.Sprite.from(name);
        if (opt) {
          for (var key in opt) {
            newSprite[key] = opt[key];
          }
        }
        return newSprite;
      },
      "smooth": function smooth(baseValue, minValue, nowValue, step) {
        return baseValue + (nowValue - minValue) * step;
      }
    },
    "calculationScene": function calculationScene() {
      var ww = $(window).width();
      var wh = $(window).height();
      console.log("\\u53EF\\u89C6\\u5BBD\\u5EA6:".concat(ww, ", \\u53EF\\u89C6\\u9AD8\\u5EA6:").concat(wh));
      if (false) {
        if (window.orientation !== 90 && window.orientation !== -90) {
          window.document.body.classList.add('horizontal');
          window.document.body.style.width = "".concat(wh, "px");
          window.document.body.style.height = "".concat(ww, "px");
          window.document.body.style.left = "calc(50% - ".concat(wh / 2, "px)");
          window.document.body.style.top = "calc(50% - ".concat(ww / 2, "px)");
          this.data.app = new PIXI.Application($(window).height(), $(window).width(), {
            backgroundColor: '0xc8c9c9'
          });
          $('#main').append(this.data.app.view);
          this.data.app.stage.displayList = new PIXI.display.Stage();
          this.data.screenInfo = {
            w: wh,
            h: ww,
            transverse: false
          };
          return {
            w: wh,
            h: ww,
            transverse: false
          };
        }
      } else {
        if (ww < wh) {
          window.document.body.classList.add('horizontal');
          window.document.body.style.width = "".concat(wh, "px");
          window.document.body.style.height = "".concat(ww, "px");
          window.document.body.style.left = "calc(50% - ".concat(wh / 2, "px)");
          window.document.body.style.top = "calc(50% - ".concat(ww / 2, "px)");
          this.data.app = new PIXI.Application($(window).height(), $(window).width(), {
            backgroundColor: '0xc8c9c9'
          });
          $('#main').append(this.data.app.view);
          this.data.app.stage.displayList = new PIXI.display.Stage();
          this.data.screenInfo = {
            w: wh,
            h: ww,
            transverse: false
          };
          return {
            w: wh,
            h: ww,
            transverse: false
          };
        }
      }
      this.data.app = new PIXI.Application($(window).width(), $(window).height(), {
        backgroundColor: '0xc8c9c9'
      });
      $('#main').append(this.data.app.view);
      this.data.app.stage.displayList = new PIXI.display.Stage();
      this.data.transverse = true;
      this.data.screenInfo = {
        w: ww,
        h: wh,
        transverse: true
      };
      return {
        w: ww,
        h: wh,
        transverse: true
      };
    },
    "calculationTouch": function calculationTouch(e) {
      if (this.data.screenInfo.transverse) {
        return {
          x: e.originalEvent.targetTouches[0].pageX,
          y: e.originalEvent.targetTouches[0].pageY,
          xRatio: e.originalEvent.targetTouches[0].pageX / this.data.screenInfo.w,
          yRatio: e.originalEvent.targetTouches[0].pageY / this.data.screenInfo.h
        };
      } else {
        return {
          x: e.originalEvent.targetTouches[0].pageY,
          y: this.data.screenInfo.h - e.originalEvent.targetTouches[0].pageX,
          xRatio: e.originalEvent.targetTouches[0].pageY / this.data.screenInfo.w,
          yRatio: (this.data.screenInfo.h - e.originalEvent.targetTouches[0].pageX) / this.data.screenInfo.h
        };
      }
    },
    "two": function two() {
      var _this2 = this;
      var bodySize = this.data.screenInfo;
      console.log('第二部分!');
      this.data.twoContainer = new PIXI.Container();
      this.data.twoContainer.x = 0;
      this.data.twoContainer.y = 0;
      this.data.twoContainer.width = this.data.screenInfo.w;
      this.data.people = this.methods.createSprite("./images/people-1.png", {
        width: 50 * (this.data.screenInfo.w / 1024),
        height: 120 * (this.data.screenInfo.h / 768),
        x: 50,
        y: 0
      });
      var bg2Image = this.methods.createSprite("./images/2.png", {
        width: this.data.screenInfo.w + 1,
        height: this.data.screenInfo.h,
        x: -1,
        y: 0
      });
      var bg3Image = this.methods.createSprite("./images/3.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w,
        y: 1
      });
      var bg4Image = this.methods.createSprite("./images/4.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 2,
        y: -1
      });
      var bg5Image = this.methods.createSprite("./images/5.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 3,
        y: 0
      });
      var bg6Image = this.methods.createSprite("./images/6.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 4,
        y: 0
      });
      var bg7Image = this.methods.createSprite("./images/7.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 5,
        y: 1
      });
      var bg8Image = this.methods.createSprite("./images/8.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 6,
        y: -4
      });
      var bg9Image = this.methods.createSprite("./images/9.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 7,
        y: 0
      });
      var bg10Image = this.methods.createSprite("./images/10.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 8,
        y: 0
      });
      var bg11Image = this.methods.createSprite("./images/11.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 9,
        y: 0
      });
      var bgshare = this.methods.createSprite("./images/share.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 10,
        y: 0
      });
      var shareBTH = this.data.screenInfo.h * 0.08;
      var shareBT = this.methods.createSprite("./images/share-button.png", {
        width: shareBTH * 3.9275,
        height: shareBTH,
        x: this.data.screenInfo.w * 10 + this.data.screenInfo.w * 0.2,
        y: this.data.screenInfo.h * 0.7
      });
      shareBT.interactive = true;
      shareBT.buttonMode = true;
      shareBT.on('tap', function(e) {
        console.log(e);
        $('#shareBox')[0].style.display = 'block';
        e.stopped = true;
        return false;
      });
      var BTH2019 = this.data.screenInfo.h * 0.08;
      var BT2019 = this.methods.createSprite("./images/2019.png", {
        width: BTH2019 * 3.9275,
        height: BTH2019,
        x: this.data.screenInfo.w * 10 + this.data.screenInfo.w * 0.58,
        y: this.data.screenInfo.h * 0.7
      });
      BT2019.interactive = true;
      BT2019.buttonMode = true;
      BT2019.on('tap', function() {
        window.open('http://www.people.com.cn/32306/422743/index.html');
      });
      var cloud3H = bodySize.h * 0.25;
      var cloud3 = this.methods.createSprite("./images/3-cloud.png", {
        width: cloud3H * 6.397,
        height: cloud3H,
        x: bodySize.w + bodySize.w * 0.05,
        y: bodySize.h * 0.1
      });
      var cloud3AnimationList = new TweenMax(cloud3, 2, {
        x: bodySize.w + bodySize.w * 0.05 + 10,
        repeat: -1,
        yoyo: true
      });
      cloud3AnimationList.play();
      var cloud4H = bodySize.h * 0.8;
      var cloud4 = this.methods.createSprite("./images/4-cloud.png", {
        width: cloud4H * 2.1159,
        height: cloud4H,
        x: bodySize.w * 2,
        y: 0
      });
      var cloud4AnimationList = new TweenMax(cloud4, 2, {
        x: bodySize.w * 2 + 15,
        repeat: -1,
        yoyo: true
      });
      cloud4AnimationList.play();
      var cloud5H = bodySize.h * 0.3;
      var cloud5 = this.methods.createSprite("./images/5-cloud.png", {
        width: cloud5H * 4.7467,
        height: cloud5H,
        x: bodySize.w * 3 + bodySize.w * 0.05,
        y: bodySize.h * 0.1
      });
      var cloud5AnimationList = new TweenMax(cloud5, 2, {
        x: bodySize.w * 3 + bodySize.w * 0.05 + 10,
        repeat: -1,
        yoyo: true
      });
      cloud5AnimationList.play();
      var cloud6H = bodySize.h * 0.7;
      var cloud6 = this.methods.createSprite("./images/6-cloud.png", {
        width: cloud6H * 2.0727,
        height: cloud6H,
        x: bodySize.w * 4 + bodySize.w * 0.05,
        y: 0
      });
      var cloud6AnimationList = new TweenMax(cloud6, 2, {
        x: bodySize.w * 4 + 15,
        repeat: -1,
        yoyo: true
      });
      cloud6AnimationList.play();
      var cloud7H = bodySize.h * 0.3;
      var cloud7 = this.methods.createSprite("./images/7-cloud.png", {
        width: cloud7H * 5.0339,
        height: cloud7H,
        x: bodySize.w * 5 + bodySize.w * 0.05,
        y: 0
      });
      var cloud7AnimationList = new TweenMax(cloud7, 2, {
        x: bodySize.w * 5 + bodySize.w * 0.05 + 10,
        repeat: -1,
        yoyo: true
      });
      cloud7AnimationList.play();
      var cloud8H = bodySize.h * 0.6;
      var cloud8 = this.methods.createSprite("./images/8-cloud.png", {
        width: cloud8H * 2.5685,
        height: cloud8H,
        x: bodySize.w * 6 + bodySize.w * 0.05,
        y: bodySize.h * 0.05
      });
      var cloud8AnimationList = new TweenMax(cloud8, 2, {
        x: bodySize.w * 6 + bodySize.w * 0.05 + 10,
        repeat: -1,
        yoyo: true
      });
      cloud8AnimationList.play();
      var cloud9H = bodySize.h * 0.45;
      var cloud9 = this.methods.createSprite("./images/9-cloud.png", {
        width: cloud9H * 3.8078,
        height: cloud9H,
        x: bodySize.w * 7 + bodySize.w * 0.05,
        y: bodySize.h * 0.15
      });
      var cloud9AnimationList = new TweenMax(cloud9, 2, {
        x: bodySize.w * 7 + bodySize.w * 0.05 + 10,
        repeat: -1,
        yoyo: true
      });
      cloud9AnimationList.play();
      var cloud10H = bodySize.h * 0.6;
      var cloud10 = this.methods.createSprite("./images/10-cloud.png", {
        width: cloud10H * 2.1029,
        height: cloud10H,
        x: bodySize.w * 8 + bodySize.w * 0.2,
        y: bodySize.h * 0.15
      });
      var cloud10AnimationList = new TweenMax(cloud10, 2, {
        x: bodySize.w * 8 + bodySize.w * 0.2 + 10,
        repeat: -1,
        yoyo: true
      });
      cloud10AnimationList.play();
      var petal11H = bodySize.h * 0.8;
      var petal11 = this.methods.createSprite("./images/11-petal.png", {
        width: petal11H * 1.7130,
        height: petal11H,
        x: bodySize.w * 9 + bodySize.w * 0.2,
        y: bodySize.h * 0.15
      });
      var petal11AnimationList = TweenMax.fromTo(petal11, 8, {
        x: bodySize.w * 9 + bodySize.w * 0.2 - 20,
        y: bodySize.h * 0.15 - 20
      }, {
        x: bodySize.w * 9 + bodySize.w * 0.2 + 20,
        y: bodySize.h * 0.15 + 40
      }).repeat(-1);
      petal11AnimationList.play();
      var petal12H = bodySize.h * 0.8;
      var petal12 = this.methods.createSprite("./images/share-petal-colour.png", {
        width: petal12H * 1.8293,
        height: petal12H,
        x: bodySize.w * 10 + bodySize.w * 0.1,
        y: bodySize.h * 0.15
      });
      var petal12AnimationList = TweenMax.fromTo(petal12, 8, {
        x: bodySize.w * 10 + bodySize.w * 0.1 - 20,
        y: bodySize.h * 0.15 - 20
      }, {
        x: bodySize.w * 10 + bodySize.w * 0.1 + 20,
        y: bodySize.h * 0.15 + 40
      }).repeat(-1);
      petal12AnimationList.play();
      var threeLightHeight = bodySize.h / 3;
      var threeLight = this.methods.createSprite("./images/3-light.png", {
        width: threeLightHeight,
        height: threeLightHeight,
        x: bodySize.w + bodySize.w * 0.62 - threeLightHeight / 2,
        y: bodySize.h * 0.1
      });
      threeLight.interactive = true;
      threeLight.buttonMode = true;
      threeLight.on('tap', function() {
        gradientColor(_this2.data.app.renderer, '#c8c9c9', '#2a99a5', 10);
        console.log(_this2.data.app.renderer);
        _this2.data.progress = 3;
        var texture = PIXI.Texture.fromFrame('./images/3-colour.png');
        bg3Image.setTexture(texture);
        threeLightAnimationList.kill();
        threeHandAnimation.kill();
        threeLight.destroy();
        threeHand.destroy();
        cloud3.destroy();
        cloud3AnimationList.kill();
        _this2.setShowPageNumber(4);
      });
      var threeHandHeight = bodySize.h / 10;
      var threeHand = this.methods.createSprite("./images/1-hand.png", {
        width: threeHandHeight,
        height: threeHandHeight,
        x: bodySize.w + bodySize.w * 0.67 - threeHandHeight / 2,
        y: bodySize.h * 0.28
      });
      var threeHandAnimation = TweenMax.fromTo(threeHand, 1, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      threeHandAnimation.play();
      var fiveLightHeight = bodySize.h / 10;
      var fiveLight = this.methods.createSprite("./images/5-light.png", {
        width: fiveLightHeight * 2.0581,
        height: fiveLightHeight,
        x: bodySize.w * 3 + bodySize.w * 0.575 - fiveLightHeight / 2,
        y: bodySize.h * 0.58
      });
      fiveLight.interactive = true;
      fiveLight.buttonMode = true;
      fiveLight.on('tap', function() {
        var texture = PIXI.Texture.fromFrame('./images/5-colour.png');
        gradientColor(_this2.data.app.renderer, '#c8c9c9', '#59d3cb', 10);
        _this2.data.progress = 5;
        bg5Image.setTexture(texture);
        fiveLightHeightAnimationList.kill();
        fiveLight.destroy();
        cloud5.destroy();
        cloud5AnimationList.kill();
        _this2.setShowPageNumber(6);
      });
      var sevenLightHeight = bodySize.h / 5;
      var sevenLight = this.methods.createSprite("./images/7-light.png", {
        width: sevenLightHeight * 0.7421,
        height: sevenLightHeight,
        x: bodySize.w * 5 + bodySize.w * 0.33 - sevenLightHeight / 2,
        y: bodySize.h * 0.57
      });
      sevenLight.interactive = true;
      sevenLight.buttonMode = true;
      sevenLight.on('tap', function() {
        gradientColor(_this2.data.app.renderer, '#c8c9c9', '#dccfbc', 10);
        _this2.data.progress = 7;
        var texture = PIXI.Texture.fromFrame('./images/7-colour.png');
        bg7Image.setTexture(texture);
        sevenLightHeightAnimationList.kill();
        sevenLight.destroy();
        _this2.setShowPageNumber(8);
      });
      var Light9Height = bodySize.h / 5;
      var Light9 = this.methods.createSprite("./images/9-light.png", {
        width: Light9Height,
        height: Light9Height,
        x: bodySize.w * 7 + bodySize.w * 0.57 - sevenLightHeight / 2,
        y: bodySize.h * 0.065
      });
      Light9.interactive = true;
      Light9.buttonMode = true;
      Light9.on('tap', function() {
        gradientColor(_this2.data.app.renderer, '#c8c9c9', '#fae768', 10);
        _this2.data.progress = 9;
        var texture = PIXI.Texture.fromFrame('./images/9-colour.png');
        bg9Image.setTexture(texture);
        Light9AnimationList.kill();
        Light9.destroy();
        _this2.setShowPageNumber(10);
      });
      var Light11Height = bodySize.h / 1.3;
      console.log(bodySize.h / bodySize.w);
      var Light11 = this.methods.createSprite("./images/11-light.png", {
        width: bodySize.w * 0.42,
        height: Light11Height,
        x: bodySize.w * 9 + bodySize.w * 0.362 - sevenLightHeight / 2,
        y: bodySize.h * 0.065
      });
      Light11.interactive = true;
      Light11.buttonMode = true;
      Light11.on('tap', function() {
        _this2.data.app.renderer.backgroundColor = "0xcfdee5";
        _this2.data.progress = 11;
        var texture = PIXI.Texture.fromFrame('./images/11-colour.png');
        bg11Image.setTexture(texture);
        var petalTexture = PIXI.Texture.fromFrame('./images/11-petal-colour.png');
        petal11.setTexture(petalTexture);
        Light11AnimationList.kill();
        Light11.destroy();
        _this2.setShowPageNumber(11);
      });
      this.data.twoContainer.addChild(bg2Image, bg3Image, this.data.people, threeLight, threeHand, bg4Image, bg5Image, bg6Image, bg7Image, bg8Image, bg9Image, bg10Image, Light11, bg11Image, bgshare, fiveLight, sevenLight, Light9, shareBT, BT2019);
      this.data.twoContainer.addChild(cloud3, cloud4, cloud5, cloud6, cloud7, cloud8, cloud9, cloud10, petal11, petal12);
      this.data.app.stage.addChild(this.data.twoContainer);
      var threeLightAnimationList = TweenMax.fromTo(threeLight, 1, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      threeLightAnimationList.play();
      var fiveLightHeightAnimationList = TweenMax.fromTo(fiveLight, 1, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      fiveLightHeightAnimationList.play();
      var sevenLightHeightAnimationList = TweenMax.fromTo(sevenLight, 1, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      sevenLightHeightAnimationList.play();
      var Light9AnimationList = TweenMax.fromTo(Light9, 1, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      Light9AnimationList.play();
      var Light11AnimationList = TweenMax.fromTo(Light11, 2, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      Light11AnimationList.play();
      this.scrollBegin();
    },
    "scrollBegin": function scrollBegin() {
      var _this3 = this;
      console.log('注册scroll!');
      var transverse = this.data.screenInfo.transverse;
      this.data.scroller = new Scroller(function(left, top, zoom) {
        var scrollNumber = transverse ? left : top;
        _this3.data.twoContainer.x = -scrollNumber;
        var peopleX = scrollNumber + 50 * (1024 / _this3.data.screenInfo.w);
        _this3.data.people.x = peopleX;
        _this3.setPeopleImg(peopleX);
        _this3.setBGC(peopleX);
        _this3.setPeopleY(peopleX);
      }, {
        zooming: true,
        bouncing: false
      });
      this.setShowPageNumber(2);
      this.mouseEvent();
    },
    "setShowPageNumber": function setShowPageNumber(number) {
      var transverse = this.data.screenInfo.transverse;
      if (transverse) {
        this.data.scroller.setDimensions(this.data.screenInfo.w, this.data.screenInfo.h, this.data.screenInfo.w * number, this.data.screenInfo.h);
      } else {
        this.data.scroller.setDimensions(this.data.screenInfo.h, this.data.screenInfo.w, this.data.screenInfo.h, this.data.screenInfo.w * number);
      }
    },
    "setPeopleY": function setPeopleY(peopleX) {
      peopleX = peopleX * (1024 / this.data.screenInfo.w);
      if (peopleX < 188) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.25, 0, peopleX, 0.001);
      } else if (peopleX < 390) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.438, 188, peopleX, 0.0007);
      } else if (peopleX < 560) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5794, 390, peopleX, 0.00025);
      } else if (peopleX < 687) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6219, 560, peopleX, -0.0003);
      } else if (peopleX < 966) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5838, 687, peopleX, -0.0011);
      } else if (peopleX < 1125) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.2769, 966, peopleX, -0.0004);
      } else if (peopleX < 1167) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.2133, 1125, peopleX, -0.00005);
      } else if (peopleX < 1412) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.2112, 1167, peopleX, 0.0005);
      } else if (peopleX < 1591) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3337, 1412, peopleX, 0.001);
      } else if (peopleX < 1744) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5136, 1591, peopleX, 0.0006);
      } else if (peopleX < 1844) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6054, 1744, peopleX, 0.0001);
      } else if (peopleX < 2017) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6122, 1844, peopleX, -0.0006);
      } else if (peopleX < 2238) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5081, 2017, peopleX, -0.001);
      } else if (peopleX < 2386) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.2864, 2238, peopleX, -0.0006);
      } else if (peopleX < 2530) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.1980, 2386, peopleX, -0.0002);
      } else if (peopleX < 2679) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.1690, 2530, peopleX, 0.00015);
      } else if (peopleX < 3299) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.1911, 2679, peopleX, 0.0006);
      } else if (peopleX < 3777) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5635, 3299, peopleX, -0.0005);
      } else if (peopleX < 3969) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3243, 3777, peopleX, -0.0001);
      } else if (peopleX < 4317) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3050, 3969, peopleX, 0.0003);
      } else if (peopleX < 4614) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.4096, 4317, peopleX, 0.0005);
      } else if (peopleX < 4944) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5582, 4614, peopleX, 0.0003);
      } else if (peopleX < 5352) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6572, 4944, peopleX, -0.0007);
      } else if (peopleX < 5638) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3714, 5352, peopleX, -0.0003);
      } else if (peopleX < 5946) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.2854, 5638, peopleX, 0.0004);
      } else if (peopleX < 6443) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.4089, 5946, peopleX, 0.0006);
      } else if (peopleX < 7042) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.7080, 6443, peopleX, 0.00001);
      } else if (peopleX < 7723) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.7139, 7042, peopleX, -0.0004);
      } else if (peopleX < 8383) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.4412, 7723, peopleX, 0.0001);
      } else if (peopleX < 9303) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5072, 8383, peopleX, -0.00026);
      } else if (peopleX < 10025) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.2677, 9303, peopleX, 0.0003);
      } else {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.4844, 10025, peopleX, -0.0004);
      }
    },
    "setPeopleImg": function setPeopleImg(peopleX) {
      var peopleID = Math.ceil(peopleX / this.data.screenInfo.w);
      if (this.data.peopleImgID !== peopleID) {
        var texture = PIXI.Texture.fromFrame('./images/people-' + peopleID + '.png');
        this.data.people.setTexture(texture);
        this.data.peopleImgID = peopleID;
      }
    },
    "setBGC": function setBGC(peopleX) {
      var progressID = Math.ceil(peopleX / this.data.screenInfo.w);
      if (this.data.progress < progressID) {
        this.data.progress = progressID;
        this.data.app.renderer.backgroundColor = '0xc8c9c9';
      }
    },
    "mouseEvent": function mouseEvent() {
      var _this4 = this;
      var mousedown = false;
      $('canvas')[0].addEventListener("touchstart", function(e) {
        _this4.data.scroller.doTouchStart(e.touches, e.timeStamp);
        mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("touchmove", function(e) {
        if (!mousedown) {
          return;
        }
        _this4.data.scroller.doTouchMove(e.touches, e.timeStamp);
        mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("touchend", function(e) {
        if (!mousedown) {
          return;
        }
        _this4.data.scroller.doTouchEnd(e.timeStamp);
        mousedown = false;
      }, false);
    }
  }
}