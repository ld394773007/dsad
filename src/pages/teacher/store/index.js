import Vue from 'vue'
import Vuex from 'vuex'
import {
  CHANGE_USER_INFO,
  UPDATE_USER_INFO,
  UPDATE_DIRECTION
} from './types'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    phoneNum: '',
    lessonList: [],
    editStatus: false,
    direction: 'forward'
  },
  mutations: {
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
    }
  },
  actions: {
  }
})

export default store
