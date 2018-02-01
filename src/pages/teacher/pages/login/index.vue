<template>
  <div class="page">
      <div class="container">
        <div class="logo">
          <img class="logo_img" src="/static/images/icon2.png">
          <p class="logo_title">叮叮云教室</p>
          <span class="logo_tag"></span>
        </div>
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
                <div class="m_input_item">
                  <input class="m_input" type="text" v-model="captcha" placeholder="验证码">
                  <a :class="{'m_btn_disabled': disabled}" @click="send" class="m_btn m_btn_danger captcha_btn">{{captchaBtnText}}</a>
                </div>
                <a :class="{'m_btn_disabled': capBtnDis}" class="m_btn full send_cap" @click="_captchaLogin">登录</a>
              </div>
              <div>
                <div class="m_input_group">
                  <input class="m_input" v-model="mobile" type="tel" placeholder="手机号">
                  <input class="m_input" v-model="password" type="password" placeholder="密码">
                </div>
                <a :class="{'m_btn_disabled': passBtnDis}" class="m_btn full" @click="_login">登录</a>
                <a @click="resetShow" class="m_btn m_btn_text wjmm_btn">忘记密码？</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      active: 0,
      mobile: '',
      password: '',
      captcha: '',
      disabled: false,
      countDownTime: 60,
      phoneReg: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/
    }
  },
  created () {
    window.sessionStorage.removeItem('homeActive')
  },
  computed: {
    left () {
      return 50 * this.active + '%'
    },
    style () {
      return {
        'width': '200%',
        '-webkit-transform': `translateX(${-50 * this.active + '%'})`,
        'transform': `translateX(${-50 * this.active + '%'})`
      }
    },
    capBtnDis () {
      let {mobile, captcha, phoneReg} = this
      return !(mobile !== '' && captcha !== '' && phoneReg.test(mobile))
    },
    passBtnDis () {
      let {mobile, password, phoneReg} = this
      return !(mobile !== '' && password !== '' && phoneReg.test(mobile))
    },
    captchaBtnText () {
      if (!this.disabled) return '发送验证码'
      return this.countDownTime + '秒后重发'
    }
  },
  methods: {
    resetShow () {
      this.$emit('reset')
    },
    changeActive (v) {
      this.active = v
    },
    send () {
      if (this.disabled) return
      let {mobile, phoneReg, $toast, sendCaptcha} = this
      if (mobile === '') {
        $toast('手机号不能为空！')
        return
      }
      if (!phoneReg.test(mobile)) {
        $toast('手机号格式不正确！')
        return
      }
      $toast.loading()
      sendCaptcha(1)
    },
    _captchaLogin () {
      if (this.capBtnDis) return
      let {mobile, captcha} = this
      this.$emit('captchaLogin', {
        mobile,
        captcha,
        accountType: 'teacher'
      })
    },
    _login () {
      if (this.passBtnDis) return
      let {mobile, password} = this
      this.$emit('login', {
        mobile,
        password,
        accountType: 'teacher'
      })
    },
    sendCaptcha (check) {
      let {post} = this.$axios
      let {mobile} = this
      post('/v1/user/send-signup-sms', {
        mobile,
        check
      })
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.$toast.success('发送成功！')
          this.disabled = true
          this.countDown()
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    countDown () {
      if (this.countDownTime > 1) {
        this.countDownTime -= 1
        setTimeout(() => {
          this.countDown()
        }, 1000)
      } else {
        this.countDownTime = 60
        this.disabled = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
.m_tab_wrapper {
  width: 100%;
}
.send_cap {
  margin-top: 20px;
}
</style>


