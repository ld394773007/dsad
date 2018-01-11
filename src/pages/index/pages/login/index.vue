<template>
  <div class="m_wrap d_login" ref="wrap">
    <div v-if="maskVisiable" style="background:#fff;position: fixed;left:0;right:0;bottom:0;top:0;z-index:999999;"></div>
    <van-nav-bar class="m_header border0" fixed>
    </van-nav-bar>

    <div class="m_body d_login_content">
      <h2 class="d_login_content_title">登录叮叮云教室</h2>
      <div class="m_tab_wrapper">
        <div class="m_tab_nav" >
          <a class="m_tabs" @click="changeActive(0)">验证码登陆</a>
          <a class="m_tabs" @click="changeActive(1)">密码登陆</a>
          <i class="m_tab_line" :style="{'left': left}"></i>
        </div>
        <div class="m_tab_content">
          <div class="m_tab_content_wrap" :style="style">
            <div>
              <div class="m_validate_input" >
                <span>+86</span>
                <input ref="input" v-model="mobile" type="tel" placeholder="手机号">
              </div>
              <a class="m_btn full send_cap" @click="send(false)"><span style="color: #fff; margin-bottom:0;">发送验证码</span></a>
            </div>
            <div>
              <div class="m_input_group">
                <input class="m_input" v-model="mobile" type="text" placeholder="手机号">
                <input class="m_input" v-model="password" type="password" placeholder="密码">
              </div>
              <a class="m_btn full" @click="login"><span>登录</span></a>
              <router-link to="/reset" class="m_btn m_btn_text wjmm_btn">忘记密码？</router-link>
            </div>
          </div>
        </div>
        <div class="fixed_bottom_content">
          <p>没有账号？<a class="m_btn m_btn_text" @click="registerVisiable = true">注册</a></p>
        </div>
      </div>
    </div>
    <register
      key="register"
      v-if="registerVisiable"
      @close="registerVisiable = false"
      @send="register"
      @changeMobile="changeMobile"
    />
    <transition name="right-in">
      <captcha
        key="captcha"
        :isRegister="isRegister"
        :loginFn="loginFn"
        :registerFn="registerFn"
        :mobile="mobile"
        @send="send"
        @close="visiable = false"
        v-if="visiable"
      />
    </transition>

  </div>
</template>
<script>
import {setCookie} from '@/common/js/utils'
export default {
  name: 'login',
  data () {
    return {
      active: 0,
      mobile: '',
      password: '',
      visiable: false,
      registerVisiable: false,
      isRegister: false,
      maskVisiable: true
    }
  },
  created () {
    let {k, p, m} = this.$route.query
    if (k && m && (k !== '')) {
      this.captchaLogin({mobile: m, key: k})
    } else if (p && m && (p !== '')) {
      this.passLogin(m, p, '自动登录失败')
    } else {
      this.maskVisiable = false
    }
  },
  methods: {
    refresh () {
      this.refreshing = true
    },
    changeMobile (n) {
      this.mobile = n
    },
    changeActive (v) {
      this.active = v
    },
    loginFn (data) {
      this.$router.push('home')
      this.getUserInfo(data)
      this.getLesson()
    },
    registerFn (data) {
      this.$router.push('home')
      this.getUserInfo(data)
      this.getLesson()
    },
    getUserInfo (v) {
      let {get} = this.$axios
      get('/v1/member/profile')
      .then(({data}) => {
        if (!data.status) {
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
          window.localStorage.setItem('phoneNum', mobile)
          this.$store.commit('UPLOAD_PHONE_NUM', mobile)
          this.$store.commit('UPLOAD_USER_INFO', data.data)
          let info = JSON.parse(JSON.stringify(Object.assign(data.data, obj)))
          if (window.dsBridge) {
            let res = window.dsBridge.call('doInfoClick', info)
            res && console.log(res)
          }
        }
      })
    },
    getLesson () {
      let {get} = this.$axios
      get('/v1/student-lesson/list?expand=course,teacher,assistant,image,room')
      .then(({data}) => {
        if (!data.status) {
          this.$store.commit('UPDATE_LESSON_LIST', data.data)
        }
      })
    },
    login () {
      this.$toast.loading()
      let {mobile, password} = this
      this.passLogin(mobile, password, '提示')
    },
    captchaLogin (obj) {
      let {post} = this.$axios
      post('/v1/user/sms-login', obj)
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          setCookie({
            name: 'student',
            value: data.data.token
          })
          this.$axios.defaults.headers = {
            Authorization: 'Bearer ' + data.data.token
          }
          this.$shopApi.defaults.headers = {
            Authorization: 'Bearer ' + data.data.token
          }
          this.loginFn({mobile: obj.mobile, ...data.data})
        } else {
          this.maskVisiable = false
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    passLogin (mobile, password, text) {
      let {post} = this.$axios
      post('/v1/user/login', {mobile, password, accountType: 'student'})
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          setCookie({
            name: 'student',
            value: data.data
          })
          this.$axios.defaults.headers = {
            Authorization: 'Bearer ' + data.data
          }
          this.$shopApi.defaults.headers = {
            Authorization: 'Bearer ' + data.data
          }
          this.loginFn({token: data.data, mobile, password})
        } else {
          this.maskVisiable = false
          this.$dialog.alert({
            title: text,
            message: data.message
          })
        }
      })
    },
    register (m) {
      this.sendCaptcha(m, 0, (data) => {
        this.$toast.success('发送成功')
        setTimeout(() => {
          this.$toast.clear()
        }, 1000)
        this.isRegister = true
        this.visiable = true
      })
    },
    send (v) {
      let {mobile} = this
      if (mobile === '' && !v) {
        this.$toast.fail('请填写手机号')
        return false
      }

      this.sendCaptcha(mobile, 1, (data) => {
        this.$toast.success('发送成功')
        setTimeout(() => {
          this.$toast.clear()
        }, 1000)
        this.visiable = true
      })
    },
    sendCaptcha (mobile, check, fn) {
      let {post} = this.$axios
      this.$toast.loading()
      post('/v1/user/send-signup-sms', {mobile, check})
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          fn && fn(data)
        } else {
          this.$dialog.alert({title: '提示', message: data.message})
        }
      })
    }
  },
  computed: {
    left () {
      return 50 * this.active + '%'
    },
    style () {
      return {
        'width': '200%',
        'transform': `translateX(${-50 * this.active + '%'})`
      }
    }
  },
  components: {
    captcha: () => import('../../components/captcha/index'),
    register: () => import('../../components/register/index')
  }
}
</script>
<style lang="scss" scoped>
.d_login {
  background-color: #fff;
}

.d_login_content {
  &_title {
    margin-bottom: 10px;
    font-size: 22px;
    font-weight: normal;
    text-align: center;
    color: #000000;
  }
  .m_tab_wrapper {
    margin: 0 auto;
    width: 80%;
  }
}

.m_tab_content .m_validate_input span {
  position: relative;
    padding: 0 8px;
    display: block;
    font-weight: bold;
    margin-bottom: 0;
    color: #000;
}

.m_tab_content .send_cap {
  margin-bottom: 0;
  color: #fff;
}

.wjmm_btn {
  width: 100%;
  margin-top: 5px;
  color: #ccc;
  text-align: center;
}
</style>

