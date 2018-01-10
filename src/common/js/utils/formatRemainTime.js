 /**
 *
 * @desc   格式化现在距${endTime}的剩余时间
 * @param  {Date} startTime
 * @param  {Date} endTime
 * @return {String}
 */
function formatRemainTime (startTime, endTime) {
  var startDate = new Date(startTime)   // 开始时间
  var endDate = new Date(endTime)  // 结束时间
  var t = endDate.getTime() - startDate.getTime()  // 时间差
  var d = 0
  var h = 0
  var m = 0
  var s = 0
  if (t >= 0) {
    d = Math.floor(t / 1000 / 3600 / 24)
    h = Math.floor(t / 1000 / 60 / 60 % 24)
    m = Math.floor(t / 1000 / 60 % 60)
    s = Math.floor(t / 1000 % 60)
  }
  return d + '天 ' + h + '小时 ' + m + '分钟 ' + s + '秒'
}

export default formatRemainTime
