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
      "imgArr": ["./images/1.png", "./images/3-colour.png", "./images/1-clock.png", "./images/1-point.png", "./images/1-hand.png", "./images/1-butterfly.png", "./images/people-1.png", "./images/people-2.png", "./images/people-3.png", "./images/people-4.png", "./images/people-5.png", "./images/people-6.png", "./images/people-7.png", "./images/people-8.png", "./images/people-9.png", "./images/people-10.png", "./images/people-11.png", "./images/2.png", "./images/3.png", "./images/3-thought.png", "./images/3-start.png", "./images/3-light.png", "./images/4.png", "./images/5.png", "./images/6.png", "./images/7.png", "./images/8.png", "./images/9.png", "./images/10.png", "./images/11.png", "./images/share.png", "./images/5-colour.png", "./images/7-light.png", "./images/7-colour.png", "./images/9-colour.png", "./images/11-light.png", "./images/11-colour.png", "./images/3-cloud.png", "./images/4-cloud.png", "./images/5-cloud.png", "./images/6-cloud.png", "./images/7-cloud.png", "./images/8-cloud.png", "./images/9-cloud.png", "./images/10-cloud.png", "./images/11-petal-colour.png", "./images/1/1.png", "./images/1/2.png", "./images/1/3.png", "./images/1/4.png", "./images/1/5.png", "./images/1/6.png", "./images/1/7.png", "./images/1/8.png", "./images/1/9.png", "./images/1/10.png", "./images/1/11.png", "./images/1/12.png", "./images/1/13.png", "./images/1/14.png", "./images/1/15.png", "./images/1/16.png", "./images/2/1.png", "./images/2/2.png", "./images/2/3.png", "./images/2/4.png", "./images/2/5.png", "./images/2/6.png", "./images/2/7.png", "./images/2/8.png", "./images/2/9.png", "./images/2/10.png", "./images/2/11.png", "./images/2/12.png", "./images/2/13.png", "./images/2/14.png", "./images/2/15.png", "./images/2/16.png", "./images/3/1.png", "./images/3/2.png", "./images/3/3.png", "./images/3/4.png", "./images/3/5.png", "./images/3/6.png", "./images/3/7.png", "./images/3/8.png", "./images/3/9.png", "./images/3/10.png", "./images/3/11.png", "./images/3/12.png", "./images/3/13.png", "./images/3/14.png", "./images/3/15.png", "./images/3/16.png", "./images/4/1.png", "./images/4/2.png", "./images/4/3.png", "./images/4/4.png", "./images/4/5.png", "./images/4/6.png", "./images/4/7.png", "./images/4/8.png", "./images/4/9.png", "./images/4/10.png", "./images/4/11.png", "./images/4/12.png", "./images/4/13.png", "./images/4/14.png", "./images/4/15.png", "./images/4/16.png", "./images/5/1.png", "./images/5/2.png", "./images/5/3.png", "./images/5/4.png", "./images/5/5.png", "./images/5/6.png", "./images/5/7.png", "./images/5/8.png", "./images/5/9.png", "./images/5/10.png", "./images/5/11.png", "./images/5/12.png", "./images/5/13.png", "./images/5/14.png", "./images/5/15.png", "./images/5/16.png", "./images/6/1.png", "./images/6/2.png", "./images/6/3.png", "./images/6/4.png", "./images/6/5.png", "./images/6/6.png", "./images/6/7.png", "./images/6/8.png", "./images/6/9.png", "./images/6/10.png", "./images/6/11.png", "./images/6/12.png", "./images/6/13.png", "./images/6/14.png", "./images/6/15.png", "./images/6/16.png", "./images/7/1.png", "./images/7/2.png", "./images/7/3.png", "./images/7/4.png", "./images/7/5.png", "./images/7/6.png", "./images/7/7.png", "./images/7/8.png", "./images/7/9.png", "./images/7/10.png", "./images/7/11.png", "./images/7/12.png", "./images/7/13.png", "./images/7/14.png", "./images/7/15.png", "./images/7/16.png", "./images/8/1.png", "./images/8/2.png", "./images/8/3.png", "./images/8/4.png", "./images/8/5.png", "./images/8/6.png", "./images/8/7.png", "./images/8/8.png", "./images/8/9.png", "./images/8/10.png", "./images/8/11.png", "./images/8/12.png", "./images/8/13.png", "./images/8/14.png", "./images/8/15.png", "./images/8/16.png", "./images/9/1.png", "./images/9/2.png", "./images/9/3.png", "./images/9/4.png", "./images/9/5.png", "./images/9/6.png", "./images/9/7.png", "./images/9/8.png", "./images/9/9.png", "./images/9/10.png", "./images/9/11.png", "./images/9/12.png", "./images/9/13.png", "./images/9/14.png", "./images/9/15.png", "./images/9/16.png", "./images/grass1.png", "./images/sport/1.png", "./images/sport/2.png", "./images/support.png", "./images/support-tree-1.png"],
      "animationList": {}
    },
    "created": function created() {
      var _this = this;
      var loadingColorDom = $('#color')[0];
      var ww = $(window).width();
      var wh = $(window).height();
      var bodySize = this.calculationScene(this);
      this.data.loader = new PIXI.loaders.Loader();
      this.data.loader.add(this.data.imgArr).onProgress.add(function(e) {
        loadingColorDom.style.width = parseInt(e.progress) + '%';
        if (Math.ceil(e.progress) >= 100) {
          _this.data.animationList.oneButterfly = TweenMax.fromTo(oneButterfly, 0.8, {
            y: _this.data.screenInfo.h * 0.1
          }, {
            y: _this.data.screenInfo.h * 0.104,
            ease: Linear.easeNone
          }).repeat(-1);
          _this.data.animationList.oneButterfly.play();
          _this.data.app.stage.addChild(one);
          $('#loadingBox').remove();
          var clockDom = $('#clock')[0];
          var clockDomHeight = _this.data.screenInfo.h * 0.8;
          clockDom.style.display = 'block';
          clockDom.style.width = clockDomHeight * 1.6481 + 'px';
          clockDom.style.height = clockDomHeight + 'px';
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
      var clockHeight = bodySize.h / 1.2;
      var clockWidth = clockHeight * 1.7801;
      var pointHeight = bodySize.h / 4;
      var butterflyHeight = bodySize.h / 1.3;
      var butterflyWidth = bodySize.w;
      var oneButterfly = this.methods.createSprite("./images/1-butterfly.png", {
        width: butterflyWidth,
        height: butterflyHeight,
        x: 0,
        y: bodySize.h * 0.1,
        z: -1
      });
      one.addChild(bg1Image, oneButterfly);
      this.addBind($("#clockDial"), function() {
        $('#bgm')[0].play();
        _this.openClock(one, oneButterfly, bg1Image);
      });
      this.data.loader.load(function(loader) {});
      var shareDom = document.getElementById("shareBox");
      shareDom.ontouchend = function() {
        $('#qr')[0].style.display = 'block';
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
      if (ww < wh) {
        console.log('竖屏');
        window.document.body.style.width = "".concat(wh, "px");
        window.document.body.style.height = "".concat(ww, "px");
        window.document.body.classList.add('horizontal');
        window.document.body.style.left = "calc(50% - ".concat(wh / 2, "px)");
        window.document.body.style.top = "calc(50% - ".concat(ww / 2, "px)");
        if (!this.data.app) {
          this.data.app = new PIXI.Application($(window).height() * 2, $(window).width() * 2, {
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
        console.log('横屏');
        window.document.body.classList.remove('horizontal');
        window.document.body.style.width = "".concat(ww, "px");
        window.document.body.style.height = "".concat(wh, "px");
        window.document.body.style.left = '';
        window.document.body.style.top = '';
        if (!this.data.app) {
          this.data.app = new PIXI.Application($(window).width() * 2, $(window).height() * 2, {
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
        }
        return {
          w: ww,
          h: wh,
          transverse: true
        };
      }
    },
    "openClock": function openClock(one, oneButterfly, bg1Image) {
      var _this2 = this;
      $("#clockDial").unbind();
      var _loop = function _loop(i) {
        setTimeout(function() {
          $('#onePoint')[0].style.transform = "rotate(".concat(3 * i, "deg)");
        }, i * 10);
      };
      for (var i = 0; i < 35; i++) {
        _loop(i);
      }
      setTimeout(function() {
        $('#clockDial')[0].classList.add("flip-play");
        $("#clock").off("touchmove");
        _this2.data.animationList.oneButterfly.kill();
        oneButterfly.destroy();
        setTimeout(function() {
          $('#clock')[0].classList.add('scale-play');
          setTimeout(function() {
            bg1Image.destroy();
            setTimeout(function() {
              _this2.data.app.stage.removeChild(one);
            }, 0);
            $("#clock").off("touchstart");
            $('#clock')[0].style.display = 'none';
            console.log('首页已销毁');
            _this2.two();
          }, 500);
        }, 1000);
      }, 500);
    },
    "two": function two() {
      var _this3 = this;
      var bodySize = this.data.screenInfo;
      console.log('第二部分!');
      this.data.twoContainer = new PIXI.Container();
      this.data.twoContainer.x = 0;
      this.data.twoContainer.y = 0;
      this.data.twoContainer.width = this.data.screenInfo.w;
      var style = new PIXI.TextStyle({
        fontSize: 18,
        fill: ['#ea5d8b']
      });
      var richText = new PIXI.Text('向左滑动，预见未来（打开音乐效果更佳）', style);
      console.log(richText);
      richText.x = 30;
      richText.y = 180;
      this.data.app.stage.addChild(richText);
      var peopleH = this.data.screenInfo.h * 0.2;
      this.data.people = this.methods.createSprite("./images/1/1.png", {
        width: 30 * (this.data.screenInfo.w / 1024),
        height: 120 * (this.data.screenInfo.h / 768),
        x: 50,
        y: 0
      });
      var peopleIndex = 16;
      setInterval(function() {
        if (peopleIndex <= 0) {
          peopleIndex = 16;
        }
        var groupID = _this3.data.peopleImgID > 9 ? 9 : _this3.data.peopleImgID;
        var texture = PIXI.Texture.fromFrame("./images/".concat(groupID, "/").concat(peopleIndex, ".png"));
        peopleIndex--;
        _this3.data.people.setTexture(texture);
      }, 100);
      var bg2Image = this.methods.createSprite("./images/2.png", {
        width: this.data.screenInfo.w + 1,
        height: this.data.screenInfo.h,
        x: 0,
        y: 0
      });
      var tipsH = this.data.screenInfo.h * 0.25;
      var tips = this.methods.createSprite("./images/tips.png", {
        width: tipsH * 1.7111,
        height: tipsH,
        x: this.data.screenInfo.w * 0.42,
        y: this.data.screenInfo.h * 0.4
      });
      var tipsA = TweenMax.fromTo(tips, 2, {
        alpha: .5
      }, {
        alpha: 1
      }).repeat(-1);
      tipsA.play();
      var bg3Image = this.methods.createSprite("./images/3.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w,
        y: 0
      });
      var bg4Image = this.methods.createSprite("./images/4.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 2,
        y: 0
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
        y: 0
      });
      var bg8Image = this.methods.createSprite("./images/8.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 6,
        y: 0
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
      bgshare.interactive = true;
      bgshare.buttonMode = true;
      var shareBTH = this.data.screenInfo.h * 0.3;
      var shareBT = this.methods.createSprite("./images/share-button.png", {
        width: shareBTH * 0.6781,
        height: shareBTH,
        x: this.data.screenInfo.w * 10 + this.data.screenInfo.w * 0.83,
        y: this.data.screenInfo.h * 0.05
      });
      shareBT.interactive = true;
      shareBT.buttonMode = true;
      this.addBind(shareBT, function() {
        $('#shareBox')[0].style.display = 'block';
        setTimeout(function() {
          $('#qr')[0].style.display = 'none';
        }, 0);
        return false;
      });
      var cloud3H = bodySize.h * 0.25;
      var cloud3 = this.methods.createSprite("./images/3-cloud.png", {
        width: cloud3H * 6.397,
        height: cloud3H,
        x: bodySize.w + bodySize.w * 0.05,
        y: bodySize.h * 0.1
      });
      var cloud4H = bodySize.h * 0.8;
      var cloud4 = this.methods.createSprite("./images/4-cloud.png", {
        width: cloud4H * 2.1159,
        height: cloud4H,
        x: bodySize.w * 2,
        y: 0
      });
      var cloud4AnimationList = new TweenMax(cloud4, 2, {
        x: bodySize.w * 2 + 20,
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
      var cloud6H = bodySize.h * 0.6;
      var cloud6 = this.methods.createSprite("./images/6-cloud.png", {
        width: cloud6H * 2.0727,
        height: cloud6H,
        x: bodySize.w * 4 + bodySize.w * 0.05,
        y: 0
      });
      var cloud6AnimationList = new TweenMax(cloud6, 2, {
        x: bodySize.w * 4 + 20,
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
      var cloud8H = bodySize.h * 0.6;
      var cloud8 = this.methods.createSprite("./images/8-cloud.png", {
        width: cloud8H * 2.5685,
        height: cloud8H,
        x: bodySize.w * 6 + bodySize.w * 0.05,
        y: bodySize.h * 0.05
      });
      var cloud8AnimationList = new TweenMax(cloud8, 2, {
        x: bodySize.w * 6 + bodySize.w * 0.05 + 20,
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
      var cloud10H = bodySize.h * 0.6;
      var cloud10 = this.methods.createSprite("./images/10-cloud.png", {
        width: cloud10H * 2.1029,
        height: cloud10H,
        x: bodySize.w * 8 + bodySize.w * 0.2,
        y: bodySize.h * 0.15
      });
      var cloud10AnimationList = new TweenMax(cloud10, 2, {
        x: bodySize.w * 8 + bodySize.w * 0.2 + 20,
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
      this.addBind(threeLight, function() {
        gradientColor(_this3.data.app.renderer, '#c8c9c9', '#2a99a5', 10);
        console.log(_this3.data.app.renderer);
        _this3.data.progress = 3;
        var texture = PIXI.Texture.fromFrame('./images/3-colour.png');
        bg3Image.setTexture(texture);
        threeLightAnimationList.kill();
        threeLight.destroy();
        cloud3.destroy();
        var thoughtH = bodySize.h * 0.4;
        var thought = _this3.methods.createSprite("./images/3-thought.png", {
          width: thoughtH * 1.7756,
          height: thoughtH,
          x: bodySize.w * 1.4,
          y: 0
        });
        var thoughtAnimationList = new TweenMax(thought, 2, {
          x: bodySize.w * 1.4 + 5,
          y: 5,
          repeat: -1,
          yoyo: true
        });
        thoughtAnimationList.play();
        _this3.setShowPageNumber(4);
        var startH = bodySize.h * 0.45;
        var start = _this3.methods.createSprite("./images/3-start.png", {
          width: startH * 2.5459,
          height: startH,
          x: bodySize.w + bodySize.w * 0.3,
          y: bodySize.h * 0.05
        });
        var startAnimationList = TweenMax.fromTo(start, 1, {
          alpha: 0
        }, {
          alpha: 1
        }).repeat(-1);
        startAnimationList.play();
        var atomH = bodySize.h * 0.1;
        var atom = _this3.methods.createSprite("./images/3-atom.png", {
          width: atomH,
          height: atomH,
          x: bodySize.w + bodySize.w * 0.42,
          y: bodySize.h * 0.18
        });
        atom.anchor.x = 0.5;
        atom.anchor.y = 0.5;
        var atomAnimationList = TweenMax.fromTo(atom.scale, 1, {
          x: 0.4,
          y: 0.4
        }, {
          x: 0.5,
          y: 0.5
        }).repeat(-1);
        atomAnimationList.play();
        var flaskH = bodySize.h * 0.12;
        var flask = _this3.methods.createSprite("./images/3-flask.png", {
          width: flaskH * 0.7356,
          height: flaskH,
          x: bodySize.w + bodySize.w * 0.58,
          y: bodySize.h * 0.43
        });
        flask.anchor.x = 0.5;
        flask.anchor.y = 1;
        var flaskAnimationList = new TweenMax(flask, 2, {
          rotation: 0.5,
          repeat: -1,
          yoyo: true,
          transformOrigin: 'center'
        });
        flaskAnimationList.play();
        var starH = bodySize.h * 0.12;
        var star = _this3.methods.createSprite("./images/3-star.png", {
          width: starH * 1.2352,
          height: starH,
          x: bodySize.w + bodySize.w * 0.64,
          y: bodySize.h * 0.2
        });
        star.anchor.x = 0.5;
        star.anchor.y = 0.5;
        var starAnimationList = new TweenMax(star, 4, {
          rotation: 4,
          repeat: -1,
          yoyo: true,
          transformOrigin: 'center'
        });
        starAnimationList.play();
        var textH = bodySize.h * 0.08;
        var text = _this3.methods.createSprite("./images/3-text.png", {
          width: textH * 6.2666,
          height: textH,
          x: bodySize.w + bodySize.w * 0.06,
          y: bodySize.h * 0.69
        });
        text.anchor.x = 0;
        text.anchor.y = 1;
        var textAnimationList = new TweenMax(text, 1.5, {
          alpha: 0.5,
          repeat: -1,
          yoyo: true,
          transformOrigin: 'center'
        });
        textAnimationList.play();
        _this3.data.twoContainer.addChild(thought, start, atom, flask, text, star);
        _this3.setShowPageNumber(4);
      });
      var fiveLightHeight = bodySize.h / 8;
      var fiveLight = this.methods.createSprite("./images/5-light.png", {
        width: fiveLightHeight * 1.6582,
        height: fiveLightHeight,
        x: bodySize.w * 3 + bodySize.w * 0.585 - fiveLightHeight / 2,
        y: bodySize.h * 0.57
      });
      fiveLight.interactive = true;
      fiveLight.buttonMode = true;
      this.addBind(fiveLight, function() {
        var texture = PIXI.Texture.fromFrame('./images/5-colour.png');
        gradientColor(_this3.data.app.renderer, '#c8c9c9', '#59d3cb', 10);
        _this3.data.progress = 5;
        bg5Image.setTexture(texture);
        fiveLightHeightAnimationList.kill();
        fiveLight.destroy();
        cloud5.destroy();
        _this3.setShowPageNumber(6);
        var tree1H = bodySize.h * 0.18;
        var tree1 = _this3.methods.createSprite("./images/tree1.png", {
          width: tree1H * 0.6937,
          height: tree1H,
          x: bodySize.w * 3.4 - tree1H * 0.9223 / 2,
          y: bodySize.h
        });
        tree1.anchor.x = 0.5;
        tree1.anchor.y = 1;
        var tree1AnimationList = new TweenMax(tree1, 2, {
          rotation: 0.4,
          repeat: -1,
          yoyo: true,
          transformOrigin: 'center'
        });
        tree1AnimationList.play();
        var tree2H = bodySize.h * 0.50;
        var tree2 = _this3.methods.createSprite("./images/tree2.png", {
          width: tree2H * 0.5323,
          height: tree2H,
          x: bodySize.w * 3.2 - tree2H * 0.5323 / 2,
          y: bodySize.h
        });
        tree2.anchor.x = 0.5;
        tree2.anchor.y = 1;
        var tree2AnimationList = new TweenMax(tree2, 2, {
          rotation: 0.2,
          repeat: -1,
          yoyo: true
        });
        tree2AnimationList.play();
        var tree3H = bodySize.h * 0.50;
        var tree3 = _this3.methods.createSprite("./images/tree3.png", {
          width: tree3H * 0.8517,
          height: tree3H,
          x: bodySize.w * 4 - tree3H * 0.8517 / 2,
          y: bodySize.h * 1.02
        });
        tree3.anchor.x = 0.3;
        tree3.anchor.y = 1;
        var tree3AnimationList = new TweenMax(tree3, 2, {
          rotation: 0.2,
          repeat: -1,
          yoyo: true
        });
        tree3AnimationList.play();
        var house1H = bodySize.h * 0.50;
        var house1 = _this3.methods.createSprite("./images/house1.png", {
          width: house1H * 0.5904,
          height: house1H,
          x: bodySize.w * 3.6,
          y: bodySize.h * 1.02
        });
        house1.anchor.x = 0.3;
        house1.anchor.y = 1;
        var house1AnimationList = TweenMax.fromTo(house1, 1.2, {
          y: bodySize.h
        }, {
          y: bodySize.h * 0.75
        });
        house1AnimationList.play();
        var house2H = bodySize.h * 0.40;
        var house2 = _this3.methods.createSprite("./images/house2.png", {
          width: house2H * 0.49011,
          height: house2H,
          x: bodySize.w * 3.25,
          y: bodySize.h * 1.02
        });
        house2.anchor.x = 0.3;
        house2.anchor.y = 1;
        var house2AnimationList = TweenMax.fromTo(house2, 1.1, {
          y: bodySize.h
        }, {
          y: bodySize.h * 0.75
        });
        house2AnimationList.play();
        var house3H = bodySize.h * 0.42;
        var house3 = _this3.methods.createSprite("./images/house3.png", {
          width: house3H * 0.5904,
          height: house3H,
          x: bodySize.w * 3.5,
          y: bodySize.h * 1.02
        });
        house3.anchor.x = 0.3;
        house3.anchor.y = 1;
        var house3AnimationList = TweenMax.fromTo(house3, 0.8, {
          y: bodySize.h
        }, {
          y: bodySize.h * 0.75
        });
        house3AnimationList.play();
        var house4H = bodySize.h * 0.3;
        var house4 = _this3.methods.createSprite("./images/house4.png", {
          width: house4H * 1.034,
          height: house4H,
          x: bodySize.w * 3.7,
          y: bodySize.h * 1.02
        });
        house4.anchor.x = 0.3;
        house4.anchor.y = 1;
        var house4AnimationList = TweenMax.fromTo(house4, 0.6, {
          y: bodySize.h
        }, {
          y: bodySize.h * 0.75
        });
        house4AnimationList.play();
        var house5H = bodySize.h * 0.3;
        var house5 = _this3.methods.createSprite("./images/house5.png", {
          width: house5H * 1.4926,
          height: house5H,
          x: bodySize.w * 3.33,
          y: bodySize.h * 1.01
        });
        house5.anchor.x = 0.3;
        house5.anchor.y = 1;
        var house5AnimationList = TweenMax.fromTo(house5, 1.4, {
          y: bodySize.h
        }, {
          y: bodySize.h * 0.75
        });
        house5AnimationList.play();
        _this3.data.twoContainer.addChild(house4, house1, house5, house3, house2, bg5Image, tree1, tree2, tree3);
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
      this.addBind(sevenLight, function() {
        gradientColor(_this3.data.app.renderer, '#c8c9c9', '#dccfbc', 10);
        _this3.data.progress = 7;
        var texture = PIXI.Texture.fromFrame('./images/7-colour.png');
        bg7Image.setTexture(texture);
        sevenLightHeightAnimationList.kill();
        sevenLight.destroy();
        _this3.setShowPageNumber(8);
        var cloud7AnimationList = new TweenMax(cloud7, 2, {
          x: bodySize.w * 5 + bodySize.w * 0.05 + 20,
          repeat: -1,
          yoyo: true
        });
        cloud7AnimationList.play();
        var supportH = bodySize.h * 0.8;
        var support = _this3.methods.createSprite("./images/support.png", {
          width: supportH * 0.9223,
          height: supportH,
          x: bodySize.w * 5 - supportH * 0.9223 / 2 + bodySize.w * 0.5,
          y: bodySize.h
        });
        var supportAnimationList = TweenMax.fromTo(support, 1.5, {
          y: bodySize.h
        }, {
          y: bodySize.h - supportH
        });
        supportAnimationList.play();
        var supportTree1H = bodySize.h * 0.2;
        var supportTree1 = _this3.methods.createSprite("./images/support-tree-1.png", {
          width: supportTree1H * 0.9223,
          height: supportTree1H,
          x: bodySize.w * 5.575 - supportTree1H * 1.1141 / 2,
          y: bodySize.h
        });
        var supportTree1AnimationList = TweenMax.fromTo(supportTree1, 1.5, {
          y: bodySize.h + supportH * 0.428
        }, {
          y: bodySize.h - supportH * 0.572
        });
        supportAnimationList.play();
        var supportTree1AnimationList2 = new TweenMax(supportTree1, 2, {
          width: supportTree1H * 0.9223 - 10,
          repeat: -1,
          yoyo: true
        });
        supportTree1AnimationList2.play();
        _this3.data.twoContainer.addChild(support, supportTree1);
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
      this.addBind(Light9, function() {
        gradientColor(_this3.data.app.renderer, '#c8c9c9', '#f6df60', 10);
        _this3.data.progress = 9;
        var texture = PIXI.Texture.fromFrame('./images/9-colour.png');
        bg9Image.setTexture(texture);
        Light9AnimationList.kill();
        Light9.destroy();
        _this3.setShowPageNumber(10);
        var cloud9AnimationList = new TweenMax(cloud9, 2, {
          x: bodySize.w * 7 + bodySize.w * 0.05 + 20,
          repeat: -1,
          yoyo: true
        });
        cloud9AnimationList.play();
      });
      var Light11Height = bodySize.h / 1.5;
      console.log(bodySize.h / bodySize.w);
      var Light11 = this.methods.createSprite("./images/11-light.png", {
        width: Light11Height,
        height: Light11Height,
        x: bodySize.w * 9 + bodySize.w * 0.39 - sevenLightHeight / 2,
        y: bodySize.h * 0.09
      });
      var handH = bodySize.h / 1.3;
      var hand = this.methods.createSprite("./images/hand.png", {
        width: handH,
        height: handH,
        x: bodySize.w * 9 + bodySize.w * 0.35 - sevenLightHeight / 2,
        y: bodySize.h * 0.065
      });
      Light11.interactive = true;
      Light11.buttonMode = true;
      this.addBind(Light11, function() {
        _this3.data.app.renderer.backgroundColor = "0xcfdee5";
        _this3.data.progress = 11;
        var texture = PIXI.Texture.fromFrame('./images/11-colour.png');
        bg11Image.setTexture(texture);
        var petalTexture = PIXI.Texture.fromFrame('./images/11-petal-colour.png');
        petal11.setTexture(petalTexture);
        Light11AnimationList.kill();
        Light11.destroy();
        hand.destroy();
        _this3.setShowPageNumber(11);
        var grass1H = bodySize.h;
        var grass1 = _this3.methods.createSprite("./images/grass1.png", {
          width: grass1H * 0.8106,
          height: grass1H,
          x: bodySize.w * 9,
          y: 0
        });
        var grass1AnimationList = TweenMax.fromTo(grass1, 1, {
          x: bodySize.w * 9 - grass1H * 0.8106
        }, {
          x: bodySize.w * 9
        });
        grass1AnimationList.play();
        var grass2H = bodySize.h * 0.4;
        var grass2 = _this3.methods.createSprite("./images/grass2.png", {
          width: grass2H * 2.4909,
          height: grass2H,
          x: bodySize.w * 10 - grass2H * 2.4909,
          y: -grass2H
        });
        var grass2AnimationList = TweenMax.fromTo(grass2, 1, {
          y: -grass2H
        }, {
          y: 0
        });
        grass2AnimationList.play();
        var grass3H = bodySize.h * 0.2;
        var grass3 = _this3.methods.createSprite("./images/grass3.png", {
          width: grass3H * 1.5402,
          height: grass3H,
          x: bodySize.w * 10 + 2 * grass3H * 1.5402,
          y: bodySize.h
        });
        var grass3AnimationList = TweenMax.fromTo(grass3, 1, {
          x: bodySize.w * 10,
          y: bodySize.h
        }, {
          x: bodySize.w * 10 - grass3H * 1.5402 / 2,
          y: bodySize.h * 1.03
        });
        grass3AnimationList.play();
        grass3.anchor.x = 0.5;
        grass3.anchor.y = 1;
        var grass3AnimationList2 = new TweenMax(grass3, 2, {
          y: bodySize.h * 1.025,
          repeat: -1,
          yoyo: true
        });
        grass3AnimationList2.play();
        var fogH = bodySize.h * 0.2;
        var fog = _this3.methods.createSprite("./images/fog.png", {
          width: fogH * 2.2021,
          height: fogH,
          x: bodySize.w * 9.32,
          y: bodySize.h * 0.5
        });
        var fogAnimationList = TweenMax.fromTo(fog, 2, {
          alpha: 0.2
        }, {
          alpha: 1
        }).repeat(-1);
        fogAnimationList.play();
        _this3.data.twoContainer.addChild(grass1, grass2, grass3, fog);
        var petal11AnimationList = TweenMax.fromTo(petal11, 8, {
          x: bodySize.w * 9 + bodySize.w * 0.2 - 20,
          y: bodySize.h * 0.15 - 20
        }, {
          x: bodySize.w * 9 + bodySize.w * 0.2 + 20,
          y: bodySize.h * 0.15 + 40
        }).repeat(-1);
        petal11AnimationList.play();
      });
      var sportH = bodySize.h * 0.1;
      var sport = this.methods.createSprite("./images/sport/1.png", {
        width: sportH * 1.0775,
        height: sportH,
        x: bodySize.w * 10 + bodySize.w * 0.88 - sportH * 1.0775 / 2,
        y: bodySize.h * 0.44 - sportH / 2
      });
      var sportInd = 1;
      setInterval(function() {
        var texture = PIXI.Texture.fromFrame("./images/sport/".concat(sportInd, ".png"));
        if (sportInd === 1) {
          sportInd = 2;
        } else {
          sportInd = 1;
        }
        sport.setTexture(texture);
      }, 100);
      this.data.twoContainer.addChild(bg2Image, tips, bg3Image, this.data.people, threeLight, bg4Image, bg5Image, bg6Image, bg7Image, bg8Image, bg9Image, bg10Image, bg11Image, bgshare, Light11, hand, fiveLight, sevenLight, Light9, shareBT, sport);
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
      var _this4 = this;
      console.log('注册scroll!');
      var transverse = this.data.screenInfo.transverse;
      this.data.scroller = new Scroller(function(left, top, zoom) {
        var scrollNumber = transverse ? left : top;
        _this4.data.twoContainer.x = -scrollNumber;
        var peopleX = scrollNumber + 50 * (1024 / _this4.data.screenInfo.w);
        _this4.data.people.x = peopleX;
        _this4.setPeopleImg(peopleX);
        _this4.setBGC(peopleX);
        _this4.setPeopleY(peopleX);
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
      var ratio = peopleX / this.data.screenInfo.w;
      peopleX = peopleX * (1024 / this.data.screenInfo.w);
      console.log(peopleX);
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
        var ratioB = ratio % 10 * 100;
        console.log(ratioB);
        if (this.data.screenInfo.w < 800) {
          if (ratioB > 5) {
            $('#qr')[0].style.display = 'block';
            $('#qr')[0].style.bottom = "".concat(ratio % 10 * 100 + 7, "%");
          } else {
            $('#qr')[0].style.display = 'none';
          }
        } else {
          if (ratioB > 1) {
            $('#qr')[0].style.display = 'block';
            $('#qr')[0].style.bottom = "".concat(ratio % 10 * 100 + 10, "%");
          } else {
            $('#qr')[0].style.display = 'none';
          }
        }
      }
    },
    "setPeopleImg": function setPeopleImg(peopleX) {
      var peopleID = Math.ceil(peopleX / this.data.screenInfo.w);
      if (this.data.peopleImgID !== peopleID) {
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
      var _this5 = this;
      var mousedown = false;
      $('canvas')[0].addEventListener("touchstart", function(e) {
        _this5.data.scroller.doTouchStart(e.touches, e.timeStamp);
        mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("touchmove", function(e) {
        if (!mousedown) {
          return;
        }
        _this5.data.scroller.doTouchMove(e.touches, e.timeStamp);
        mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("touchend", function(e) {
        if (!mousedown) {
          return;
        }
        _this5.data.scroller.doTouchEnd(e.timeStamp);
        mousedown = false;
      }, false);
      $('canvas')[0].addEventListener("mousedown", function(e) {
        _this5.data.scroller.doTouchStart([e], e.timeStamp);
        mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("mousemove", function(e) {
        if (!mousedown) {
          return;
        }
        _this5.data.scroller.doTouchMove([e], e.timeStamp);
        mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("mouseup", function(e) {
        if (!mousedown) {
          return;
        }
        _this5.data.scroller.doTouchEnd(e.timeStamp);
        mousedown = false;
      }, false);
    },
    "addBind": function addBind(item, func) {
      item.on('tap', func);
      item.on('click', func);
    }
  }
}