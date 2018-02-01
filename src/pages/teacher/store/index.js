import Vue from 'vue'
import Vuex from 'vuex'
import {
  CHANGE_USER_INFO,
  UPDATE_USER_INFO,
  UPDATE_DIRECTION,
  UPDATE_COURSE_LIST,
  UPDATE_PHONE
} from './types'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    phoneNum: '',
    lessonList: [],
    editStatus: false,
    direction: '',
    courseList: {},
    phone: ''
  },
  mutations: {
    [UPDATE_PHONE] (state, payload) {
      state.phone = payload
    },
    // 更新用户信息
    [UPDATE_USER_INFO] (state, payload) {
      state.userInfo = payload
    },
    // 修改用户信息中的一个值
    [CHANGE_USER_INFO] (state, payload) {
      state.userInfo[payload.key] = payload.value
    },
    [UPDATE_DIRECTION] (state, payload) {
      state.direction = payload
    },
    [UPDATE_COURSE_LIST] (state, payload) {
      state.courseList = payload
    }
  },
  actions: {
  }
})

export default store
