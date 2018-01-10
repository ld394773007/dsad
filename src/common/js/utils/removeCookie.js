import getCookie from './getCookie'

function removeCookie (options) {
  var opt = Object.assign({name: '', domain: ''}, options)
  var id = opt.name
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(opt.name)
  if (cval != null) {
    document.cookie = id + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/;domain=' + opt.domain
  }
}
export default removeCookie
