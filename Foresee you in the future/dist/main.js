"use strict";

// 对象合并方法
function assign(a, b) {
  var newObj = {};

  for (var key in a) {
    newObj[key] = a[key];
  }

  for (var key in b) {
    newObj[key] = b[key];
  }

  return newObj;
} // 运行页面所属的方法


function runPageFunction(pageName, entryDom) {
  // ozzx-name处理
  window.ozzx.domList = {};
  pgNameHandler(entryDom); // 判断页面是否有自己的方法

  var newPageFunction = window.ozzx.script[pageName];
  if (!newPageFunction) return; // console.log(newPageFunction)
  // 如果有created方法则执行

  if (newPageFunction.created) {
    // 注入运行环境
    newPageFunction.created.apply(assign(newPageFunction, {
      $el: entryDom,
      data: newPageFunction.data,
      methods: newPageFunction.methods,
      activePage: window.ozzx.activePage,
      domList: window.ozzx.domList
    }));
  } // 判断页面是否有下属模板,如果有运行所有模板的初始化方法


  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key];

    if (templateScript.created) {
      // 获取到当前配置页的DOM
      // 待修复,临时获取方式,这种方式获取到的dom不准确
      var domList = entryDom.getElementsByClassName('ox-' + key);

      if (domList.length !== 1) {
        console.error('我就说会有问题吧!');
        console.log(domList);
      } // 为模板注入运行环境


      templateScript.created.apply(assign(newPageFunction.template[key], {
        $el: domList[0].children[0],
        data: templateScript.data,
        methods: templateScript.methods,
        activePage: window.ozzx.activePage,
        domList: window.ozzx.domList
      }));
    }
  }
} // ozzx-name处理


function pgNameHandler(dom) {
  // 遍历每一个DOM节点
  for (var i = 0; i < dom.children.length; i++) {
    var tempDom = dom.children[i]; // 判断是否存在@name属性

    var pgName = tempDom.attributes['@name'];

    if (pgName) {
      // console.log(pgName.textContent)
      // 隐藏元素
      tempDom.hide = function () {
        this.style.display = 'none';
        console.log(this.style);
      };

      window.ozzx.domList[pgName.textContent] = tempDom;
    } // 判断是否有点击事件


    var clickFunc = tempDom.attributes['@click'];

    if (clickFunc) {
      tempDom.onclick = function () {
        var clickFor = this.attributes['@click'].textContent; // 判断页面是否有自己的方法

        var newPageFunction = window.ozzx.script[window.ozzx.activePage]; // console.log(this.attributes)
        // 判断是否为模板

        var templateName = this.attributes['template']; // console.log(templateName)

        if (templateName) {
          newPageFunction = newPageFunction.template[templateName.textContent];
        } // console.log(newPageFunction)
        // 取出参数


        var parameterArr = [];
        var parameterList = clickFor.match(/[^\(\)]+(?=\))/g);

        if (parameterList && parameterList.length > 0) {
          // 参数列表
          parameterArr = parameterList[0].split(','); // 进一步处理参数

          for (var i = 0; i < parameterArr.length; i++) {
            var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, ""); // console.log(parameterValue)
            // 判断参数是否为一个字符串

            if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 2);
            }

            if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 2);
            } // console.log(parameterArr[i])

          }

          clickFor = clickFor.replace('(' + parameterList + ')', '');
        } // console.log(newPageFunction)
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
          }, parameterArr);
        }
      };
    } // 递归处理所有子Dom结点


    if (tempDom.children.length > 0) {
      pgNameHandler(tempDom);
    }
  }
} // 页面资源加载完毕事件


