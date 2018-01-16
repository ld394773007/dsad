// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastClick from 'fastclick'
import axios from 'axios'
import VueQriously from 'vue-qriously'
import dprImg from '@/components/dprImg'
import Header from '@/components/header'
import 'vant/lib/vant-css/index.css'
import './assets/scss/index.scss'
import {removeCookie} from '@/common/js/utils'
import calendar from '@/components/calendar/index.js'
import { DatePicker, Button, Input, Rate } from 'element-ui'

Vue.use(Rate)
Vue.use(Input)
Vue.use(DatePicker)
Vue.use(Button)
Vue.use(calendar)
Vue.use(VueQriously)
Vue.use(dprImg)
Vue.component(Header.name, Header)
fastClick.attach(document.body)

// 与原生应用通讯对象初始化
if (window['_dsbridge&&_dsbridge']) {
  window['_dsbridge&&_dsbridge'].init()
}

Vue.config.productionTip = false
Vue.prototype.$axios = axios
// Vue.prototype.$axios.defaults.baseURL = 'https://www.yingyushu.com/fr_u'
Vue.prototype.$axios.defaults.baseURL = 'http://uc.yys.com'
// Vue.prototype.$axios.defaults.headers = {
//   Authorization: 'Bearer ' + getCookie('teacher')
// }
Vue.prototype.$axios.defaults.validateStatus = (status) => {
  console.log(status)
  if (status === 401 || status === 403 || status === 404) {
    removeCookie('student')
    router.push('/login')
  } else if (status === 200) {
    return true
  }
}

// 实验过渡动画
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function (to, from, next) {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('UPDATE_DIRECTION', 'forward')
    } else {
      store.commit('UPDATE_DIRECTION', 'black')
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('UPDATE_DIRECTION', 'forward')
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
