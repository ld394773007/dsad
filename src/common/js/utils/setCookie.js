function setCookie (opt) {
  var option = Object.assign({name: '', value: '', time: 30, path: ''}, opt)
  var Days = option.time
  var exp = new Date()
  var id = option.name
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  console.log(id + '=' + escape(option.value) + ';expires=' + exp.toGMTString() + ';path=/;domain=' + option.path)
  document.cookie = id + '=' + escape(option.value) + ';expires=' + exp.toGMTString() + ';path=/;domain=' + option.path
}

export default setCookie
