
    window.ozzx = {
      script: {}
    };
    var globalConfig = {"root":"/src","entry":"home","headFolder":"head","outFolder":"dist","autoPack":true,"minifyCss":false,"minifyJs":false,"pageFolder":"page"};
  // 获取URL #后面内容
function getarg(url){
  arg = url.split("#");
  return arg[1];
}

// 页面资源加载完毕事件
window.onload = function() {
  // 取出URL地址判断当前所在页面
  var pageArg = getarg(window.location.href)
  // 从配置项中取出程序入口
  var page = pageArg ? pageArg : globalConfig.entry
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
          clickFor = clickFor.replace('(' + parameterList + ')', '')
        }
        console.log(newPageFunction)
        // 如果有方法,则运行它
        if (newPageFunction.methods[clickFor]) {
          // 绑定window.ozzx对象
          // console.log(tempDom)
          newPageFunction.methods[clickFor].apply({
            $el: tempDom,
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
}

// 运行页面所属的方法
function runPageFunction (pageName, entryDom) {
  // ozzx-name处理
  window.ozzx.domList = {}
  pgNameHandler(entryDom)

  // 判断页面是否有自己的方法
  var newPageFunction = window.ozzx.script[pageName]
  // 如果有方法,则运行它
  if (newPageFunction) {
    newPageFunction.created.apply(newPageFunction)
  }
  // 判断页面是否有下属模板,如果有运行所有模板的初始化方法
  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key]
    if (templateScript.created) {
      templateScript.created.apply(newPageFunction.template[key])
    }
  }
}


// url发生改变事件
window.onhashchange = function(e) {
  var oldUrlParam = getarg(e.oldURL)
  var newUrlParam = getarg(e.newURL)
  // 查找页面跳转前的page页(dom节点)
  // console.log(oldUrlParam)
  // 如果源地址获取不到 那么一般是因为源页面为首页
  if (oldUrlParam === undefined) {
    oldUrlParam = globalConfig.entry
  }
  var oldDom = document.getElementById('ox-' + oldUrlParam)
  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none'
  }
  // 查找页面跳转后的page
  
  var newDom = document.getElementById('ox-' + newUrlParam)
  // console.log(newDom)
  if (newDom) {
    // 隐藏掉旧的节点
    newDom.style.display = 'block'
  } else {
    console.error('页面不存在!')
    return
  }
  window.ozzx.activePage = newUrlParam
  runPageFunction(newUrlParam, entryDom)
}

      window.ozzx.script = {home:{created:function created(){this.data.swiper=new Swiper('#auto-swiper',{autoplay:3000,slidesPerView:4,loop:true});},data:{swiper:"1",swiperList1:[{image:"./image/4.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/5.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/6.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/4.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/5.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/6.png",title:"翻阅中外妙文，邂逅最美冬景"}]},methods:{swiperNext:function swiperNext(){console.log('swiperNext');this.data.swiper.swipeNext();},swiperPrev:function swiperPrev(){console.log('swiperPrev');this.data.swiper.swipePrev();}},template:{information:{created:function created(){console.log('sdsd');new Swiper('#information-img-box',{pagination:"#information-pagination"});}},tabBox:{data:{swiper2:"1",swiper3:"1"},created:function created(index){this.data.swiper2=new Swiper('#banner',{simulateTouch:false});var judgesList=document.getElementsByClassName('judges-swiper-box');for(var _index=0;_index<judgesList.length;_index++){judgesList[_index].setAttribute("id","judges-swiper-box-"+_index);}var mainImg=document.getElementsByClassName('main-img-box');for(var _index2=0;_index2<mainImg.length;_index2++){console.log(mainImg[_index2]);mainImg[_index2].setAttribute("id","main-img-box-"+_index2);}for(var i=0;i<mainImg.length;i++){new Swiper("#judges-swiper-box-"+i,{autoplay:3000,loop:true,slidesPerView:3});new Swiper("#main-img-box-"+i,{loop:true,pagination:"#main-img-pagination-"+i});}},methods:{tabClick:function tabClick(index){this.data.swiper2.swipeTo(index,1000,false);for(var _index3=0;_index3<this.domList['tabBar'].children.length;_index3++){var dom=this.domList['tabBar'].children[_index3];dom.classList.remove('active');}this.domList['tabBar'].children[index].classList.add("active");}}}}}}
    