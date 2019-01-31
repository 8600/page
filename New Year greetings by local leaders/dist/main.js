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
} // 获取URL #后面内容
function getarg(url) {
  arg = url.split("#");
  return arg[1];
}

// 页面资源加载完毕事件
window.onload = function() {
  // 取出URL地址判断当前所在页面
  var pageArg = getarg(window.location.href)
  // 从配置项中取出程序入口
  var page = pageArg ? pageArg.split('&')[0] : globalConfig.entry
  if (page) {
    var entryDom = document.getElementById('ox-' + page)
    if (entryDom) {
      // 显示主页面
      entryDom.style.display = 'block'
      window.ozzx.activePage = page
      runPageFunction(page, entryDom)
    } else {
      console.error('入口文件设置错误!')
    }
  } else {
    console.error('未设置程序入口!')
  }
}

// url发生改变事件
window.onhashchange = function(e) {
  var oldUrlParam = getarg(e.oldURL)
  var newUrlParam = getarg(e.newURL)
  // 如果没有跳转到任何页面则跳转到主页
  if (newUrlParam === undefined) {
    newUrlParam = globalConfig.entry
  }
  // 如果没有发生页面跳转则不需要进行操作
  // 切换页面特效
  switchPage(oldUrlParam, newUrlParam)
}
// 页面切换效果

// 获取URL参数
function getQueryString(newUrlParam, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  var r = newUrlParam.match(reg)
  if (r != null) return unescape(r[2])
  return null;
}

// 无特效翻页
function dispalyEffect(oldDom, newDom) {
  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none'
  }
  // 查找页面跳转后的page
  newDom.style.display = 'block'
}

// 切换页面动画
function animation(oldDom, newDom, animationIn, animationOut) {
  oldDom.addEventListener("animationend", oldDomFun)
  newDom.addEventListener("animationend", newDomFun)

  oldDom.style.position = 'absolute'

  newDom.style.display = 'block'
  newDom.style.position = 'absolute'
  // document.body.style.overflow = 'hidden'
  animationIn.split(',').forEach(value => {
    console.log('add:' + value)
    oldDom.classList.add('ox-page-' + value)
  })
  animationOut.split(',').forEach(value => {
    console.log('add:' + value)
    newDom.classList.add('ox-page-' + value)
  })
  // 旧DOM执行函数
  function oldDomFun() {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none'
    // console.log(oldDom)
    oldDom.style.position = ''
    // 清除临时设置的class
    animationIn.split(',').forEach(value => {
      console.log('del:' + value)
      oldDom.classList.remove('ox-page-' + value)
    })
    // 移除监听
    oldDom.removeEventListener('animationend', oldDomFun, false)
  }

  // 新DOM执行函数
  function newDomFun() {
    // 清除临时设置的style
    newDom.style.position = ''
    animationOut.split(',').forEach(value => {
      console.log('del:' + value)
      newDom.classList.remove('ox-page-' + value)
    })
    // 移除监听
    newDom.removeEventListener('animationend', newDomFun, false)
  }
}


