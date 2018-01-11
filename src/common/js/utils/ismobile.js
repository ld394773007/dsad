function ismobile (test) {
  let u = navigator.userAgent
  if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
    if (window.location.href.indexOf('?mobile') < 0) {
      try {
        if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
          return '0'
        } else {
          return '1'
        }
      } catch (e) { }
    }
  } else if (u.indexOf('iPad') > -1) {
    return '0'
  } else {
    return '1'
  }
}

export default ismobile
