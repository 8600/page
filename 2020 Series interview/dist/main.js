
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
      window.ozzx.script = {home:{created:function created(){this.data.swiper=new Swiper('#auto-swiper',{autoplay:3000,slidesPerView:3,loop:true});this.data.swiper2=new Swiper('#swiper',{slidesPerView:3,loop:true});},data:{swiper:"1",swiper2:"1",speakBox:[{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"},{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"},{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"},{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"},{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"},{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"},{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"},{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"},{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"},{image:"./image/people-big.png",title:"陈坛根讲述龙泉青瓷陈坛根讲述龙泉青瓷陈坛",text:"      我国将出现今冬以来范围最广、持续时间最长、影响最为严重的低温雨雪冰冻天气过程其中陕西河南安徽江等6省部分地区有暴雪，局部大暴雪，局地积雪可达40厘米以上 同时23-26日，中东部中央气黄色预警我国将出部大部气温普遍下降6-8℃中央气象台2中央气象台中央气象台中央气象台中央气象台中央气象台中央气象台中央气日06时发布暴雪黄色预警。"}],swiperList1:[{image:"./image/people-big.png",title:"标题文字 标题文字 标题文字 标题文字"},{image:"./image/people-big.png",title:"标题文字 标题文字 标题文字 标题文字"},{image:"./image/people-big.png",title:"标题文字 标题文字 标题文字 标题文字"},{image:"./image/people-big.png",title:"标题文字 标题文字 标题文字 标题文字"},{image:"./image/people-big.png",title:"标题文字 标题文字 标题文字 标题文字"},{image:"./image/people-big.png",title:"标题文字 标题文字 标题文字 标题文字"},{image:"./image/people-big.png",title:"标题文字 标题文字 标题文字 标题文字"}]},methods:{swiperNext:function swiperNext(){console.log('swiperNext');this.data.swiper2.swipeNext();},swiperPrev:function swiperPrev(){console.log('swiperPrev');this.data.swiper2.swipePrev();},autoSwiperNext:function autoSwiperNext(){console.log('autoSwiperNext');this.data.swiper.swipeNext();},autoSwiperPrev:function autoSwiperPrev(){console.log('autoSwiperPrev');this.data.swiper.swipePrev();}},template:{rightBar:{methods:{toTop:function toTop(){var timer=setInterval(function(){var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;var ispeed=Math.floor(-scrollTop/3);if(scrollTop==0){clearInterval(timer);}document.documentElement.scrollTop=document.body.scrollTop=scrollTop+ispeed;},30);}}},ring:{created:function created(){var r=400;var num=10;var padding=120;var peopleWall=this.domList.peopleWall;var boxList=this.domList.peopleWall.getElementsByClassName('people-box');var wallWidth=peopleWall.offsetWidth;var wallHeight=peopleWall.offsetHeight;var angle=0;for(var index=0;index<boxList.length;index++){var element=boxList[index];var elementWidth=element.offsetWidth;var elementHeight=element.offsetHeight;var x=(wallHeight-elementHeight)/2+r*Math.cos(angle*Math.PI/180);var y=(wallWidth-elementWidth)/2+r*Math.sin(angle*Math.PI/180);boxList[index].style.left=x+'px';boxList[index].style.top=y+'px';var identityList=boxList[index].getElementsByClassName('identity');for(var _index=0;_index<identityList.length;_index++){var _element=identityList[_index];if(x>(wallHeight-elementHeight)/2){_element.style.left="".concat(padding,"px");}else{_element.style.right="".concat(padding,"px");}}angle+=360/num;}},data:{peopleList:[{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"},{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"},{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"},{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"},{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"},{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"},{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"},{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"},{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"},{image:"./image/people1.png",viewpoint:"观点观点观点观点观点观点",identity:"中国建筑材料 <br>集团有限公司 <br>董事长 <br>宋志平"}]}},videoBox:{methods:{toTop:function toTop(){var timer=setInterval(function(){var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;var ispeed=Math.floor(-scrollTop/3);if(scrollTop==0){clearInterval(timer);}document.documentElement.scrollTop=document.body.scrollTop=scrollTop+ispeed;},30);}}}}}}
    