// 切换页面前的准备工作
function switchPage(oldUrlParam, newUrlParam) {
  var oldPage = oldUrlParam
  var newPage = newUrlParam
  let newPagParamList = newPage.split('&')
  if (newPage) newPage = newPagParamList[0]

  // 查找页面跳转前的page页(dom节点)
  // console.log(oldUrlParam)
  // 如果源地址获取不到 那么一般是因为源页面为首页
  if (oldPage === undefined) {
    oldPage = globalConfig.entry
  } else {
    oldPage = oldPage.split('&')[0]
  }
  var oldDom = document.getElementById('ox-' + oldPage)
  var newDom = document.getElementById('ox-' + newPage)

  if (!newDom) {
    console.error('页面不存在!')
    return
  }
  // 判断是否有动画效果
  if (newPagParamList.length > 1) {
    var animationIn = getQueryString(newUrlParam, 'in')
    var animationOut = getQueryString(newUrlParam, 'out')

    // 如果没用动画参数则使用默认效果
    if (!animationIn || !animationOut) {
      dispalyEffect(oldDom, newDom)
      return
    }
    animation(oldDom, newDom, animationIn, animationOut)


  } else {
    dispalyEffect(oldDom, newDom)
  }

  window.ozzx.activePage = newPage
  runPageFunction(newPage, newDom)
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
  "choiceAnimation": true,
  "isOnePage": false
};
window.ozzx.script = {
  "voice": {
    "data": {
      "talkTime": 0,
      "clock": null,
      "likeNumber": 0
    },
    "created": function created() {
      var _this = this;
      console.log('sd');
      document.addEventListener('WeixinJSBridgeReady', function() {
        _this.domList.ringTone.play();
      });
      if (this.data.clock !== null) {
        clearInterval(this.data.clock);
        this.data.clock = null;
      }
      if (this.domList.videoPlay && this.domList.videoPlay.src && this.domList.videoPlay.src.indexOf('mp4') != -1) {
        this.domList.audioPeopleBox.style.display = '';
        this.domList.audioPeopleBox.classList.add("video-play");
        this.domList.speechStateBox.classList.add("video-play");
      } else {
        this.domList.audioPeopleBox.style.display = '';
      }
      this.data.talkTime = 0;
      this.domList.answerBox.style.display = '';
      this.domList.hangUpBox.style.display = '';
      this.domList.bottomBar.style.display = '';
      this.domList.speechStateBox.style.display = '';
    },
    "methods": {
      "answerSpeech": function answerSpeech() {
        var _this2 = this;
        this.domList.ringTone.pause();
        this.domList.bgMusic.play();
        document.getElementById('ox-voice').classList.add('play');
        if (this.domList.videoPlay && this.domList.videoPlay.src && this.domList.videoPlay.src.indexOf('mp4') != -1) {
          this.domList.videoPlay.style.display = 'block';
          this.domList.videoPlay.play();
        } else if (this.domList.audioPlay && this.domList.audioPlay.src) {
          this.domList.audioPlay.currentTime = 0;
          this.domList.audioPlay.play();
        }
        var talkTime = 0;
        this.domList.answerBox.style.display = 'none';
        this.domList.hangUpBox.style.display = 'flex';
        this.domList.audioPeopleBox.style.display = 'none';
        this.domList.bottomBar.style.display = 'none';
        this.domList.speechStateBox.style.display = 'block';
        this.data.clock = setInterval(function() {
          _this2.data.talkTime++;
          var minute = Math.floor(_this2.data.talkTime / 60);
          if (minute < 10) minute = '0' + minute;
          var second = _this2.data.talkTime % 60;
          if (second < 10) second = '0' + second;
          _this2.domList.talkTime.innerText = minute + ':' + second;
        }, 1000);
      },
      "stopPlaying": function stopPlaying() {
        document.getElementById('ox-voice').classList.remove('play');
        if (this.domList.videoPlay && this.domList.videoPlay.src && this.domList.videoPlay.src.indexOf('mp4') != -1) {
          this.domList.videoPlay.pause();
          this.domList.videoPlay.style.display = 'none';
          this.domList.videoPlay.currentTime = 0;
          window.location.href = '#share';
        } else {
          this.domList.audioPlay.pause();
          window.location.href = '#share&in=moveToTop&out=moveFromBottom';
        }
      },
      "like": function like() {
        var _this3 = this;
        this.data.likeNumber++;
        this.domList.circle.classList.add('circle-play');
        this.domList.likeNumberBar.classList.add('active');
        this.domList.likeNumberBar.innerText = '+' + this.data.likeNumber;
        if (this.data.likeNumber <= 8) {
          this.domList.circle.style.top = 100 - this.data.likeNumber * 12.5 + '%';
        }
        setTimeout(function() {
          _this3.domList.likeNumberBar.classList.remove('active');
          _this3.domList.circle.classList.remove('circle-play');
        }, 480);
        var rand = Math.floor(Math.random() * 100 + 1);
        var colors = ["like-1", "like-2", "like-3", "like-4", "like-5", "like-6"];
        if (this.data.likeNumber <= 8) {
          var flows = ["flowOneHeart", "flowTwoHeart", "flowThreeHeart", "flowFourHeart", "flowFiveHeart", "flowSixHeart"];
          for (var i = 0; i < 6; i++) {
            var timing = (Math.random() * (3.3 - 1.0) + 1.0).toFixed(1);
            $('<div class="particle particle-heart part-' + rand + ' ' + colors[Math.floor(Math.random() * 6)] + '" style="font-size:' + Math.floor(Math.random() * (40 - 22) + 22) + 'px;"><i class="icon glyphicon-heart">&#xe640;</i></div>').appendTo('.ox-voice').css({
              animation: "" + flows[i] + " " + timing + "s linear"
            });
            $('.part-' + rand).show();
            setTimeout(function() {
              $('.part-' + rand).remove();
            }, timing * 1000 - 100);
          }
        } else {
          var flows = ["flowOne", "flowTwo", "flowThree", "flowFour", "flowFive", "flowSix"];
          for (var _i = 0; _i < 6; _i++) {
            var timing = (Math.random() * (3.3 - 1.0) + 1.0).toFixed(1);
            $('<div class="particle particle-img part-' + rand + ' ' + colors[Math.floor(Math.random() * 6)] + '" style="width:' + Math.floor(Math.random() * (180 - 66) + 66) + 'px;"><i class="glyphicon glyphicon-heart"></i></div>').appendTo('.ox-voice').css({
              animation: "" + flows[_i] + " " + timing + "s linear"
            });
            $('.part-' + rand).show();
            setTimeout(function() {
              $('.part-' + rand).remove();
            }, timing * 1000 - 100);
          }
        }
      }
    },
    "template": {
      "topBar": {
        "created": function created() {
          console.log(this);
          var myDate = new Date();
          var hours = myDate.getHours();
          var minutes = myDate.getMinutes();
          if (hours < 10) hours = '0' + hours;
          if (minutes < 10) minutes = '0' + minutes;
          this.$el.innerText = hours + ':' + minutes;
        }
      }
    }
  },
  "share": {
    "methods": {
      "returnPage": function returnPage() {
        document.getElementById('bgMusic').pause();
        window.location.href = '#voice&in=moveToBottom&out=moveFromTop';
      }
    }
  }
}