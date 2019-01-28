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
      window.ozzx.script = {"voice":{"data":{"app":null,"loader":null,"container":null,"titleStart":null,"scroller":null,"twoContainer":null,"people":null,"imgArr":["./images/1-title.png","./images/1.png","./images/logo.png","./images/3-colour.png","./images/1-clock.png","./images/1-point.png","./images/1-hand.png","./images/1-butterfly.png","./images/people.png","./images/2.png","./images/3.png","./images/3-light.png","./images/4.png","./images/5.png","./images/6.png","./images/7.png","./images/8.png","./images/9.png","./images/10.png","./images/11.png","./images/share.png"],"animationList":{}},"created":function created(){var _this=this;var loadingTextDom=$('#loadingText')[0];var bodySize=this.calculationScene(this);this.data.loader=new PIXI.loaders.Loader();this.data.loader.add("bgm","audio/bgm.mp3").add("nishuo1","audio/1nishuo.mp3").add("dida","audio/dida.mp3").add(this.data.imgArr).onProgress.add(function(e){loadingTextDom.innerText=e.progress+'%';if(e.progress>=100){_this.data.animationList.oneHand=TweenMax.fromTo(oneHand,1.5,{x:bodySize.w*0.44},{x:bodySize.w*0.49,ease:Linear.easeNone}).repeat(-1);_this.data.animationList.oneHand.play();_this.data.animationList.oneButterfly=TweenMax.fromTo(oneButterfly,0.8,{y:0},{y:-1,ease:Linear.easeNone}).repeat(-1);_this.data.animationList.oneButterfly.play();_this.data.app.stage.addChild(one);$('#loadingBox').remove();}});this.data.container=new PIXI.Container();this.data.container.interactive=true;var one=new PIXI.Container();one.x=0;one.y=0;var bg1Image=this.methods.createSprite("./images/1.png",{width:bodySize.w,height:bodySize.h,x:0,y:0});var logoImageHeight=bodySize.h/8;var logoImageWidth=logoImageHeight*2.75;var logoImage=this.methods.createSprite("./images/logo.png",{width:logoImageWidth,height:logoImageHeight,x:0,y:bodySize.h-logoImageHeight});var oneTitleHeight=bodySize.h/20;var oneTitleWidth=oneTitleHeight*9.818;var oneTitle=this.methods.createSprite("./images/1-title.png",{width:oneTitleWidth,height:oneTitleHeight,x:bodySize.w/2-oneTitleWidth/2,y:bodySize.h*0.1});var clockHeight=bodySize.h/1.2;var clockWidth=clockHeight*1.7801;var oneClock=this.methods.createSprite("./images/1-clock.png",{width:clockWidth,height:clockHeight,x:bodySize.w/2,y:bodySize.h*0.55,zIndex:9});oneClock.anchor.x=0.5;oneClock.anchor.y=0.5;var pointHeight=bodySize.h/4;var onePoint=this.methods.createSprite("./images/1-point.png",{width:pointHeight,height:pointHeight,x:bodySize.w/2-clockWidth/2+clockWidth*0.5-2,y:bodySize.h*0.55-clockHeight/2+clockHeight*0.5-2,zIndex:999});onePoint.anchor.x=0.5;onePoint.anchor.y=0.5;var handHeight=bodySize.h/20;var oneHand=this.methods.createSprite("./images/1-hand.png",{width:handHeight,height:handHeight,x:bodySize.w*0.4,y:bodySize.h*0.46-handHeight/2,zIndex:2});var butterflyHeight=bodySize.h/1;var butterflyWidth=bodySize.w;var oneButterfly=this.methods.createSprite("./images/1-butterfly.png",{width:butterflyWidth,height:butterflyHeight,x:0,y:0,z:-1});one.addChild(bg1Image,logoImage,oneTitle,oneClock,oneHand,onePoint,oneButterfly);$("#main").on("touchstart",function(e){var touchInfo=_this.calculationTouch(e);if(touchInfo.xRatio>0.43&&touchInfo.xRatio<0.46&&touchInfo.yRatio>0.42&&touchInfo.yRatio<0.48){$("#main").on("touchend",function(e){$("#main").off("touchmove");});$("#main").on("touchmove",function(e){var proportion=_this.calculationTouch(e);proportion=(proportion.xRatio-0.438)/0.06;if(proportion>1)proportion=1;if(proportion<0)proportion=0;onePoint.rotation=0.6*proportion;if(proportion===1){$("#main").off("touchmove");_this.data.animationList.oneButterfly.kill();oneButterfly.destroy();_this.data.animationList.oneHand.kill();oneHand.destroy();onePoint.destroy();var oneClockAnimation=TweenMax.fromTo(oneClock.scale,2,{x:1,y:1},{x:5,y:5,onComplete:function onComplete(){logoImage.destroy();bg1Image.destroy();setTimeout(function(){_this.data.app.stage.removeChild(one);},0);$("#main").off("touchstart");console.log('首页已销毁');_this.two();}});}});}});this.data.loader.load(function(loader){});},"methods":{"createSprite":function createSprite(name,opt){var newSprite=new PIXI.Sprite.from(name);if(opt){for(var key in opt){newSprite[key]=opt[key];}}return newSprite;}},"calculationScene":function calculationScene(){var ww=$(window).width();var wh=$(window).height();console.log("\\u53EF\\u89C6\\u5BBD\\u5EA6:".concat(ww,", \\u53EF\\u89C6\\u9AD8\\u5EA6:").concat(wh));if(false){if(window.orientation!==90&&window.orientation!==-90){window.document.body.classList.add('horizontal');window.document.body.style.width="".concat(wh,"px");window.document.body.style.height="".concat(ww,"px");window.document.body.style.left="calc(50% - ".concat(wh/2,"px)");window.document.body.style.top="calc(50% - ".concat(ww/2,"px)");this.data.app=new PIXI.Application($(window).height(),$(window).width(),{backgroundColor:'0xffffff'});$('#main').append(this.data.app.view);this.data.app.stage.displayList=new PIXI.display.Stage();this.data.screenInfo={w:wh,h:ww,transverse:false};return{w:wh,h:ww,transverse:false};}}else{if(ww<wh){window.document.body.classList.add('horizontal');window.document.body.style.width="".concat(wh,"px");window.document.body.style.height="".concat(ww,"px");window.document.body.style.left="calc(50% - ".concat(wh/2,"px)");window.document.body.style.top="calc(50% - ".concat(ww/2,"px)");this.data.app=new PIXI.Application($(window).height(),$(window).width(),{backgroundColor:'0xffffff'});$('#main').append(this.data.app.view);this.data.app.stage.displayList=new PIXI.display.Stage();this.data.screenInfo={w:wh,h:ww,transverse:false};return{w:wh,h:ww,transverse:false};}}this.data.app=new PIXI.Application($(window).width(),$(window).height(),{backgroundColor:'0xc8c9c9'});$('#main').append(this.data.app.view);this.data.app.stage.displayList=new PIXI.display.Stage();this.data.transverse=true;this.data.screenInfo={w:ww,h:wh,transverse:true};return{w:ww,h:wh,transverse:true};},"calculationTouch":function calculationTouch(e){if(this.data.screenInfo.transverse){return{x:e.originalEvent.targetTouches[0].pageX,y:e.originalEvent.targetTouches[0].pageY,xRatio:e.originalEvent.targetTouches[0].pageX/this.data.screenInfo.w,yRatio:e.originalEvent.targetTouches[0].pageY/this.data.screenInfo.h};}else{return{x:e.originalEvent.targetTouches[0].pageY,y:this.data.screenInfo.h-e.originalEvent.targetTouches[0].pageX,xRatio:e.originalEvent.targetTouches[0].pageY/this.data.screenInfo.w,yRatio:(this.data.screenInfo.h-e.originalEvent.targetTouches[0].pageX)/this.data.screenInfo.h};}},"two":function two(){var bodySize=this.data.screenInfo;console.log('第二部分!');this.data.twoContainer=new PIXI.Container();this.data.twoContainer.x=0;this.data.twoContainer.y=0;this.data.twoContainer.width=this.data.screenInfo.w;this.data.people=this.methods.createSprite("./images/people.png",{width:50,height:120,x:0,y:0});var bg2Image=this.methods.createSprite("./images/2.png",{width:this.data.screenInfo.w+1,height:this.data.screenInfo.h,x:-1,y:0});var bg3Image=this.methods.createSprite("./images/3.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w,y:1});var threeLightHeight=bodySize.h/3;var threeLight=this.methods.createSprite("./images/3-light.png",{width:threeLightHeight,height:threeLightHeight,x:bodySize.w+bodySize.w*0.62-threeLightHeight/2,y:bodySize.h*0.1});var bg4Image=this.methods.createSprite("./images/4.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w*2,y:-1});var bg5Image=this.methods.createSprite("./images/5.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w*3,y:2});var bg6Image=this.methods.createSprite("./images/6.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w*4,y:0});var bg7Image=this.methods.createSprite("./images/7.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w*5,y:1});var bg8Image=this.methods.createSprite("./images/8.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w*6,y:-4});var bg9Image=this.methods.createSprite("./images/9.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w*7,y:0});var bg10Image=this.methods.createSprite("./images/10.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w*8,y:0});var bg11Image=this.methods.createSprite("./images/11.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w*9,y:0});var bgshare=this.methods.createSprite("./images/share.png",{width:this.data.screenInfo.w,height:this.data.screenInfo.h,x:this.data.screenInfo.w*10,y:0});threeLight.interactive=true;threeLight.buttonMode=true;threeLight.on('pointerdown',function(){var texture=PIXI.Texture.fromFrame('./images/3-colour.png');bg3Image.setTexture(texture);threeLightAnimationList.kill();threeLight.destroy();console.log(bg3Image);});this.data.twoContainer.addChild(bg2Image,bg3Image,this.data.people,threeLight,bg4Image,bg5Image,bg6Image,bg7Image,bg8Image,bg9Image,bg10Image,bg11Image,bgshare);this.data.app.stage.addChild(this.data.twoContainer);var threeLightAnimationList=TweenMax.fromTo(threeLight,1,{alpha:0},{alpha:1}).repeat(-1);threeLightAnimationList.play();this.scrollBegin();},"scrollBegin":function scrollBegin(){var _this2=this;var peoplePathList=[0.26];console.log('注册scroll!');var transverse=this.data.screenInfo.transverse;var mousedown=false;var scroller=new Scroller(function(left,top,zoom){var scrollNumber=transverse?left:top;_this2.data.twoContainer.x=-scrollNumber;_this2.data.people.x=scrollNumber;if(peoplePathList[scrollNumber]){_this2.data.people.y=_this2.data.screenInfo.h*peoplePathList[scrollNumber];}},{zooming:true,bouncing:false});if(transverse){scroller.setDimensions(this.data.screenInfo.w,this.data.screenInfo.h,this.data.screenInfo.w*11,this.data.screenInfo.h);}else{scroller.setDimensions(this.data.screenInfo.w,this.data.screenInfo.h,this.data.screenInfo.w,this.data.screenInfo.h*11);}document.addEventListener("touchstart",function(e){scroller.doTouchStart(e.touches,e.timeStamp);mousedown=true;},false);document.addEventListener("touchmove",function(e){if(!mousedown){return;}scroller.doTouchMove(e.touches,e.timeStamp);mousedown=true;},false);document.addEventListener("touchend",function(e){if(!mousedown){return;}scroller.doTouchEnd(e.timeStamp);mousedown=false;},false);}}}
    