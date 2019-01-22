// 对象合并方法
function assign(a, b) {
  var newObj = {}
  for (var key in a){
    newObj[key] = a[key]
  }
  for (var key in b){
    newObj[key] = b[key]
  }
  return newObj
}

// 运行页面所属的方法
function runPageFunction (pageName, entryDom) {
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
      if (domList.length !== 1){
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
function pgNameHandler (dom) {
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
}// 获取URL #后面内容
function getarg(url){
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
function dispalyEffect (oldDom, newDom) {
  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none'
  }
  // 查找页面跳转后的page
  newDom.style.display = 'block'
}

function switchPage (oldUrlParam, newUrlParam) {
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
    oldDom.style.position = 'absolute'

    newDom.style.display = 'block'
    newDom.style.position = 'absolute'
    // document.body.style.overflow = 'hidden'
    animationIn.split(',').forEach(value => {
      oldDom.classList.add('ox-page-' + value)
    })
    animationOut.split(',').forEach(value => {
      newDom.classList.add('ox-page-' + value)
    })
    // 旧DOM执行函数
    function oldDomFun () {
      // 隐藏掉旧的节点
      oldDom.style.display = 'none'
      // console.log(oldDom)
      oldDom.style.position = ''
      // 清除临时设置的class
      animationIn.split(',').forEach(value => {
        oldDom.classList.remove('ox-page-' + value)
      })
      // 移除监听
      oldDom.removeEventListener('animationend', oldDomFun, false)
    }

    // 新DOM执行函数
    function newDomFun () {
      // 清除临时设置的style
      newDom.style.position = ''
      animationOut.split(',').forEach(value => {
        newDom.classList.remove('ox-page-' + value)
      })
      // 移除监听
      newDom.removeEventListener('animationend', newDomFun, false)
    }
    oldDom.addEventListener("animationend", oldDomFun, false)
    newDom.addEventListener("animationend", newDomFun, false)
    
  } else {
    dispalyEffect(oldDom, newDom)
  }
  
  window.ozzx.activePage = newPage
  runPageFunction(newPage, newDom)
}
      window.ozzx = {
        script: {}
      };
      var globalConfig = {"root":"/src","entry":"voice","headFolder":"head","outFolder":"dist","autoPack":true,"minifyCss":false,"minifyJs":false,"pageFolder":"page","isOnePage":false};
      window.ozzx.script = {"voice":{"data":{"talkTime":0,"clock":null},"created":function created(){if(this.data.clock!==null){clearInterval(this.data.clock);this.data.clock=null;}this.data.talkTime=0;this.domList.answerBox.style.display='';this.domList.hangUpBox.style.display='';this.domList.audioPeopleBox.style.display='';this.domList.bottomBar.style.display='';this.domList.speechStateBox.style.display='';},"methods":{"answerSpeech":function answerSpeech(){var _this=this;console.log(this);var talkTime=0;this.domList.answerBox.style.display='none';this.domList.hangUpBox.style.display='flex';this.domList.audioPeopleBox.style.display='none';this.domList.bottomBar.style.display='none';this.domList.speechStateBox.style.display='block';this.data.clock=setInterval(function(){_this.data.talkTime++;var minute=Math.floor(_this.data.talkTime/60);if(minute<10)minute='0'+minute;var second=_this.data.talkTime%60;if(second<10)second='0'+second;_this.domList.talkTime.innerText=minute+':'+second;},1000);},"sharePage":function sharePage(){window.location.href='#share&in=moveToTop&out=moveFromBottom';},"like":function like(){console.log('sd');var rand=Math.floor(Math.random()*100+1);var flows=["flowOne","flowTwo","flowThree"];var colors=["like-1","like-2","like-3","like-4","like-5","like-6"];var timing=(Math.random()*(5.3-1.0)+1.0).toFixed(1);$('<div class="particle part-'+rand+' '+colors[Math.floor(Math.random()*6)]+'" style="font-size:'+Math.floor(Math.random()*(40-22)+22)+'px;"><i class="glyphicon glyphicon-heart">&#xe640;</i></div>').appendTo('.ox-voice').css({animation:""+flows[Math.floor(Math.random()*3)]+" "+timing+"s linear"});$('.part-'+rand).show();setTimeout(function(){$('.part-'+rand).remove();},timing*1000-100);}},"template":{"topBar":{"created":function created(){console.log(this);var myDate=new Date();var hours=myDate.getHours();var minutes=myDate.getMinutes();if(hours<10)hours='0'+hours;if(minutes<10)minutes='0'+minutes;this.$el.innerText=hours+':'+minutes;}}}},"share":{"methods":{"returnPage":function returnPage(){window.location.href='#voice&in=moveToBottom&out=moveFromTop';}}}}
    