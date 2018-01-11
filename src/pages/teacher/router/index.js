import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: () => import('../pages/home')
    // },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/login')
    }
    // 找回密码
    // {
    //   path: '/reset',
    //   name: 'reset',
    //   component: () => import('../pages/resetPass')
    // },
    // {
    //   path: '/editUser',
    //   name: 'editUser',
    //   component: () => import('../pages/editUser')
    // }
  ]
})
