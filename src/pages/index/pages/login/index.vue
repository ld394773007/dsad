<template>
  <div class="m_wrap d_login" ref="wrap">
    <div v-if="maskVisiable" style="background:#fff;position: fixed;left:0;right:0;bottom:0;top:0;z-index:999999;"></div>
    <van-nav-bar class="m_header border0" fixed>
    </van-nav-bar>
    <div class="m_body d_login_content">
      <i class="logo"></i>
      <h2 class="d_login_content_title">进入叮叮云教室</h2>
      <div class="m_tab_wrapper">
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
      </div>
    </div>
    <transition name="right-in">
      <captcha
        key="captcha"
        :mobile="mobile"
        @submit="captchaSubmit"
        @sendCaptcha="send"
        @close="visiable = false"
        v-if="visiable"
      />
    </transition>
    <transition name="right-in">
      <div class="m_wrap register-wrap" v-if="registerVisiable">
        <van-nav-bar class="m_header border0" fixed left-arrow @click-left="registerVisiable = false" fixed>
        </van-nav-bar>
        <div class="m_body register_wrap">
          <h2 class="register_title" style="margin-bottom: 15px;">填写孩子的真实姓名</h2>
          <input class="m_input center" type="text" v-model="realname" placeholder="请填写你孩子的真实姓名" />
          <a href="javascript:" class="m_btn full" @click="registerSubmit"><span>进入叮叮云教室</span></a>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {setCookie, formatTime} from '@/common/js/utils'
export default {
  name: 'login',
  data () {
    return {
      captcha: '',
      active: 0,
      mobile: '',
      password: '',
      visiable: false,
      registerVisiable: false,
      isRegister: false,
      maskVisiable: true,
      realname: '',
      phoneReg: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/
    }
  },
  created () {
    let {k, p, m, versionName} = this.$route.query
    if (k && m && (k !== '')) {
      this.captchaLogin({mobile: m, key: k})
    } else if (p && m && (p !== '')) {
      this.passLogin(m, p, '自动登录失败')
    } else {
      this.maskVisiable = false
    }
    if (versionName) {
      this.$store.commit('UPDATEVERSION', versionName)
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
      let _t = new Date().getTime() + (1000 * 60 * 60 * 24 * 360)
      let t = new Date().getTime() - (1000 * 60 * 60 * 24 * 30)
      let time = formatTime(new Date(t), 'YYYY-MM-DD HH:mm:ss')
      let _time = formatTime(new Date(_t), 'YYYY-MM-DD HH:mm:ss')
      let {get} = this.$axios
      get('/v1/student-lesson/list?expand=course,teacher,assistant,image,room', {
        params: {
          startTime: time,
          endTime: _time,
          pageSize: 100
        }
      })
      .then(({data}) => {
        if (!data.status) {
          this.$store.commit('UPDATE_LESSON_LIST', data.data)
        }
      })
    },
    login () {
      let {mobile, password, phoneReg} = this
      if (mobile === '') {
        this.$dialog.alert({
          title: '提示',
          message: '手机号不能为空'
        })
        return
      }
      if (!phoneReg.test(mobile)) {
        this.$dialog.alert({
          title: '提示',
          message: '请输入有效的手机号'
        })
        return
      }
      if (password === '' || password.length < 6) {
        this.$dialog.alert({
          title: '提示',
          message: '密码不能为空且不能小于6位'
        })
        return
      }
      this.$toast.loading()
      this.passLogin(mobile, password, '提示')
    },
    captchaSubmit (v) {
      if (this.isRegister) {
        this.captcha = v
        this.checkRegister()
      } else {
        this.$toast.loading()
        this.captchaLogin({
          mobile: this.mobile,
          captcha: v
        })
      }
    },
    checkRegister () {
      this.$toast.loading()
      let {mobile, captcha} = this
      let {post} = this.$axios

      post('/v1/user/sign-up-sms', {
        mobile,
        captcha
      }).then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.registerVisiable = true
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
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
    registerSubmit () {
      let {post} = this.$axios
      let {mobile, captcha, realname, registerFn} = this

      if (realname === '') {
        this.$dialog.alert({title: '提示', message: '请填写孩子的姓名！'})
        return
      }
      this.$toast.loading()
      post('/v1/user/one-step-signup', {
        mobile,
        captcha,
        accountType: 'parent',
        realname: realname,
        school: '未填',
        password: mobile.slice(-8),
        repassword: mobile.slice(-8)
      }).then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          setCookie({
            name: 'student',
            value: data.data
          })
          this.$axios.defaults.headers = {
            Authorization: 'Bearer ' + data.data.token
          }
          this.$shopApi.defaults.headers = {
            Authorization: 'Bearer ' + data.data.token
          }
          registerFn({mobile, ...data.data, password: mobile.slice(-8)})
        } else {
          this.$dialog.alert({title: '提示', message: data.message})
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
          if (data.status === 422 && data.message.indexOf('未注册') !== -1) {
            this.register(mobile)
          } else {
            this.$dialog.alert({title: '提示', message: data.message})
          }
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
    captcha: () => import('../../components/sendCap'),
    register: () => import('../../components/register/index')
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/minix/index';
.logo {
  margin: 15px auto;
  display: block;
  width: 70px;
  height: 70px;
  background: url('/static/images/icon2_s.png') no-repeat;
  background-size: 100%;
}
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
.register_wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  .m_input,
  .m_btn {
    margin-bottom: 25px;
    width: 70%;
  }
}
.register_title {
  font-weight: normal;
  font-size: 20px;
  color: #000;
}

.register-wrap.m_wrap {
  z-index: 99999;
}
</style>

