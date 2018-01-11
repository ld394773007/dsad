import Vue from 'vue'
import Vuex from 'vuex'
import {
  CHANGE_USER_INFO,
  UPLOAD_USER_INFO,
  UPDATE_LESSON_LIST,
  CHANGE_USER_STATUS,
  UPLOAD_PHONE_NUM
} from './types'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    phoneNum: '',
    lessonList: [],
    editStatus: false
  },
  mutations: {
    // 更新用户信息
    [UPLOAD_USER_INFO] (state, payload) {
      state.userInfo = payload
    },
    // 修改用户信息中的一个值
    [CHANGE_USER_INFO] (state, payload) {
      state.userInfo[payload.key] = payload.value
    },
    // 更新课程列表
    [UPDATE_LESSON_LIST] (state, payload) {
      state.lessonList = payload
    },
    [CHANGE_USER_STATUS] (state, payload) {
      state.editStatus = payload
    },
    [UPLOAD_PHONE_NUM] (state, payload) {
      state.phoneNum = payload
    }
  },
  actions: {
  }
})

export default store
