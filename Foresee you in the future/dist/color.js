
function gradientColor(objs, startColor, endColor, step){
    // console.log(startColor, endColor)
    startRGB = colorRgb(startColor)
    startR = startRGB[0];
    startG = startRGB[1];
    startB = startRGB[2];

    endRGB = colorRgb(endColor);
    endR = endRGB[0];
    endG = endRGB[1];
    endB = endRGB[2];

    sR = (endR-startR)/step
    sG = (endG-startG)/step
    sB = (endB-startB)/step
    for(var i = 0; i < step; i++){
        const color = colorRGB2Hex(colorHex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')'));
        //计算每一步的hex值
        setTimeout(() => {
            objs.backgroundColor = color
            // console.log(objs)
            // console.log(color)
        }, i * 50)
        
    }
}

function gradientColor2(startColor, endColor, step, index) {
    // console.log(startColor, endColor)
    startRGB = colorRgb(startColor)
    startR = startRGB[0];
    startG = startRGB[1];
    startB = startRGB[2];

    endRGB = colorRgb(endColor);
    endR = endRGB[0];
    endG = endRGB[1];
    endB = endRGB[2];

    sR = (endR-startR)/step
    sG = (endG-startG)/step
    sB = (endB-startB)/step
    for(var i = 0; i < step; i++){
        const color = colorRGB2Hex(colorHex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')'));
        //计算每一步的hex值
        // console.log(i, index)
        if (i == index) {
            return color
        }
        
    }
    return '#c8c9c9'
}
function colorRGB2Hex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
 
    var hex = "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
 }

// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
function colorRgb(sColor) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = sColor.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return sColorChange;
    }else{
        return sColor;
    }
};

// 将rgb表示方式转换为hex表示方式
function colorHex(rgb) {
    var _this = rgb;
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if(/^(rgb|RGB)/.test(_this)){
        var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            var hex = Number(aColor[i]).toString(16);
            hex = hex<10 ? 0+''+hex :hex;// 保证每个rgb的值为2位
            if(hex === "0"){
                hex += hex;
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = _this;
        }
        return strHex;
    }else if(reg.test(_this)){
        var aNum = _this.replace(/#/,"").split("");
        if(aNum.length === 6){
            return _this;
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return _this;
    }
}