window.onload = function () {
  var page = globalConfig.entry;
  window.ozzx.activePage = page;
  var entryDom = document.getElementById('ox-' + page);

  if (entryDom) {
    runPageFunction(page, entryDom);
  } else {
    console.error('找不到页面入口!');
  }
};

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
      "progress": 1,
      "people": null,
      "peopleImgID": 1,
      "xMax": 0,
      "resources": null,
      "peopleCanMoveing": false,
      "clickPeopleRunning": false,
      "imgArr": ["./images/1.png", "./images/3-colour.png", "./images/1-clock.png", "./images/1-point.png", "./images/1-hand.png", "./images/1-butterfly.png", "./images/people-1.png", "./images/people-2.png", "./images/people-3.png", "./images/people-4.png", "./images/people-5.png", "./images/people-6.png", "./images/people-7.png", "./images/people-8.png", "./images/people-9.png", "./images/people-10.png", "./images/people-11.png", "./images/2.png", "./images/3.png", "./images/3-thought.png", "./images/3-start.png", "./images/3-light.png", "./images/4.png", "./images/5.png", "./images/6.png", "./images/7.png", "./images/8.png", "./images/9.png", "./images/10.png", "./images/11.png", "./images/share.png", "./images/5-colour.png", "./images/7-light.png", "./images/7-colour.png", "./images/9-colour.png", "./images/11-light.png", "./images/11-colour.png", "./images/3-cloud.png", "./images/4-cloud.png", "./images/5-cloud.png", "./images/6-cloud.png", "./images/7-cloud.png", "./images/8-cloud.png", "./images/9-cloud.png", "./images/10-cloud.png", "./images/11-petal-colour.png", "./images/1/1.png", "./images/1/2.png", "./images/1/3.png", "./images/1/4.png", "./images/1/5.png", "./images/1/6.png", "./images/1/7.png", "./images/1/8.png", "./images/1/9.png", "./images/1/10.png", "./images/1/11.png", "./images/1/12.png", "./images/1/13.png", "./images/1/14.png", "./images/1/15.png", "./images/1/16.png", "./images/2/1.png", "./images/2/2.png", "./images/2/3.png", "./images/2/4.png", "./images/2/5.png", "./images/2/6.png", "./images/2/7.png", "./images/2/8.png", "./images/2/9.png", "./images/2/10.png", "./images/2/11.png", "./images/2/12.png", "./images/2/13.png", "./images/2/14.png", "./images/2/15.png", "./images/2/16.png", "./images/3/1.png", "./images/3/2.png", "./images/3/3.png", "./images/3/4.png", "./images/3/5.png", "./images/3/6.png", "./images/3/7.png", "./images/3/8.png", "./images/3/9.png", "./images/3/10.png", "./images/3/11.png", "./images/3/12.png", "./images/3/13.png", "./images/3/14.png", "./images/3/15.png", "./images/3/16.png", "./images/4/1.png", "./images/4/2.png", "./images/4/3.png", "./images/4/4.png", "./images/4/5.png", "./images/4/6.png", "./images/4/7.png", "./images/4/8.png", "./images/4/9.png", "./images/4/10.png", "./images/4/11.png", "./images/4/12.png", "./images/4/13.png", "./images/4/14.png", "./images/4/15.png", "./images/4/16.png", "./images/5/1.png", "./images/5/2.png", "./images/5/3.png", "./images/5/4.png", "./images/5/5.png", "./images/5/6.png", "./images/5/7.png", "./images/5/8.png", "./images/5/9.png", "./images/5/10.png", "./images/5/11.png", "./images/5/12.png", "./images/5/13.png", "./images/5/14.png", "./images/5/15.png", "./images/5/16.png", "./images/6/1.png", "./images/6/2.png", "./images/6/3.png", "./images/6/4.png", "./images/6/5.png", "./images/6/6.png", "./images/6/7.png", "./images/6/8.png", "./images/6/9.png", "./images/6/10.png", "./images/6/11.png", "./images/6/12.png", "./images/6/13.png", "./images/6/14.png", "./images/6/15.png", "./images/6/16.png", "./images/7/1.png", "./images/7/2.png", "./images/7/3.png", "./images/7/4.png", "./images/7/5.png", "./images/7/6.png", "./images/7/7.png", "./images/7/8.png", "./images/7/9.png", "./images/7/10.png", "./images/7/11.png", "./images/7/12.png", "./images/7/13.png", "./images/7/14.png", "./images/7/15.png", "./images/7/16.png", "./images/8/1.png", "./images/8/2.png", "./images/8/3.png", "./images/8/4.png", "./images/8/5.png", "./images/8/6.png", "./images/8/7.png", "./images/8/8.png", "./images/8/9.png", "./images/8/10.png", "./images/8/11.png", "./images/8/12.png", "./images/8/13.png", "./images/8/14.png", "./images/8/15.png", "./images/8/16.png", "./images/9/1.png", "./images/9/2.png", "./images/9/3.png", "./images/9/4.png", "./images/9/5.png", "./images/9/6.png", "./images/9/7.png", "./images/9/8.png", "./images/9/9.png", "./images/9/10.png", "./images/9/11.png", "./images/9/12.png", "./images/9/13.png", "./images/9/14.png", "./images/9/15.png", "./images/9/16.png", "./images/grass1.png", "./images/showMore.png", "./images/showMore2.png", "./images/child.png", "./images/grass2.png", "./images/grass3.png", "./images/3-bubble.png", "./images/3-atom.png", "./images/3-flask.png", "./images/3-star.png", "./images/5-line.png", "./images/tree1.png", "./images/tree2.png", "./images/tree3.png", "./images/house1.png", "./images/house2.png", "./images/house3.png", "./images/house4.png", "./images/house5.png"],
      "mousedown": false,
      "animationList": {},
      "layer": null
    },
    "created": function created() {
      var _this = this;

      // 获取到进度条Dom
      var ww = $(window).width();
      var wh = $(window).height(); // alert(`可视宽度:${ww}, 可视高度:${wh}`)
      // 创建画板区域并获取设备屏幕宽高

      var bodySize = this.calculationScene(this); // 预加载资源

      this.data.loader = PIXI.loader; // 加载GIF图

      this.data.loader.add("./images/sport.gif", {
        loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR,
        xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER,
        crossOrigin: ''
      });
      this.data.loader.add("./images/support.gif", {
        loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR,
        xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER,
        crossOrigin: ''
      }); // 群众

      this.data.loader.add("./images/masses.gif", {
        loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR,
        xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER,
        crossOrigin: ''
      }); // 手托着地球

      this.data.loader.add("./images/earth.gif", {
        loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR,
        xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER,
        crossOrigin: ''
      });
      this.data.loader.add(this.data.imgArr).onProgress.add(function (e) {
        // 资源加载完毕后显示one
        var progressDom = $('#progress')[0];

        if (progressDom) {
          progressDom.innerText = parseInt(e.progress) + '  %';
        }
      });
      this.data.container = new PIXI.Container();
      this.data.container.interactive = true; // 创建一个容器

      var one = new PIXI.Container();
      one.x = 0;
      one.y = 0; // 加载背景

      var bg1Image = this.methods.createSprite("./images/1.png", {
        width: bodySize.w,
        height: bodySize.h,
        x: 0,
        y: 0
      }); // 加载时钟

      var clockHeight = bodySize.h / 1.2; // 保持图片比例

      var clockWidth = clockHeight * 1.7801; // 加载指针1-point 图片宽度235px

      var pointHeight = bodySize.h / 4; // 加载蝴蝶 图片宽度:1347px 高度:730px 比例1.8452

      var butterflyHeight = bodySize.h / 1.3;
      var butterflyWidth = bodySize.w;
      var oneButterfly = this.methods.createSprite("./images/1-butterfly.png", {
        width: butterflyWidth,
        height: butterflyHeight,
        // 位置中间偏下10像素
        x: 0,
        y: bodySize.h * 0.1,
        z: -1
      });
      one.addChild(bg1Image, oneButterfly);
      this.addBind($("#clockDial"), function () {
        // 播放音乐
        $('#bgm')[0].play();
        $('#musicPlay').show();

        _this.openClock(one, oneButterfly, bg1Image);
      }); // 点击事件
      // 加载资源

      this.data.loader.load(function (progress, resources) {
        // 资源加载完毕事件
        _this.data.resources = resources; // console.log(progress)
        // let gifSprite = new GIF("./images/sport.gif", resources)
        // gifSprite.sprite.x = 10
        // gifSprite.sprite.y = 10
        // this.data.app.stage.addChild(gifSprite.sprite)
        // 蝴蝶飞舞动画

        _this.data.animationList.oneButterfly = TweenMax.fromTo(oneButterfly, 0.8, {
          y: _this.data.screenInfo.h * 0.1
        }, {
          y: _this.data.screenInfo.h * 0.104,
          ease: Linear.easeNone
        }).repeat(-1);

        _this.data.animationList.oneButterfly.play();

        _this.data.app.stage.addChild(one); // 隐藏掉加载页面


        $('#loadingBox').remove(); // 显示时钟页面 1.6481

        var clockDom = $('#clock')[0];
        var clockDomHeight = _this.data.screenInfo.h * 0.8;
        clockDom.style.display = 'block'; // 根据比例计算时钟合适高度

        clockDom.style.width = clockDomHeight * 1.6481 + 'px';
        clockDom.style.height = clockDomHeight + 'px';
      });
      var shareDom = document.getElementById("shareBox");

      shareDom.ontouchend = function () {
        $('#qr')[0].style.display = 'block';
        shareDom.style.display = 'none';
        return false;
      }; // 屏幕方向改变事件


      window.onorientationchange = function () {
        location.reload();
      };
    },
    "methods": {
      "createSprite": function createSprite(name, opt) {
        // 获取缩放比例
        var devicePixelRatio = window.devicePixelRatio || 1; // console.log(devicePixelRatio)

        var newSprite = new PIXI.Sprite.fromImage(name, 1, devicePixelRatio);

        if (opt) {
          for (var key in opt) {
            // console.log(opt[key])
            newSprite[key] = opt[key];
          }
        }

        return newSprite;
      },
      "smooth": function smooth(baseValue, minValue, nowValue, step) {
        // console.log(nowValue, baseValue + (nowValue - minValue) * step)
        return baseValue + (nowValue - minValue) * step;
      },
      "closeShowText": function closeShowText() {
        this.domList.showTextBox.style.display = 'none';
      },
      "closeMusic": function closeMusic() {
        $('#bgm')[0].pause();
        $('#musicClose').show();
        $('#musicPlay').hide();
      },
      "palyMusic": function palyMusic() {
        $('#bgm')[0].play();
        $('#musicClose').hide();
        $('#musicPlay').show();
      }
    },
    "calculationScene": function calculationScene() {
      var _this2 = this;

      // 获取屏幕宽高
      var ww = $(window).width();
      var wh = $(window).height();
      console.log("\u53EF\u89C6\u5BBD\u5EA6:".concat(ww, ", \u53EF\u89C6\u9AD8\u5EA6:").concat(wh)); // alert(`可视宽度:${ww}, 可视高度:${wh}`)

      if (ww < wh) {
        console.log('竖屏');
        window.document.body.style.width = "".concat(wh, "px");
        window.document.body.style.height = "".concat(ww, "px");
        window.document.body.classList.add('horizontal');
        window.document.body.style.left = "calc(50% - ".concat(wh / 2, "px)");
        window.document.body.style.top = "calc(50% - ".concat(ww / 2, "px)");
        window.document.body.style.display = 'block'; // 获取浏览器缩放比例

        var _devicePixelRatio = window.devicePixelRatio || 1; // 创建画布


        if (!this.data.app) {
          setTimeout(function () {
            _this2.data.app = new PIXI.Application($(window).height(), $(window).width(), {
              backgroundColor: '0xc8c9c9',
              resolution: _devicePixelRatio
            });
            _this2.data.app.view.style.width = "".concat(wh, "px");
            _this2.data.app.view.style.height = "".concat(ww, "px");
            $('#main').append(_this2.data.app.view);
            _this2.data.screenInfo = {
              w: wh,
              h: ww,
              transverse: false
            };
          }, 0);
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
        window.document.body.style.display = 'block'; // 创建画布

        if (!this.data.app) {
          setTimeout(function () {
            // console.log(devicePixelRatio)
            _this2.data.app = new PIXI.Application($(window).width(), $(window).height(), {
              backgroundColor: '0xc8c9c9',
              resolution: devicePixelRatio
            });
            _this2.data.app.view.style.width = "".concat(ww, "px");
            _this2.data.app.view.style.height = "".concat(wh, "px");
            $('#main').append(_this2.data.app.view);
            _this2.data.transverse = true;
            _this2.data.screenInfo = {
              w: ww,
              h: wh,
              transverse: true
            };
          }, 0);
        }

        return {
          w: ww,
          h: wh,
          transverse: true
        };
      }
    },
    "openClock": function openClock(one, oneButterfly, bg1Image) {
      var _this3 = this;

      // 移除对时钟的所有事件监听
      $("#clockDial").unbind();

      var _loop = function _loop(i) {
        setTimeout(function () {
          $('#onePoint')[0].style.transform = "rotate(".concat(3 * i, "deg)");
        }, i * 10);
      };

      for (var i = 0; i < 35; i++) {
        _loop(i);
      }

      setTimeout(function () {
        $('#clockDial')[0].classList.add("flip-play");
        $("#clock").off("touchmove"); // 销毁蝴蝶
        // 停止蝴蝶动画

        _this3.data.animationList.oneButterfly.kill(); // 销毁蝴蝶


        oneButterfly.destroy();
        setTimeout(function () {
          $('#main')[0].classList.add('scale-play');
          $('#clock')[0].classList.add('scale-play-forwards'); // 销毁指针

          setTimeout(function () {
            // 动画完毕销毁首页背景
            bg1Image.destroy();
            setTimeout(function () {
              _this3.data.app.stage.removeChild(one);
            }, 0); // 销毁tocuh监听

            $("#clock").off("touchstart");
            $('#clock').hide(800);
            console.log('首页已销毁'); // 开启第二部分

            _this3.two();
          }, 800);
        }, 1000);
      }, 500);
    },
    "two": function two() {
      var _this4 = this;

      var bodySize = this.data.screenInfo;
      console.log('第二部分!');
      this.data.twoContainer = new PIXI.Container();
      this.data.twoContainer.x = 0;
      this.data.twoContainer.y = 0;
      this.data.twoContainer.width = this.data.screenInfo.w; // ----------------------------- 加载文字 -----------------------------
      // this.data.app.stage.addChild(richText)
      // 加载小人 比例

      var peopleH = this.data.screenInfo.h * 0.2;
      this.data.people = this.methods.createSprite("./images/1/1.png", {
        width: 30 * (this.data.screenInfo.w / 1024),
        height: 120 * (this.data.screenInfo.h / 768),
        x: 50,
        y: 0
      }); // 不断地切换小人的皮肤

      var peopleIndex = 16;
      setInterval(function () {
        // 如果正在移动才切换小人材质
        if (peopleIndex <= 0) {
          peopleIndex = 16;
        }

        var groupID = _this4.data.peopleImgID > 9 ? 9 : _this4.data.peopleImgID;
        var texture = PIXI.Texture.fromFrame("./images/".concat(groupID, "/").concat(peopleIndex, ".png"));
        peopleIndex--;
        _this4.data.people.texture = texture;
      }, 100); // 第二张背景图

      var bg2Image = this.methods.createSprite("./images/2.png", {
        width: this.data.screenInfo.w + 1,
        height: this.data.screenInfo.h,
        x: 0,
        y: 0
      }); // 向左箭头 5.032

      var leftArrowH = bodySize.h * 0.08;
      var leftArrow = this.methods.createSprite("./images/1-hand.png", {
        width: leftArrowH,
        height: leftArrowH,
        x: bodySize.w * 0.6 - leftArrowH / 2,
        y: bodySize.h * 0.4 - leftArrowH / 2
      });
      var leftArrowA = TweenMax.fromTo(leftArrow, 4, {
        x: bodySize.w * 0.6 - leftArrowH / 2
      }, {
        x: bodySize.w * 0.43 - leftArrowH / 2
      }).repeat(-1);
      leftArrowA.play(); // 第三张背景图

      var bg3Image = this.methods.createSprite("./images/3.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w,
        y: 0
      }); // 熊孩子 0.63

      var childH = this.data.screenInfo.h * 0.55;
      var child = this.methods.createSprite("./images/child.png", {
        width: childH * 0.63,
        height: childH,
        x: this.data.screenInfo.w * 1.55 - childH * 0.63 / 2,
        y: this.data.screenInfo.h - childH
      }); // 第四章背景图

      var bg4Image = this.methods.createSprite("./images/4.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 2,
        y: 0
      }); // 第五张背景图

      var bg5Image = this.methods.createSprite("./images/5.png", {
        width: this.data.screenInfo.w,
        height: this.data.screenInfo.h,
        x: this.data.screenInfo.w * 3,
        y: 0
      }); // 第五张背景图

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
      bgshare.buttonMode = true; // 呼唤朋友按钮 3.982

      var shareBTH = this.data.screenInfo.h * 0.1;
      var shareBT = this.methods.createSprite("./images/share-button.png", {
        width: shareBTH * 3.982,
        height: shareBTH,
        x: this.data.screenInfo.w * 10.63 - shareBTH * 3.982 / 2,
        y: this.data.screenInfo.h * 0.82
      }); // 设置可交互

      shareBT.interactive = true;
      shareBT.buttonMode = true;
      this.addBind(shareBT, function () {
        $('#shareBox')[0].style.display = 'block';
        setTimeout(function () {
          $('#qr')[0].style.display = 'none';
        }, 0);
        return false;
      }); // 再看一次按钮 3.982

      var againBTH = this.data.screenInfo.h * 0.1;
      var againBT = this.methods.createSprite("./images/again.png", {
        width: againBTH * 3.982,
        height: againBTH,
        x: this.data.screenInfo.w * 10.37 - againBTH * 3.982 / 2,
        y: this.data.screenInfo.h * 0.82
      }); // 设置可交互

      againBT.interactive = true;
      againBT.buttonMode = true;
      this.addBind(againBT, function () {
        location.reload();
      }); // ------------------------------------------- 云 -------------------------------------------
      // 3云 比例6.397

      var cloud3H = bodySize.h * 0.25;
      var cloud3 = this.methods.createSprite("./images/3-cloud.png", {
        width: cloud3H * 6.397,
        height: cloud3H,
        // 位置中间靠上
        x: bodySize.w + bodySize.w * 0.05,
        y: bodySize.h * 0.1
      }); // const cloud3AnimationList = new TweenMax(cloud3, 2, {
      //   x: bodySize.w + (bodySize.w * 0.05) + 20,
      //   repeat:-1,
      //   yoyo:true,
      // })
      // cloud3AnimationList.play()
      // 4云 比例2.1159

      var cloud4H = bodySize.h * 0.8;
      var cloud4 = this.methods.createSprite("./images/4-cloud.png", {
        width: cloud4H * 2.1159,
        height: cloud4H,
        // 位置中间靠上
        x: bodySize.w * 2,
        y: 0
      });
      var cloud4AnimationList = new TweenMax(cloud4, 2, {
        x: bodySize.w * 2 + 20,
        repeat: -1,
        yoyo: true
      });
      cloud4AnimationList.play(); // cloud5 比例4.7467

      var cloud5H = bodySize.h * 0.3;
      var cloud5 = this.methods.createSprite("./images/5-cloud.png", {
        width: cloud5H * 4.7467,
        height: cloud5H,
        x: bodySize.w * 3 + bodySize.w * 0.05,
        y: bodySize.h * 0.1
      }); // const cloud5AnimationList = new TweenMax(cloud5, 2, {
      //   x: bodySize.w * 3 + (bodySize.w * 0.05) + 20,
      //   repeat:-1,
      //   yoyo:true,
      // })
      // cloud5AnimationList.play()
      // 6云 比例2.0727

      var cloud6H = bodySize.h * 0.6;
      var cloud6 = this.methods.createSprite("./images/6-cloud.png", {
        width: cloud6H * 2.0727,
        height: cloud6H,
        // 位置中间靠上
        x: bodySize.w * 4 + bodySize.w * 0.05,
        y: 0
      });
      var cloud6AnimationList = new TweenMax(cloud6, 2, {
        x: bodySize.w * 4 + 20,
        repeat: -1,
        yoyo: true
      });
      cloud6AnimationList.play(); // cloud7 比例5.0339

      var cloud7H = bodySize.h * 0.3;
      var cloud7 = this.methods.createSprite("./images/7-cloud.png", {
        width: cloud7H * 5.0339,
        height: cloud7H,
        x: bodySize.w * 5 + bodySize.w * 0.05,
        y: 0
      }); // cloud8 比例2.5685

      var cloud8H = bodySize.h * 0.6;
      var cloud8 = this.methods.createSprite("./images/8-cloud.png", {
        width: cloud8H * 2.5685,
        height: cloud8H,
        // 位置中间靠上
        x: bodySize.w * 6 + bodySize.w * 0.05,
        y: bodySize.h * 0.05
      });
      var cloud8AnimationList = new TweenMax(cloud8, 2, {
        x: bodySize.w * 6 + bodySize.w * 0.05 + 20,
        repeat: -1,
        yoyo: true
      });
      cloud8AnimationList.play(); // cloud9 比例3.8078

      var cloud9H = bodySize.h * 0.45;
      var cloud9 = this.methods.createSprite("./images/9-cloud.png", {
        width: cloud9H * 3.8078,
        height: cloud9H,
        // 位置中间靠上
        x: bodySize.w * 7 + bodySize.w * 0.05,
        y: bodySize.h * 0.15
      }); // cloud10 比例2.1029

      var cloud10H = bodySize.h * 0.6;
      var cloud10 = this.methods.createSprite("./images/10-cloud.png", {
        width: cloud10H * 2.1029,
        height: cloud10H,
        // 位置中间靠上
        x: bodySize.w * 8 + bodySize.w * 0.2,
        y: bodySize.h * 0.15
      });
      var cloud10AnimationList = new TweenMax(cloud10, 2, {
        x: bodySize.w * 8 + bodySize.w * 0.2 + 20,
        repeat: -1,
        yoyo: true
      });
      cloud10AnimationList.play(); // 飘散的花瓣运动 比例1.7130

      var petal11H = bodySize.h * 0.8;
      var petal11 = this.methods.createSprite("./images/11-petal.png", {
        width: petal11H * 1.7130,
        height: petal11H,
        // 位置中间靠上
        x: bodySize.w * 9 + bodySize.w * 0.2,
        y: bodySize.h * 0.15
      }); // 分享页花瓣 比例1.8293

      var petal12H = bodySize.h * 0.8;
      var petal12 = this.methods.createSprite("./images/share-petal-colour.png", {
        width: petal12H * 1.8293,
        height: petal12H,
        // 位置中间靠上
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
      petal12AnimationList.play(); // ------------------------------------------- 亮光 -------------------------------------------
      // 第三张光 比例1

      var threeLightHeight = bodySize.h / 3;
      var threeLight = this.methods.createSprite("./images/3-light.png", {
        width: threeLightHeight,
        height: threeLightHeight,
        // 位置中间靠上
        x: bodySize.w + bodySize.w * 0.62 - threeLightHeight / 2,
        y: bodySize.h * 0.1
      }); // 设置可交互

      threeLight.interactive = true;
      threeLight.buttonMode = true; // 第三张图 亮光触摸事件

      this.addBind(threeLight, function () {
        // 修改背景颜色
        // this.data.app.renderer.backgroundColor = "0x2a99a5"
        gradientColor(_this4.data.app.renderer, '#c8c9c9', '#2a99a5', 10);
        bg3Image.destroy(); // 重新生成新的背景图
        // 第三张背景图

        var newbg3I = _this4.methods.createSprite('./images/3-colour.png', {
          width: _this4.data.screenInfo.w,
          height: _this4.data.screenInfo.h,
          x: _this4.data.screenInfo.w,
          y: 0
        }); // 销毁动画


        threeLightAnimationList.kill(); // 销毁掉亮光

        threeLight.destroy(); // 销毁掉云

        cloud3.destroy(); // cloud3AnimationList.kill()
        // 小男孩想象的东西 1.7756

        var thoughtH = bodySize.h * 0.4;

        var thought = _this4.methods.createSprite("./images/3-thought.png", {
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
        var thoughtStartA = TweenMax.fromTo(thought, 0.6, {
          x: bodySize.w * 1.6,
          width: 0,
          y: bodySize.h * 0.45,
          height: 0
        }, {
          x: bodySize.w * 1.4,
          y: 0,
          width: thoughtH * 1.7756,
          height: thoughtH
        });
        thoughtStartA.play(); // 气泡 3.5218

        var bubbleH = bodySize.h * 0.35;

        var bubble = _this4.methods.createSprite("./images/3-bubble.png", {
          width: bubbleH * 3.5218,
          height: bubbleH,
          x: bodySize.w * 1.25,
          y: bodySize.h * 0.02
        });

        var bubbleAnimationList = new TweenMax(bubble, 2, {
          y: bodySize.h * 0.02 + 5,
          repeat: -1,
          yoyo: true
        });
        bubbleAnimationList.play();
        var bubbleStartA = TweenMax.fromTo(bubble, 0.6, {
          x: bodySize.w * 1.6,
          width: 0,
          y: bodySize.h * 0.45,
          height: 0
        }, {
          x: bodySize.w * 1.25,
          y: 0.02,
          width: bubbleH * 3.5218,
          height: bubbleH
        });
        bubbleStartA.play(); // 设置可滚动的区域

        _this4.setShowPageNumber(4); // 小孩想到的星星


        var startH = bodySize.h * 0.45;

        var start = _this4.methods.createSprite("./images/3-start.png", {
          width: startH * 2.5459,
          height: startH,
          x: bodySize.w + bodySize.w * 0.3,
          y: bodySize.h * 0.05
        });

        var startAnimationList = TweenMax.fromTo(start, 4, {
          alpha: 0
        }, {
          alpha: 1
        }).repeat(-1);
        startAnimationList.play(); // 原子

        var atomH = bodySize.h * 0.1;

        var atom = _this4.methods.createSprite("./images/3-atom.png", {
          width: atomH,
          height: atomH,
          x: bodySize.w + bodySize.w * 0.42,
          y: bodySize.h * 0.18
        });

        atom.anchor.x = 0.5;
        atom.anchor.y = 0.5;
        var atomStartA = TweenMax.fromTo(atom, 0.6, {
          x: bodySize.w * 1.6,
          y: bodySize.h * 0.45
        }, {
          x: bodySize.w + bodySize.w * 0.42,
          y: bodySize.h * 0.18
        }).repeat(0);
        atomStartA.play();
        var atomAnimationList = TweenMax.fromTo(atom.scale, 1, {
          x: 0.4,
          y: 0.4
        }, {
          x: 0.5,
          y: 0.5
        }).repeat(-1);
        atomAnimationList.play(); // 烧瓶

        var flaskH = bodySize.h * 0.12;

        var flask = _this4.methods.createSprite("./images/3-flask.png", {
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
        var flaskStartA = TweenMax.fromTo(flask, 0.6, {
          x: bodySize.w * 1.6,
          y: bodySize.h * 0.45
        }, {
          x: bodySize.w * 1.58,
          y: bodySize.h * 0.43
        });
        flaskStartA.play(); // 星球 1.2352

        var starH = bodySize.h * 0.12;

        var star = _this4.methods.createSprite("./images/3-star.png", {
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
        var starStartA = TweenMax.fromTo(star, 0.6, {
          x: bodySize.w * 1.6,
          y: bodySize.h * 0.45
        }, {
          x: bodySize.w * 1.64,
          y: bodySize.h * 0.2
        });
        starStartA.play(); // 3-显示更多

        var showMoreH = bodySize.h * 0.1;

        var showMore = _this4.methods.createSprite("./images/showMore.png", {
          width: showMoreH,
          height: showMoreH,
          x: bodySize.w * 1.22,
          y: bodySize.h * 0.52
        });

        var showMoreA = TweenMax.fromTo(showMore, 1.2, {
          alpha: 0.2
        }, {
          alpha: 1
        }).repeat(-1);
        showMoreA.play(); // 3-显示更多 设置可交互

        showMore.interactive = true;
        showMore.buttonMode = true; // 第三张图 显示更多触摸事件

        _this4.addBind(showMore, function () {
          setTimeout(function () {
            _this4.domList.showTextBox.style.left = "25%";
            _this4.domList.showTextBox.style.top = "42%";
            _this4.domList.showTextBox.style.bottom = '';
            _this4.domList.showTextBox.style.right = '';
            _this4.domList.textBoxContent.innerText = '中国有你，你有未来。阳光普照，让个体生命怒放。';
            _this4.domList.showTextBox.style.display = 'block';
          }, 0);
        });

        _this4.data.twoContainer.addChild(newbg3I, thought, start, atom, bubble, flask, star, showMore); // 3-小人继续移动 ssd


        _this4.data.clickPeopleRunning = true;

        var _loop2 = function _loop2(i) {
          setTimeout(function () {
            _this4.data.people.x = _this4.data.screenInfo.w * (1.11 + i);

            if (i < 0.75) {
              // this.data.people.x = this.data.screenInfo.w * (1.11 + i)
              _this4.data.people.y = _this4.data.screenInfo.h * _this4.methods.smooth(0.6242, 199.7, i * 1000, 0.00002);
            } else {
              _this4.data.people.y = _this4.data.screenInfo.h * _this4.methods.smooth(0.6351, 690.233, i * 1000, -0.0006);
            } // 允许滚动


            if (i >= 0.84) {
              _this4.data.clickPeopleRunning = false;
              _this4.data.peopleCanMoveing = false;
            }
          }, i * 4000 - 2300);
        };

        for (var i = 0.407; i < 0.85; i += 0.01) {
          _loop2(i);
        } // 设置可滚动的区域


        _this4.setShowPageNumber(4);
      }); // 第五张光 比例1.6582

      var fiveLightHeight = bodySize.h / 8;
      var fiveLight = this.methods.createSprite("./images/5-light.png", {
        width: fiveLightHeight * 1.6582,
        height: fiveLightHeight,
        // 位置中间靠上
        x: bodySize.w * 3 + bodySize.w * 0.585 - fiveLightHeight / 2,
        y: bodySize.h * 0.57
      }); // 设置可交互

      fiveLight.interactive = true;
      fiveLight.buttonMode = true; // 第五张光 亮光触摸事件

      this.addBind(fiveLight, function () {
        bg5Image.texture = PIXI.Texture.fromFrame('./images/5-colour.png'); // 第五张背景图

        var bg5Line = _this4.methods.createSprite("./images/5-line.png", {
          width: _this4.data.screenInfo.w,
          height: _this4.data.screenInfo.h,
          x: _this4.data.screenInfo.w * 3,
          y: 0
        }); // 修改背景颜色


        gradientColor(_this4.data.app.renderer, '#c8c9c9', '#59d3cb', 10); // 销毁动画

        fiveLightHeightAnimationList.kill(); // 销毁掉亮光

        fiveLight.destroy(); // 销毁云

        cloud5.destroy(); // cloud5AnimationList.kill()
        // 设置可滚动的区域

        _this4.setShowPageNumber(6); // 树1在摇摆 0.6937


        var tree1H = bodySize.h * 0.18;

        var tree1 = _this4.methods.createSprite("./images/tree1.png", {
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
        tree1AnimationList.play(); // 左边的主树叶 0.5323

        var tree2H = bodySize.h * 0.50;

        var tree2 = _this4.methods.createSprite("./images/tree2.png", {
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
        tree2AnimationList.play(); // 右边主叶子 0.8517

        var tree3H = bodySize.h * 0.50;

        var tree3 = _this4.methods.createSprite("./images/tree3.png", {
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
        tree3AnimationList.play(); // 房子拔地而起 0.5904

        var house1H = bodySize.h * 0.50;

        var house1 = _this4.methods.createSprite("./images/house1.png", {
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
        house1AnimationList.play(); // 房子拔地而起 0.49011

        var house2H = bodySize.h * 0.40;

        var house2 = _this4.methods.createSprite("./images/house2.png", {
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
        house2AnimationList.play(); // 房子拔地而起 0.5904

        var house3H = bodySize.h * 0.42;

        var house3 = _this4.methods.createSprite("./images/house3.png", {
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
        house3AnimationList.play(); // 1.034

        var house4H = bodySize.h * 0.3;

        var house4 = _this4.methods.createSprite("./images/house4.png", {
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
        house4AnimationList.play(); // 1.4926

        var house5H = bodySize.h * 0.3;

        var house5 = _this4.methods.createSprite("./images/house5.png", {
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
        house5AnimationList.play(); // 5-显示更多

        var showMoreH = bodySize.h * 0.1;

        var showMore = _this4.methods.createSprite("./images/showMore.png", {
          width: showMoreH,
          height: showMoreH,
          x: bodySize.w * 3.27,
          y: bodySize.h * 0.16
        });

        var showMoreA = TweenMax.fromTo(showMore, 1.2, {
          alpha: 0.2
        }, {
          alpha: 1
        }).repeat(-1);
        showMoreA.play(); // 显示更多 设置可交互

        showMore.interactive = true;
        showMore.buttonMode = true; // 第三张图 显示更多触摸事件

        _this4.addBind(showMore, function () {
          setTimeout(function () {
            _this4.domList.showTextBox.style.left = "34%";
            _this4.domList.showTextBox.style.top = "20%";
            _this4.domList.showTextBox.style.bottom = '';
            _this4.domList.showTextBox.style.right = '';
            _this4.domList.textBoxContent.innerText = '“人”、“地”和谐发展，城市有温度，人民更幸福。';
            _this4.domList.showTextBox.style.display = 'block';
          }, 0);
        });

        _this4.data.twoContainer.addChild(bg5Line, house4, house1, house5, house3, house2, bg5Image, tree1, tree2, tree3, showMore); // 5-小人继续移动


        _this4.data.clickPeopleRunning = true;

        var _loop3 = function _loop3(i) {
          setTimeout(function () {
            _this4.data.people.x = _this4.data.screenInfo.w * (3.11 + i);
            _this4.data.people.y = _this4.data.screenInfo.h * _this4.methods.smooth(0.3737, 0, i * 1000, -0.00006); // 允许滚动

            if (i >= 0.7) {
              _this4.data.peopleCanMoveing = false;
              _this4.data.clickPeopleRunning = false;
            }
          }, i * 4000 - 2000);
        };

        for (var i = 0.52; i < 0.72; i += 0.005) {
          _loop3(i);
        }
      }); // 第七张图 比例:0.7421

      var sevenLightHeight = bodySize.h / 5;
      var sevenLight = this.methods.createSprite("./images/7-light.png", {
        width: sevenLightHeight * 0.7421,
        height: sevenLightHeight,
        // 位置中间靠上
        x: bodySize.w * 5 + bodySize.w * 0.33 - sevenLightHeight / 2,
        y: bodySize.h * 0.57
      }); // 设置可交互

      sevenLight.interactive = true;
      sevenLight.buttonMode = true; // 第七张光 亮光触摸事件

      this.addBind(sevenLight, function () {
        // 修改背景颜色
        gradientColor(_this4.data.app.renderer, '#c8c9c9', '#dccfbc', 10); // this.data.app.renderer.backgroundColor = "0xdccfbc"

        bg7Image.texture = PIXI.Texture.fromFrame('./images/7-colour.png'); // 销毁动画

        sevenLightHeightAnimationList.kill(); // 销毁掉亮光

        sevenLight.destroy(); // 设置可滚动的区域

        _this4.setShowPageNumber(8);

        var cloud7AnimationList = new TweenMax(cloud7, 2, {
          x: bodySize.w * 5 + bodySize.w * 0.05 + 20,
          repeat: -1,
          yoyo: true
        });
        cloud7AnimationList.play(); // 从下面生出政府的手 0.8511

        var supportH = bodySize.h * 0.7;
        var support = new GIF("./images/support.gif", _this4.data.resources);
        support.sprite.width = supportH * 0.8511;
        support.sprite.height = supportH;
        support.sprite.x = bodySize.w * 5 - supportH * 0.8511 / 2 + bodySize.w * 0.5;
        support.sprite.y = bodySize.h;
        var supportAnimationList = TweenMax.fromTo(support.sprite, 1.5, {
          y: bodySize.h
        }, {
          y: bodySize.h - supportH
        });
        supportAnimationList.play();
        setTimeout(function () {
          support.play();
        }, 500); // 7-显示更多

        var showMoreH = bodySize.h * 0.1;

        var showMore = _this4.methods.createSprite("./images/showMore.png", {
          width: showMoreH,
          height: showMoreH,
          x: bodySize.w * 5.29,
          y: bodySize.h * 0.30
        });

        var showMoreA = TweenMax.fromTo(showMore, 1.2, {
          alpha: 0.2
        }, {
          alpha: 1
        }).repeat(-1);
        showMoreA.play(); // 显示更多 设置可交互

        showMore.interactive = true;
        showMore.buttonMode = true; // 第三张图 显示更多触摸事件

        _this4.addBind(showMore, function () {
          setTimeout(function () {
            _this4.domList.showTextBox.style.left = "32%";
            _this4.domList.showTextBox.style.top = "16%";
            _this4.domList.showTextBox.style.bottom = '';
            _this4.domList.showTextBox.style.right = '';
            _this4.domList.textBoxContent.innerText = '从容之中见温馨，夕阳的壮美比朝霞更浑厚。';
            _this4.domList.showTextBox.style.display = 'block';
          }, 0);
        });

        _this4.data.twoContainer.addChild(support.sprite, showMore); // 允许滚动
        // 7-小人继续移动


        _this4.data.clickPeopleRunning = true;

        var _loop4 = function _loop4(i) {
          setTimeout(function () {
            _this4.data.people.x = _this4.data.screenInfo.w * (5.11 + i);

            if (i < 0.42) {
              _this4.data.people.y = _this4.data.screenInfo.h * _this4.methods.smooth(0.36, 0, i * 1000, -0.00001); // console.log(this.data.people.y, this.methods.smooth(0.36, 0, i * 1000, -0.00001))
            } else {
              _this4.data.people.y = _this4.data.screenInfo.h * _this4.methods.smooth(0.3558, 420, i * 1000, 0.00025);
            } // 允许滚动


            if (i >= 0.7) {
              _this4.data.peopleCanMoveing = false;
              _this4.data.clickPeopleRunning = false;
            }
          }, i * 4000 - 800);
        };

        for (var i = 0.2; i < 0.72; i += 0.005) {
          _loop4(i);
        }
      }); // 第九张图 比例:1

      var Light9Height = bodySize.h / 5;
      var Light9 = this.methods.createSprite("./images/9-light.png", {
        width: Light9Height,
        height: Light9Height,
        // 位置中间靠上
        x: bodySize.w * 7 + bodySize.w * 0.57 - sevenLightHeight / 2,
        y: bodySize.h * 0.065
      }); // 设置可交互

      Light9.interactive = true;
      Light9.buttonMode = true; // 第五张光 亮光触摸事件

      this.addBind(Light9, function () {
        // 修改背景颜色
        gradientColor(_this4.data.app.renderer, '#c8c9c9', '#f6df60', 10); // this.data.app.renderer.backgroundColor = "0xfae768"

        bg9Image.texture = PIXI.Texture.fromFrame('./images/9-colour.png'); // 销毁动画

        Light9AnimationList.kill(); // 销毁掉亮光

        Light9.destroy(); // 设置可滚动的区域

        _this4.setShowPageNumber(10);

        var cloud9AnimationList = new TweenMax(cloud9, 2, {
          x: bodySize.w * 7 + bodySize.w * 0.05 + 20,
          repeat: -1,
          yoyo: true
        });
        cloud9AnimationList.play(); // 9-显示更多

        var showMoreH = bodySize.h * 0.1;

        var showMore = _this4.methods.createSprite("./images/showMore2.png", {
          width: showMoreH,
          height: showMoreH,
          x: bodySize.w * 7.75,
          y: bodySize.h * 0.05
        });

        var showMoreA = TweenMax.fromTo(showMore, 1.2, {
          alpha: 0.2
        }, {
          alpha: 1
        }).repeat(-1);
        showMoreA.play(); // 显示更多 设置可交互

        showMore.interactive = true;
        showMore.buttonMode = true; // 显示更多触摸事件

        _this4.addBind(showMore, function () {
          setTimeout(function () {
            _this4.domList.showTextBox.style.right = "22%";
            _this4.domList.showTextBox.style.top = "18%";
            _this4.domList.showTextBox.style.bottom = '';
            _this4.domList.showTextBox.style.left = '';
            _this4.domList.textBoxContent.innerText = '一头系着贫，一头系着富，把社会捆绑结实。';
            _this4.domList.showTextBox.style.display = 'block';
          }, 0);
        }); // 群众向上拉 1.22


        var massesH = bodySize.h * 0.65;
        var masses = new GIF("./images/masses.gif", _this4.data.resources);
        masses.sprite.width = massesH * 1.22;
        masses.sprite.height = massesH;
        masses.sprite.x = bodySize.w * 7.56 - massesH * 1.22 / 2;
        masses.sprite.y = bodySize.h * 0.555 - massesH / 2;

        _this4.data.twoContainer.addChild(showMore, masses.sprite);

        setTimeout(function () {
          masses.play();
        }, 500); // 允许滚动

        var _loop5 = function _loop5(i) {
          setTimeout(function () {
            _this4.data.people.x = _this4.data.screenInfo.w * (7.11 + i);

            if (i < 0.4) {
              _this4.data.people.y = _this4.data.screenInfo.h * _this4.methods.smooth(0.5, 187.59, i * 1000, -0.00002); // console.log(this.data.people.y, this.methods.smooth(0.5, 187.59, i * 1000, -0.00002))
            } else {
              _this4.data.people.y = _this4.data.screenInfo.h * _this4.methods.smooth(0.51, 185.9, i * 1000, 0.00001);
            } // 允许滚动


            if (i >= 0.7) {
              _this4.data.peopleCanMoveing = false;
              _this4.data.clickPeopleRunning = false;
            }
          }, i * 4000 - 800);
        };

        for (var i = 0.36; i < 0.85; i += 0.005) {
          _loop5(i);
        }
      }); // 第11张图 大柚子 比例:1

      var Light11Height = bodySize.h / 1.5; // console.log((bodySize.h / bodySize.w))

      var Light11 = this.methods.createSprite("./images/11-light.png", {
        width: Light11Height,
        height: Light11Height,
        // 位置中间靠上
        x: bodySize.w * 9 + bodySize.w * 0.39 - sevenLightHeight / 2,
        y: bodySize.h * 0.09
      }); // 拖着的手

      var handH = bodySize.h / 1.3;
      var hand = this.methods.createSprite("./images/hand.png", {
        width: handH,
        height: handH,
        // 位置中间靠上
        x: bodySize.w * 9 + bodySize.w * 0.35 - sevenLightHeight / 2,
        y: bodySize.h * 0.065
      }); // 设置可交互

      Light11.interactive = true;
      Light11.buttonMode = true; // 第五张光 亮光触摸事件

      this.addBind(Light11, function () {
        // 修改背景颜色
        _this4.data.app.renderer.backgroundColor = "0xcfdee5";
        bg11Image.texture = PIXI.Texture.fromFrame('./images/11-colour.png'); // 替换彩色花瓣材质

        petal11.texture = PIXI.Texture.fromFrame('./images/11-petal-colour.png'); // 销毁动画

        Light11AnimationList.kill(); // 销毁掉亮光

        Light11.destroy(); // 销毁掉手

        hand.destroy(); // 设置可滚动的区域

        _this4.setShowPageNumber(11); // 从左面生出树叶 0.8106


        var grass1H = bodySize.h * 0.9;

        var grass1 = _this4.methods.createSprite("./images/grass1.png", {
          width: grass1H * 0.8106,
          height: grass1H,
          x: bodySize.w * 9,
          y: bodySize.h * 0.1
        });

        var grass1AnimationList = TweenMax.fromTo(grass1, 1, {
          x: bodySize.w * 9 - grass1H * 0.8106
        }, {
          x: bodySize.w * 9
        });
        grass1AnimationList.play(); // 从上生出树叶 2.4909

        var grass2H = bodySize.h * 0.4;

        var grass2 = _this4.methods.createSprite("./images/grass2.png", {
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
        grass2AnimationList.play(); // 从右下出的树叶 1.5402

        var grass3H = bodySize.h * 0.2;

        var grass3 = _this4.methods.createSprite("./images/grass3.png", {
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
        grass3AnimationList.play(); // 树叶摆动效果

        grass3.anchor.x = 0.5;
        grass3.anchor.y = 1;
        var grass3AnimationList2 = new TweenMax(grass3, 2, {
          y: bodySize.h * 1.025,
          repeat: -1,
          yoyo: true
        });
        grass3AnimationList2.play();
        var petal11AnimationList = TweenMax.fromTo(petal11, 8, {
          x: bodySize.w * 9 + bodySize.w * 0.2 - 20,
          y: bodySize.h * 0.15 - 20
        }, {
          x: bodySize.w * 9 + bodySize.w * 0.2 + 20,
          y: bodySize.h * 0.15 + 40
        }).repeat(-1);
        petal11AnimationList.play(); // 11-显示更多

        var showMoreH = bodySize.h * 0.1;

        var showMore = _this4.methods.createSprite("./images/showMore2.png", {
          width: showMoreH,
          height: showMoreH,
          x: bodySize.w * 9.80,
          y: bodySize.h * 0.82
        });

        var showMoreA = TweenMax.fromTo(showMore, 1.2, {
          alpha: 0.2
        }, {
          alpha: 1
        }).repeat(-1);
        showMoreA.play(); // 显示更多 设置可交互

        showMore.interactive = true;
        showMore.buttonMode = true; // 显示更多触摸事件

        _this4.addBind(showMore, function () {
          setTimeout(function () {
            _this4.domList.showTextBox.style.top = '';
            _this4.domList.showTextBox.style.right = '';
            _this4.domList.showTextBox.style.left = "40%";
            _this4.domList.showTextBox.style.bottom = "13%";
            _this4.domList.textBoxContent.innerText = '爱心缔造家园，践行绿色生活，共创美丽中国。';
            _this4.domList.showTextBox.style.display = 'block';
          }, 0);
        }); // 11-手托着地球 1.1212


        var earthH = bodySize.h * 0.7;
        var earth = new GIF("./images/earth.gif", _this4.data.resources, true);
        earth.sprite.width = earthH * 1.22;
        earth.sprite.height = earthH;
        earth.sprite.x = bodySize.w * 9.5 - earthH * 1.22 / 2;
        earth.sprite.y = bodySize.h * 0.5 - earthH / 2;
        setTimeout(function () {
          earth.play();
        }, 500);

        _this4.data.twoContainer.addChild(earth.sprite, grass1, grass2, grass3, showMore); // 13-小人继续移动


        _this4.data.clickPeopleRunning = true;

        var _loop6 = function _loop6(i) {
          setTimeout(function () {
            _this4.data.people.x = _this4.data.screenInfo.w * (9.11 + i);
            _this4.data.people.y = _this4.data.screenInfo.h * _this4.methods.smooth(0.407, 0, i * 1000, 0.00012); // 允许滚动

            if (i >= 0.7) {
              _this4.data.clickPeopleRunning = false;
              _this4.data.peopleCanMoveing = false;
            }
          }, i * 4000 - 1600);
        };

        for (var i = 0.407; i < 0.75; i += 0.005) {
          _loop6(i);
        }
      }); // 小人跳舞

      var sportH = bodySize.h * 0.2;
      var sport = new GIF("./images/sport.gif", this.data.resources);
      sport.sprite.width = sportH * 1.0775;
      sport.sprite.height = sportH;
      sport.sprite.x = bodySize.w * 10.78 - sportH * 1.0775 / 2;
      sport.sprite.y = bodySize.h * 0.44 - sportH / 2; // 添加背景

      this.data.twoContainer.addChild(bg3Image, this.data.people, child, bg2Image, leftArrow, threeLight, bg4Image, bg5Image, bg6Image, bg7Image, bg8Image, bg9Image, bg10Image, bg11Image, bgshare, Light11, hand, fiveLight, sevenLight, Light9, shareBT, againBT, sport.sprite);
      setTimeout(function () {
        sport.play();
      }, 2000); // 添加云

      this.data.twoContainer.addChild(cloud3, cloud4, cloud5, cloud6, cloud7, cloud8, cloud9, cloud10, petal11, petal12);
      this.data.app.stage.addChild(this.data.twoContainer); // 三-亮光闪烁

      var threeLightAnimationList = TweenMax.fromTo(threeLight, 1, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      threeLightAnimationList.play(); // 五-亮光闪烁

      var fiveLightHeightAnimationList = TweenMax.fromTo(fiveLight, 1, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      fiveLightHeightAnimationList.play(); // 七-亮光闪烁

      var sevenLightHeightAnimationList = TweenMax.fromTo(sevenLight, 1, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      sevenLightHeightAnimationList.play(); // 九-亮光闪烁

      var Light9AnimationList = TweenMax.fromTo(Light9, 1, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      Light9AnimationList.play(); // 十一-亮光闪烁

      var Light11AnimationList = TweenMax.fromTo(Light11, 2, {
        alpha: 0
      }, {
        alpha: 1
      }).repeat(-1);
      Light11AnimationList.play();
      this.scrollBegin();
    },
    "scrollBegin": function scrollBegin() {
      var _this5 = this;

      console.log('注册scroll!');
      var transverse = this.data.screenInfo.transverse;
      this.data.scroller = new Scroller(function (left, top, zoom) {
        var scrollNumber = transverse ? left : top; // 设置整个页面的x
        // console.log(this.data.twoContainer)

        _this5.data.twoContainer.x = -scrollNumber;
        var peopleX = scrollNumber + 50 * (1024 / _this5.data.screenInfo.w); // 设置小人的图片

        _this5.setPeopleImg(peopleX); // console.log(scrollNumber)
        // 小球移动轨迹
        // console.log('sd')


        _this5.setPeopleY(peopleX);
      }, {
        zooming: true,
        bouncing: false
      }); // 设置可滚动的区域

      this.setShowPageNumber(2); // 监听鼠标事件

      this.mouseEvent();
    },
    "setShowPageNumber": function setShowPageNumber(number) {
      // 设置进度
      this.data.progress = number;
      var transverse = this.data.screenInfo.transverse; // 根据横屏还是竖屏 设置滚动区域

      if (transverse) {
        // 横屏
        this.data.scroller.setDimensions(this.data.screenInfo.w, this.data.screenInfo.h, this.data.screenInfo.w * number, this.data.screenInfo.h);
      } else {
        this.data.scroller.setDimensions(this.data.screenInfo.h, this.data.screenInfo.w, this.data.screenInfo.h, this.data.screenInfo.w * number);
      }
    },
    "setPeopleY": function setPeopleY(X) {
      // 当时是在屏幕分辨率为1024*768做的 所以要计算换算为真实屏幕
      // console.log(peopleX / this.data.screenInfo.w)
      var peopleX = X * (1024 / this.data.screenInfo.w);
      var pageIndex = (X - 50 / this.data.screenInfo.w * 1024) / this.data.screenInfo.w; // 记录最大到达的点

      if (this.data.xMax < peopleX) this.data.xMax = peopleX; // console.log(pageIndex, this.data.progress)
      // console.log(pageIndex, this.data.xMax + this.data.screenInfo.w * 1.11)
      // console.log(this.data.peopleCanMoveing)
      // 第三幅图小人移动到光圈下
      // 1 - 1.52区域小人不接受移动指令

      if (pageIndex >= 1 && pageIndex <= 1.9) {
        // 保证返回的时候不会不流畅
        if (this.data.progress === 2) {
          this.data.app.renderer.backgroundColor = '0xc8c9c9';
          this.peopleMove1(pageIndex);
          return;
        } else if (this.data.xMax < 2210) {
          return;
        }
      } // sdd


      if (pageIndex >= 3 && pageIndex <= 3.78) {
        // 保证返回的时候不会不流畅
        if (this.data.progress === 4) {
          this.data.app.renderer.backgroundColor = '0xc8c9c9';
          this.peopleMove2(pageIndex);
          return;
        } else if (this.data.xMax < 4050) {
          return;
        }
      }

      if (pageIndex >= 5 && pageIndex <= 5.75) {
        // 保证返回的时候不会不流畅
        if (this.data.progress === 6) {
          this.data.app.renderer.backgroundColor = '0xc8c9c9';
          this.peopleMove3(pageIndex);
          return;
        } else if (this.data.xMax < 6430) {
          return;
        }
      }

      if (pageIndex >= 7 && pageIndex <= 7.85) {
        // 保证返回的时候不会不流畅
        if (this.data.progress === 8) {
          this.data.app.renderer.backgroundColor = '0xc8c9c9';
          this.peopleMove4(pageIndex);
          return;
        } else if (this.data.xMax < 8218) {
          return;
        }
      }

      if (pageIndex >= 9 && pageIndex <= 9.85) {
        // 保证返回的时候不会不流畅
        if (this.data.progress === 10) {
          this.data.app.renderer.backgroundColor = '0xc8c9c9';
          this.peopleMove5(pageIndex);
          return;
        } else if (this.data.xMax < 10205) {
          return;
        }
      } // console.log(peopleX)


      if (peopleX < 188) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.25, 0, peopleX, 0.001);
      } else if (peopleX < 390) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.438, 188, peopleX, 0.0007);
      } else if (peopleX < 560) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5794, 390, peopleX, 0.00025);
      } else if (peopleX < 687) {
        // console.log(peopleX, this.methods.smooth(0.6219, 560, peopleX, -0.0003))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6219, 560, peopleX, -0.0001);
      } else if (peopleX < 966) {
        // console.log(peopleX, this.methods.smooth(0.5840, 687, peopleX, -0.001))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6, 687, peopleX, -0.001);
      } else if (peopleX < 1125) {
        // console.log(peopleX, this.methods.smooth(0.3075, 966, peopleX, -0.0004))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3075, 966, peopleX, -0.0006);
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
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6122, 1844, peopleX, -0.0005);
      } else if (peopleX < 2238) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5257, 2017, peopleX, -0.001);
      } else if (peopleX < 2386) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3050, 2238, peopleX, -0.0006);
      } else if (peopleX < 2530) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.1980, 2386, peopleX, -0.0002);
      } else if (peopleX < 2679) {
        var startColor = '#c8c9c9'; // 根据前进还是后退做不同处理 倒退的时候没有灰色

        if (this.data.xMax > 3299) startColor = '#59d3cb';
        this.data.app.renderer.backgroundColor = gradientColor2(startColor, '#2a99a5', 15, Math.floor((2679 - peopleX) / 10));
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.1690, 2530, peopleX, 0.00015);
      } else if (peopleX < 3299) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.1911, 2679, peopleX, 0.0006);
      } else if (peopleX < 3777) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5635, 3299, peopleX, -0.00045);
      } else if (peopleX < 3969) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.35, 3777, peopleX, -0.0001);
      } else if (peopleX < 4317) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3308, 3969, peopleX, 0.0002);
      } else if (peopleX < 4614) {
        // console.log(peopleX, this.methods.smooth(0.3995, 4317, peopleX, 0.00055))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3995, 4317, peopleX, 0.00055);
      } else if (peopleX < 4944) {
        var _startColor = '#c8c9c9'; // 根据前进还是后退做不同处理 倒退的时候没有灰色

        if (this.data.xMax > 5084) _startColor = '#dccfbc';
        this.data.app.renderer.backgroundColor = gradientColor2(_startColor, '#59d3cb', 34, Math.floor((4944 - peopleX) / 10));
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5582, 4614, peopleX, 0.00035);
      } else if (peopleX < 5084) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.673, 4944, peopleX, -0.0005);
      } else if (peopleX < 5352) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6028, 5084, peopleX, -0.0008);
      } else if (peopleX < 5521) {
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3888, 5352, peopleX, -0.0003);
      } else if (peopleX < 5638) {
        // console.log(peopleX, this.methods.smooth(0.3438, 5521, peopleX, -0.0002))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3438, 5521, peopleX, -0.0002);
      } else if (peopleX < 5946) {
        // console.log(peopleX, this.methods.smooth(0.3205, 5638, peopleX, 0.0003))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.3205, 5638, peopleX, 0.0003);
      } else if (peopleX < 6295) {
        // console.log(peopleX, this.methods.smooth(0.4089, 5946, peopleX, 0.0007))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.4089, 5946, peopleX, 0.0007);
      } else if (peopleX < 6443) {
        // console.log(peopleX, this.methods.smooth(0.6501, 6295, peopleX, 0.0005))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6501, 6295, peopleX, 0.0005);
      } else if (peopleX < 6674) {
        // console.log(peopleX, this.methods.smooth(0.7233, 6443, peopleX, 0.00008))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.7233, 6443, peopleX, 0.00008);
      } else if (peopleX < 7042) {
        var _startColor2 = '#c8c9c9'; // 根据前进还是后退做不同处理 倒退的时候没有灰色

        if (this.data.xMax > 7356) _startColor2 = '#f6df60';
        this.data.app.renderer.backgroundColor = gradientColor2(_startColor2, '#dccfbc', 37, Math.floor((7042 - peopleX) / 10)); // console.log(peopleX, this.methods.smooth(0.7418, 6674, peopleX, -0.00001))

        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.7418, 6443, peopleX, -0.00001);
      } else if (peopleX < 7356) {
        // console.log(peopleX, this.methods.smooth(0.7292, 7042, peopleX, -0.00025))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.7381, 7042, peopleX, -0.00025);
      } else if (peopleX < 7610) {
        // console.log(peopleX, this.methods.smooth(0.6509, 7356, peopleX, -0.0005))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.6509, 7356, peopleX, -0.0005);
      } else if (peopleX < 7723) {
        // console.log(peopleX, this.methods.smooth(0.5258, 7610, peopleX, -0.0002))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5258, 7610, peopleX, -0.0002);
      } else if (peopleX < 8143) {
        // console.log(peopleX, this.methods.smooth(0.4850, 7723, peopleX, 0.0001))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.4850, 7723, peopleX, 0.0001);
      } else if (peopleX < 8383) {
        // console.log(peopleX, this.methods.smooth(0.4850, 7723, peopleX, 0.00005))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5268, 8143, peopleX, -0.00005);
      } else if (peopleX < 9303) {
        var _startColor3 = '#c8c9c9'; // 根据前进还是后退做不同处理 倒退的时候没有灰色

        if (this.data.xMax > 10025) _startColor3 = '#cfdee5';
        this.data.app.renderer.backgroundColor = gradientColor2(_startColor3, '#f6df60', 93, Math.floor((9303 - peopleX) / 10)); // console.log(peopleX, this.methods.smooth(0.5178, 8383, peopleX, -0.00024))

        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5178, 8383, peopleX, -0.00024);
      } else if (peopleX < 10025) {
        // console.log(peopleX, this.methods.smooth(0.2973, 9303, peopleX, 0.00029))
        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.2973, 9303, peopleX, 0.00029);
      } else if (peopleX < 10208) {
        // 小人慢慢消失出现
        var peopleData = this.methods.smooth(0, peopleX, 10208, 0.01);

        if (peopleData >= 0) {
          this.data.people.alpha = peopleData;
        } // console.log(peopleX, this.methods.smooth(0.5065, 10025, peopleX, -0.0002))


        this.data.people.y = this.data.screenInfo.h * this.methods.smooth(0.5065, 10025, peopleX, -0.0002);
      } else {
        // 小人慢慢消失出现
        var _peopleData = this.methods.smooth(0, peopleX, 10208, 0.01);

        if (_peopleData < 0) {
          this.data.people.alpha = 0;
        } // 如果是前进姿态
        // console.log(peopleX, this.methods.smooth(0.4697, 10208, peopleX, -0.0008))
        // if (this.data.xMax > 10300 && peopleX < 10300 && this.data.app.renderer.backgroundColor !== '#cfdee5') {
        //   this.data.app.renderer.backgroundColor = gradientColor2( '#cfdee5', '#c8c9c9', 10, Math.floor((10300 - peopleX) / 10))
        // }
        // 计算得到比率


        var _pageIndex = (X - 50 / this.data.screenInfo.w * 1024) / this.data.screenInfo.w; // console.log(pageIndex)
        // console.log(ratioB)
        // 二维码问题


        if (_pageIndex === 10) {
          $('#qr')[0].style.display = 'block';
        } else {
          $('#qr')[0].style.display = 'none';
        }
      } // 移动小人


      this.data.people.x = X;
    },
    "setPeopleImg": function setPeopleImg(peopleX) {
      var peopleID = Math.ceil(peopleX / this.data.screenInfo.w);

      if (this.data.peopleImgID !== peopleID) {
        this.data.peopleImgID = peopleID;
      }
    },
    "mouseEvent": function mouseEvent() {
      var _this6 = this;

      // console.log(this.data.scroller)
      $('canvas')[0].addEventListener("touchstart", function (e) {
        // 隐藏掉提示条
        _this6.domList.showTextBox.style.display = 'none';
        if (_this6.data.peopleCanMoveing) return;

        _this6.data.scroller.doTouchStart(e.touches, e.timeStamp);

        _this6.data.mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("touchmove", function (e) {
        if (_this6.data.peopleCanMoveing) return;

        if (!_this6.data.mousedown) {
          return;
        } // console.log(e.touches, e.timeStamp)


        _this6.data.scroller.doTouchMove(e.touches, e.timeStamp);

        _this6.data.mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("touchend", function (e) {
        if (_this6.data.peopleCanMoveing) return;

        if (!_this6.data.mousedown) {
          return;
        }

        _this6.data.scroller.doTouchEnd(e.timeStamp);

        _this6.data.mousedown = false;
      }, false);
      $('canvas')[0].addEventListener("mousedown", function (e) {
        // 隐藏掉提示条
        _this6.domList.showTextBox.style.display = 'none';
        if (_this6.data.peopleCanMoveing) return;

        _this6.data.scroller.doTouchStart([e], e.timeStamp);

        _this6.data.mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("mousemove", function (e) {
        if (_this6.data.peopleCanMoveing) return;

        if (!_this6.data.mousedown) {
          return;
        } // console.log(e.touches, e.timeStamp)


        _this6.data.scroller.doTouchMove([e], e.timeStamp);

        _this6.data.mousedown = true;
      }, false);
      $('canvas')[0].addEventListener("mouseup", function (e) {
        if (_this6.data.peopleCanMoveing) return;

        if (!_this6.data.mousedown) {
          return;
        }

        _this6.data.scroller.doTouchEnd(e.timeStamp);

        _this6.data.mousedown = false;
      }, false);
      $('#qr')[0].addEventListener("touchstart", function (e) {
        if (_this6.data.peopleCanMoveing) return;

        _this6.data.scroller.doTouchStart(e.touches, e.timeStamp);

        _this6.data.mousedown = true;
      }, false);
      $('#qr')[0].addEventListener("touchmove", function (e) {
        if (_this6.data.peopleCanMoveing) return;

        if (!_this6.data.mousedown) {
          return;
        } // console.log(e.touches, e.timeStamp)


        _this6.data.scroller.doTouchMove(e.touches, e.timeStamp);

        _this6.data.mousedown = true;
      }, false);
      $('#qr')[0].addEventListener("touchend", function (e) {
        if (_this6.data.peopleCanMoveing) return;

        if (!_this6.data.mousedown) {
          return;
        }

        _this6.data.scroller.doTouchEnd(e.timeStamp);

        _this6.data.mousedown = false;
      }, false);
    },
    "addBind": function addBind(item, func) {
      item.on('tap', func);
      item.on('click', func);
    },
    "peopleMove1": function peopleMove1(pageIndex) {
      var _this7 = this;

      if (pageIndex === 1) {
        if (this.data.progress < 3 && !this.data.peopleCanMoveing) {
          this.data.peopleCanMoveing = true;

          var _loop7 = function _loop7(i) {
            setTimeout(function () {
              if (!_this7.data.peopleCanMoveing || _this7.data.clickPeopleRunning) return;
              _this7.data.people.x = _this7.data.screenInfo.w * (1.11 + i);

              if (i < 0.16) {
                _this7.data.people.y = _this7.data.screenInfo.h * _this7.methods.smooth(0.22, 0, i * 1000, 0.0003);
              } else {
                // console.log(this.data.screenInfo.h * 0.1704, i * this.data.screenInfo.h)
                // ssd
                _this7.data.people.y = _this7.data.screenInfo.h * _this7.methods.smooth(0.2557, 155, i * 1000, 0.00085); // console.log(this.data.people.y, this.methods.smooth(0.2557, 155, i * 1000 , 0.00085))
              }
            }, i * 4000);
          };

          for (var i = 0; i < 0.58; i += 0.005) {
            _loop7(i);
          }
        }
      }
    },
    "peopleMove2": function peopleMove2(pageIndex) {
      var _this8 = this;

      if (pageIndex === 3) {
        // console.log(this.data.progress)
        if (this.data.progress < 5 && !this.data.peopleCanMoveing) {
          this.data.peopleCanMoveing = true;

          var _loop8 = function _loop8(i) {
            setTimeout(function () {
              if (!_this8.data.peopleCanMoveing || _this8.data.clickPeopleRunning) return;
              _this8.data.people.x = _this8.data.screenInfo.w * (3.11 + i);

              if (i < 0.15) {
                _this8.data.people.y = _this8.data.screenInfo.h * _this8.methods.smooth(0.5, 0, i * 1000, 0.0004); // console.log(i, 1- this.methods.smooth(0.7, 0, i * 1000, -0.0008))
              } else if (i < 0.3) {
                _this8.data.people.y = _this8.data.screenInfo.h * _this8.methods.smooth(0.59, 0, i * 1000, -0.0001); // console.log(this.methods.smooth(0.55, 0.5700, i * 1000 , -0.0001))
              } else {
                _this8.data.people.y = _this8.data.screenInfo.h * _this8.methods.smooth(0.76, 0, i * 1000, -0.00075); // console.log(this.data.people.y, this.methods.smooth(0.76, 0, i * 1000 , -0.00075))
              }
            }, i * 4000);
          };

          for (var i = 0; i < 0.52; i += 0.005) {
            _loop8(i);
          }
        }
      }
    },
    "peopleMove3": function peopleMove3(pageIndex) {
      var _this9 = this;

      if (pageIndex === 5) {
        // console.log(this.data.progress)
        if (this.data.progress < 7 && !this.data.peopleCanMoveing) {
          this.data.peopleCanMoveing = true;

          var _loop9 = function _loop9(i) {
            setTimeout(function () {
              if (!_this9.data.peopleCanMoveing || _this9.data.clickPeopleRunning) return;
              _this9.data.people.x = _this9.data.screenInfo.w * (5.11 + i);

              if (i < 0.15) {
                _this9.data.people.y = _this9.data.screenInfo.h * _this9.methods.smooth(0.48, 0, i * 1000, -0.0008); // console.log(this.data.people.y, this.methods.smooth(0.48, 0, i * 1000, -0.0008))
              }
            }, i * 4000);
          };

          for (var i = 0; i < 0.2; i += 0.005) {
            _loop9(i);
          }
        }
      }
    },
    "peopleMove4": function peopleMove4(pageIndex) {
      var _this10 = this;

      if (pageIndex === 7) {
        // console.log(this.data.progress)
        if (this.data.progress < 9 && !this.data.peopleCanMoveing) {
          this.data.peopleCanMoveing = true;

          var _loop10 = function _loop10(i) {
            setTimeout(function () {
              if (!_this10.data.peopleCanMoveing || _this10.data.clickPeopleRunning) return;
              _this10.data.people.x = _this10.data.screenInfo.w * (7.11 + i);

              if (i < 0.16) {
                _this10.data.people.y = _this10.data.screenInfo.h * _this10.methods.smooth(0.7, 0, i * 1000, -0.0007); // console.log(i, 1- this.methods.smooth(0.7, 0, i * 1000, -0.0008))
              } else {
                _this10.data.people.y = _this10.data.screenInfo.h * _this10.methods.smooth(0.66, 0, i * 1000, -0.00045);
                console.log(_this10.data.people.y, _this10.methods.smooth(0.66, 0, i * 1000, -0.00045));
              }
            }, i * 4000);
          };

          for (var i = 0; i < 0.36; i += 0.005) {
            _loop10(i);
          }
        }
      }
    },
    "peopleMove5": function peopleMove5(pageIndex) {
      var _this11 = this;

      if (pageIndex === 9) {
        // console.log(this.data.progress)
        if (this.data.progress < 11 && !this.data.peopleCanMoveing) {
          this.data.peopleCanMoveing = true;

          var _loop11 = function _loop11(i) {
            setTimeout(function () {
              if (!_this11.data.peopleCanMoveing || _this11.data.clickPeopleRunning) return;
              _this11.data.people.x = _this11.data.screenInfo.w * (9.11 + i);

              if (i < 0.10) {
                _this11.data.people.y = _this11.data.screenInfo.h * _this11.methods.smooth(0.3, 0, i * 1000, 0.0001); // console.log(i, 1- this.methods.smooth(0.7, 0, i * 1000, -0.0008))
              } else {
                _this11.data.people.y = _this11.data.screenInfo.h * _this11.methods.smooth(0.265, 0, i * 1000, 0.0004); // console.log(this.data.people.y, this.methods.smooth(0.265, 0, i * 1000, 0.0004))
              }
            }, i * 4000);
          };

          for (var i = 0; i < 0.36; i += 0.005) {
            _loop11(i);
          }
        }
      }
    }
  }
};