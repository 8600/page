// 解决由于使用transform rotate所引起的PIXI事件响应异常问题

if (PIXI.interaction) {
  PIXI.interaction.InteractionManager.prototype.mapPositionToPoint = function(point, x, y) {
    let rect
  
    // IE 11 fix
    if (!this.interactionDOMElement.parentElement) {
      rect = {x: 0, y: 0, width: 0, height: 0}
    } else {
      rect = this.interactionDOMElement.getBoundingClientRect()
    }
  
    const resolutionMultiplier = navigator.isCocoonJS ? this.resolution : (1.0 / this.resolution)
  
    /*
    * 特殊处理: 强制横屏情况
    */
    if (window.orientation === 0) {
      point.x = (y - rect.top) * (this.interactionDOMElement.width / rect.height) * resolutionMultiplier
      point.y = (1 - (x - rect.left) / rect.width) * this.interactionDOMElement.height * resolutionMultiplier
    } else {
      point.x = ((x - rect.left) * (this.interactionDOMElement.width / rect.width)) * resolutionMultiplier
      point.y = ((y - rect.top) * (this.interactionDOMElement.height / rect.height)) * resolutionMultiplier
    }
  }
}