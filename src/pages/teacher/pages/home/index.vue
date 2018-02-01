<template>
  <div class="page">
    <div v-show="!loginVis">
      <div class="left_nav">
        <div class="user_info w100">
          <div class="user_info_avater">
            <router-link to="/editUser"><img :src="avater"></router-link>
          </div>
          <p class="user_info_name">{{userInfo.realname}}</p>
        </div>
        <ul class="nav_tab w100">
          <li class="nav_tab_item" :class="{'active': active === '0'}" @click="changeActive('0')">
            <i class="nav_icon nav_icon_lesson"></i>
            <p>课表</p>
          </li>
          <li class="nav_tab_item" :class="{'active': active === '1'}" @click="changeActive('1')">
            <i class="nav_icon nav_icon_course"></i>
            <p>班级管理</p>
          </li>
          <li class="nav_tab_item" :class="{'active': active === '2'}" @click="changeActive('2')">
            <i class="nav_icon nav_icon_courseware"></i>
            <p>传课件</p>
          </li>
          <li class="nav_tab_item" :class="{'active': active === '3'}" @click="changeActive('3')">
            <i class="nav_icon nav_icon_service"></i>
            <p>联系客服</p>
          </li>
        </ul>
      </div>
      <div class="container">
        <lesson :data="userInfo" v-if="active === '0'" />
        <course v-if="active === '1'"/>
        <div class="kf_content" v-show="active === '2'">
          <div class="kj_dialog">
            <p>IPAD端暂不支持课件上传，为您带来的不便深感抱歉！</p>
            <p>为了不影响您的正常教学，请联系叮叮客服协助上传。</p>
          </div>
        </div>
        <div class="kf_content" v-show="active === '3'">
          <div class="kf_dialog"></div>
        </div>
      </div>
    </div>
    <login @captchaLogin="captchaLogin" @login="login" @reset="resetVis = true" @close="closeLogin" v-if="loginVis"/>
    <reset @close="resetVis = false" v-if="resetVis"/>
  </div>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      active: '0',
      resetVis: false,
      loginVis: true
    }
  },
  created () {
    let {k, p, m, active} = this.$route.query
    let {userInfo} = this
    let _active = window.sessionStorage.getItem('homeActive')
    if (k && m && (k !== '')) {
      this.loginVis = false
      this.captchaLogin({mobile: m, key: k, accountType: 'teacher'})
    } else if (p && m && (p !== '')) {
      this.loginVis = false
      this.login({
        mobile: m,
        password: p,
        accountType: 'teacher'
      })
    }
    if (userInfo.user_id) {
      this.loginVis = false
    }
    (k || p || m || active) && this.$router.push('/login')
    active && (this.active = active)
    _active && (this.active = _active)
  },
  mounted () {
    let el = document.getElementById('mask')
    setTimeout(() => {
      el && document.getElementById('mask').remove()
    }, 700)
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    avater () {
      let {userInfo} = this
      if (this.userInfo.sex === 1) {
        return userInfo.avater && userInfo.avater !== '' ? userInfo.avater : '/static/images/avater/avater_man@3x.png'
      } else {
        return userInfo.avater && userInfo.avater !== '' ? userInfo.avater : '/static/images/avater/avater_men@3x.png'
      }
    }
  },
  methods: {
    loginSuc (data) {
      this.$axios.defaults.headers = {
        Authorization: 'Bearer ' + data.token
      }
      this.$store.commit('UPDATE_PHONE', data.mobile)
      this.getUserInfo(data)
    },
    captchaLogin (obj) {
      let {post} = this.$axios
      this.$toast.loading('登录中..')
      post('/v1/user/sms-login', obj)
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.loginSuc({mobile: obj.mobile, ...data.data})
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    login (obj) {
      this.$toast.loading('登录中..')
      let {post} = this.$axios
      post('/v1/user/login', obj)
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.loginSuc({token: data.data, mobile: obj.mobile, password: obj.password})
        } else {
          this.loginVis = true
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    getUserInfo (v) {
      let {get} = this.$axios
      get('/v1/member/profile')
      .then(({data}) => {
        if (!data.status) {
          this.$store.commit('UPDATE_USER_INFO', data.data)
          let {mobile, token} = v
          let obj = {
            mobile,
            token
          }
          if (v.key) {
            obj.key = v.key
          } else if (v.password) {
            obj.password = v.password
          }
          this.loginVis = false
          let info = JSON.parse(JSON.stringify(Object.assign(data.data, obj)))
          if (window.dsBridge) {
            let res = window.dsBridge.call('doInfoClick', info)
            res && console.log(res)
          }
        }
      })
    },
    closeLogin () {
      this.loginVis = false
    },
    changeActive (v) {
      this.active = v
      window.sessionStorage.setItem('homeActive', v)
    }
  },
  components: {
    lesson: () => import('./lesson'),
    course: () => import('./course'),
    login: () => import('../login'),
    reset: () => import('../resetPass')
  }
}
</script>
<style lang="scss" scoped>
@import './index'
</style>


