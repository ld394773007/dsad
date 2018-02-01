import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../pages/home')
    },
    {
      path: '/download',
      name: 'home',
      component: () => import('../pages/download')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/about')
    },
    // 商品详情
    {
      path: '/details',
      name: 'details',
      component: () => import('../pages/details')
    },
    // 付款结果
    {
      path: '/payResult',
      name: 'payResult',
      component: () => import('../components/payResult')
    },
    // 付款页面验证登陆
    {
      path: '/payLogin',
      name: 'payLogin',
      component: () => import('../components/payLogin')
    },
    // 登陆
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/login')
    },
    // 找回密码
    {
      path: '/reset',
      name: 'reset',
      component: () => import('../pages/resetPass')
    },
    {
      path: '/editUser',
      name: 'editUser',
      component: () => import('../pages/editUser')
    },
    {
      path: '/feedblack',
      name: 'feedblack',
      component: () => import('../pages/feedblack')
    },
    {
      path: '/lesson',
      name: 'lesson',
      component: () => import('../pages/lessonList')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../pages/order')
    }
  ]
})
