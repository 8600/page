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
}// 页面资源加载完毕事件
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
      var globalConfig = {"root":"/src","entry":"voice","headFolder":"head","outFolder":"dist","autoPack":true,"minifyCss":false,"minifyJs":false,"pageFolder":"page","choiceAnimation":false,"isOnePage":true};
      window.ozzx.script = {"voice":{"data":{"app":null,"loader":null,"container":null,"titleContainer":null,"titleStart":null,"imgArr":["./images/1-title.png"]},"created":function created(){var _this2=this;var bodySize=this.methods.calculationScene(this);$('#main').append(this.data.app.view);this.data.app.stage.displayList=new PIXI.display.Stage();var greenGroup=new PIXI.display.Group(1,false);this.data.loader=new PIXI.loaders.Loader();this.data.loader.add("bgm","audio/bgm.mp3").add("nishuo1","audio/1nishuo.mp3").add("dida","audio/dida.mp3").add(this.data.imgArr).onProgress.add(function(e){console.log(e);});this.data.container=new PIXI.Container();this.data.container.interactive=true;var titleContainer=new PIXI.Container();titleContainer.x=0;titleContainer.y=0;var bg1Image=this.methods.createSprite("./images/1.png",{width:bodySize.w,height:bodySize.h,x:0,y:0});var logoImageHeight=bodySize.h/10;var logoImageWidth=logoImageHeight*2.75;var logoImage=this.methods.createSprite("./images/logo.png",{width:logoImageWidth,height:logoImageHeight,x:0,y:bodySize.h-logoImageHeight});var oneTitleHeight=bodySize.h/20;var oneTitleWidth=oneTitleHeight*9.818;var oneTitle=this.methods.createSprite("./images/1-title.png",{width:oneTitleWidth,height:oneTitleHeight,x:bodySize.w/2-oneTitleWidth/2,y:bodySize.h*0.1});var clockHeight=bodySize.h/1.2;var clockWidth=clockHeight*1.7801;var oneClock=this.methods.createSprite("./images/1-clock.png",{width:clockWidth,height:clockHeight,x:bodySize.w/2-clockWidth/2,y:bodySize.h*0.6-clockHeight/2});var handHeight=bodySize.h/20;var oneHand=this.methods.createSprite("./images/1-hand.png",{width:handHeight,height:handHeight,x:bodySize.w*0.4,y:bodySize.h*0.54-handHeight/2});titleContainer.addChild(bg1Image,logoImage,oneTitle,oneClock,oneHand);$("#main").on("click",function(){console.log('sd');_this2.data.loader.load(function(loader){loader.resources.bgm.data.loop=true;loader.resources.bgm.data.autoplay=true;loader.resources.bgm.data.play();var titleHandTween=TweenMax.fromTo(oneHand,1.5,{x:bodySize.w*0.43},{x:bodySize.w*0.48,ease:Linear.easeNone}).repeat(-1);titleHandTween.play();_this2.data.app.stage.addChild(titleContainer);});});},"methods":{"createSprite":function createSprite(name,opt){var newSprite=new PIXI.Sprite.from(name);if(opt){for(var key in opt){newSprite[key]=opt[key];}}return newSprite;},"calculationScene":function calculationScene(_this){console.log(_this);var ww=$(window).width();var wh=$(window).height();if(false){if(window.orientation!==90&&window.orientation!==-90){window.document.body.classList.add('horizontal');window.document.body.style.width="".concat(wh,"px");window.document.body.style.height="".concat(ww,"px");window.document.body.style.left="calc(50% - ".concat(wh/2,"px)");window.document.body.style.top="calc(50% - ".concat(ww/2,"px)");_this.data.app=new PIXI.Application($(window).height(),$(window).width(),{backgroundColor:'0xffffff'});return{w:wh,h:ww};}}else{if(ww<wh){window.document.body.classList.add('horizontal');window.document.body.style.width="".concat(wh,"px");window.document.body.style.height="".concat(ww,"px");window.document.body.style.left="calc(50% - ".concat(wh/2,"px)");window.document.body.style.top="calc(50% - ".concat(ww/2,"px)");_this.data.app=new PIXI.Application($(window).height(),$(window).width(),{backgroundColor:'0xffffff'});return{w:wh,h:ww};}}_this.data.app=new PIXI.Application($(window).width(),$(window).height(),{backgroundColor:'0xffffff'});return{w:ww,h:wh};}}}}
    