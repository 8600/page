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
      activePage: window.ozzx.activePage,
      domList: window.ozzx.domList
    }))
  }
  
  // 判断页面是否有下属模板,如果有运行所有模板的初始化方法
  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key]
    if (templateScript.created) {
      // 为模板注入运行环境
      templateScript.created.apply(assign(newPageFunction.template[key], {
        $el: entryDom,
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
}// 页面资源加载完毕事件
window.onload = function() {
  var page = globalConfig.entry
  window.ozzx.activePage = page
  var entryDom = document.getElementById('ox-' + page)
  runPageFunction(page, entryDom)
}// 页面切换效果

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
    oldDom.addEventListener("animationend", function() {
      // 隐藏掉旧的节点
      oldDom.style.display = 'none'
      oldDom.style.position = ''
      // 清除临时设置的class
      animationIn.split(',').forEach(value => {
        oldDom.classList.remove('ox-page-' + value)
      })
    })
    newDom.addEventListener("animationend", function() {
      // 清除临时设置的style
      newDom.style.position = ''
      animationOut.split(',').forEach(value => {
        newDom.classList.remove('ox-page-' + value)
      })
    })
  } else {
    dispalyEffect(oldDom, newDom)
  }
  
  window.ozzx.activePage = newPage
  runPageFunction(newPage, newDom)
}
      window.ozzx = {
        script: {}
      };
      var globalConfig = {"root":"/src","entry":"home","headFolder":"head","outFolder":"dist","autoPack":true,"minifyCss":false,"minifyJs":false,"pageFolder":"page","isOnePage":true};
      window.ozzx.script = {"home":{"template":{"information":{"data":{"swiperList":[{"url":"./image/1.jpg","text":"我是标题标题1"},{"url":"./image/1.jpg","text":"我是标题标题1"},{"url":"./image/1.jpg","text":"我是标题标题1"}],"infoList":[{"title":"实名制，让建筑工人更安心","text":"春节将至，劳碌一年的农民工们能否按时拿到工资？请看记者调查。［<a href='#'>阅读</a>］"},{"title":"用改革思维解读报业停刊现象","text":"随着新兴媒体的发展，媒体融合的深入，都市报和行业报停刊停办也是正常的过程。［<a href='#'>阅读</a>］"},{"title":"2018人民日报人民网上的内蒙古","text":"期待你的好照片 名单揭晓为了展现人民日报改版之后新的版面变化和特点，评委们特别推荐了一组版面。［<a href='#'>阅读</a>］"}]},"created":function created(){new Swiper('#information-img-box',{paginationClickable:true,pagination:"#information-pagination"});}},"tabBox":{"data":{"swiper2":"1","swiper3":"1"},"created":function created(index){this.data.swiper2=new Swiper('#banner',{simulateTouch:false});var judgesList=document.getElementsByClassName('judges-swiper-box');for(var _index=0;_index<judgesList.length;_index++){judgesList[_index].setAttribute("id","judges-swiper-box-".concat(_index));}var mainImg=document.getElementsByClassName('main-img-box');for(var _index2=0;_index2<mainImg.length;_index2++){console.log(mainImg[_index2]);mainImg[_index2].setAttribute("id","main-img-box-".concat(_index2));}for(var i=0;i<mainImg.length;i++){new Swiper("#judges-swiper-box-".concat(i),{autoplay:3000,loop:true,slidesPerView:3});new Swiper("#main-img-box-".concat(i),{loop:true,paginationClickable:true,pagination:"#main-img-pagination-".concat(i)});}},"methods":{"tabClick":function tabClick(index){this.data.swiper2.swipeTo(index,1000,false);for(var _index3=0;_index3<this.domList['tabBar'].children.length;_index3++){var dom=this.domList['tabBar'].children[_index3];dom.classList.remove('active');}this.domList['tabBar'].children[index].classList.add("active");}}},"switch":{"created":function created(){this.data.swiper=new Swiper('#auto-swiper',{autoplay:3000,slidesPerView:4,loop:true});},"data":{"swiper":"1","swiperList1":[{"image":"./image/4.png","title":"翻阅中外妙文，邂逅最美冬景"},{"image":"./image/5.png","title":"翻阅中外妙文，邂逅最美冬景"},{"image":"./image/6.png","title":"翻阅中外妙文，邂逅最美冬景"},{"image":"./image/4.png","title":"翻阅中外妙文，邂逅最美冬景"},{"image":"./image/5.png","title":"翻阅中外妙文，邂逅最美冬景"},{"image":"./image/6.png","title":"翻阅中外妙文，邂逅最美冬景"}]},"methods":{"swiperNext":function swiperNext(){console.log('swiperNext');this.data.swiper.swipeNext();},"swiperPrev":function swiperPrev(){console.log('swiperPrev');this.data.swiper.swipePrev();}}}}},"theme":{},"logoBar":{},"copyright":{}}
    