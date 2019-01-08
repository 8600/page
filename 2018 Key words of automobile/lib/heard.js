'use strict'
const fs = require('fs')
const Templet = require('./templet')

// 处理Heard
function heardHandle (headPath, htmlText) {
  // 取出所有Heard标识
  const heardTempletArr = Templet.cutStringArray(htmlText, "<!-- *head-", "* -->")
  heardTempletArr.forEach(element => {
    // 判断head模板目录中是否有指定heard
    const headFilePath = `${headPath}${element}.head`
    if (fs.existsSync(headFilePath)) {
      // 读取出Head模板内容
      const headFileContent = fs.readFileSync(headFilePath, 'utf8')
      // 解析出head内容
      const headContent = Templet.cutString(headFileContent, '<templet>', '</templet>')
      htmlText = htmlText.replace(`<!-- *head-${element}* -->`, headContent)
    } else {
      console.error(`heard模板:${headFilePath}不存在!`)
    }
  })
  return htmlText
}
module.exports = heardHandle