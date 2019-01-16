
    window.ozzx = {
      script: {}
    };
    var globalConfig = {"root":"/src","entry":"home","headFolder":"head","outFolder":"dist","autoPack":true,"minifyCss":false,"minifyJs":false,"pageFolder":"page","isOnePage":true};
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
  // 注入运行环境
  newPageFunction.created.apply(assign(newPageFunction, {
    $el: entryDom,
    activePage: window.ozzx.activePage,
    domList: window.ozzx.domList
  }))
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
          clickFor = clickFor.replace('(' + parameterList + ')', '')
        }
        // console.log(newPageFunction)
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
}// 页面资源加载完毕事件
window.onload = function() {
  var page = globalConfig.entry
  window.ozzx.activePage = page
  var entryDom = document.getElementById('ox-' + page)
  runPageFunction(page, entryDom)
}
      window.ozzx.script = {home:{created:function created(){this.data.swiper=new Swiper('#auto-swiper',{autoplay:3000,slidesPerView:4,loop:true});},data:{swiper:"1",swiperList1:[{image:"./image/4.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/5.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/6.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/4.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/5.png",title:"翻阅中外妙文，邂逅最美冬景"},{image:"./image/6.png",title:"翻阅中外妙文，邂逅最美冬景"}]},methods:{swiperNext:function swiperNext(){console.log('swiperNext');this.data.swiper.swipeNext();},swiperPrev:function swiperPrev(){console.log('swiperPrev');this.data.swiper.swipePrev();}},template:{information:{created:function created(){new Swiper('#information-img-box',{paginationClickable:true,pagination:"#information-pagination"});}},tabBox:{data:{swiper2:"1",swiper3:"1"},created:function created(index){this.data.swiper2=new Swiper('#banner',{simulateTouch:false});var judgesList=document.getElementsByClassName('judges-swiper-box');for(var _index=0;_index<judgesList.length;_index++){judgesList[_index].setAttribute("id","judges-swiper-box-".concat(_index));}var mainImg=document.getElementsByClassName('main-img-box');for(var _index2=0;_index2<mainImg.length;_index2++){console.log(mainImg[_index2]);mainImg[_index2].setAttribute("id","main-img-box-".concat(_index2));}for(var i=0;i<mainImg.length;i++){new Swiper("#judges-swiper-box-".concat(i),{autoplay:3000,loop:true,slidesPerView:3});new Swiper("#main-img-box-".concat(i),{loop:true,paginationClickable:true,pagination:"#main-img-pagination-".concat(i)});}},methods:{tabClick:function tabClick(index){this.data.swiper2.swipeTo(index,1000,false);for(var _index3=0;_index3<this.domList['tabBar'].children.length;_index3++){var dom=this.domList['tabBar'].children[_index3];dom.classList.remove('active');}this.domList['tabBar'].children[index].classList.add("active");}}}}}}
    