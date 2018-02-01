import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../pages/index.vue'),
      children: [
        {
          path: 'login',
          name: 'home',
          component: () => import('../pages/home')
        },
        {
          path: '/editUser',
          name: 'editUser',
          component: () => import('../pages/editUser')
        },
        {
          path: '/addLesson',
          name: 'addLesson',
          component: () => import('../pages/addLesson')
        },
        {
          path: '/courseDetails',
          name: 'courseDetails',
          component: () => import('../pages/courseDetails')
        }
      ]
    }
  ]
})
