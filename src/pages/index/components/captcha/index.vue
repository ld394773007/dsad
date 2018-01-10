<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header border0" fixed left-arrow @click-left="close">
    </van-nav-bar>
    <div class="m_body captcha_wrap">
      <h2 class="captcha_title">输入验证码</h2>
      <span>验证码已发送至 +86 {{phone}}</span>
      <div class="captcha_content" >
        <span class="captcha_input" v-for="item in captchaList">{{item}}</span>
      </div>
      <div class="captcha_feedback">
        <span v-if="num" class="captcha_feedback_message">接收短信大概需要<i>{{num}}</i>秒</span>
        <a href="javascript:" @click="sendCaptcha" v-else>重新发送</a>
      </div>
    </div>
    <transition name="right-in">
      <div class="m_wrap" v-if="!visiable">
        <van-nav-bar class="m_header border0" fixed left-arrow @click-left="closeRegister" fixed>
        </van-nav-bar>
        <div class="m_body captcha_wrap">
          <h2 class="register_title" style="margin-bottom: 15px;">填写孩子姓名</h2>
          <input class="m_input center" type="text" v-model="realname" placeholder="请填写你孩子的姓名" />
          <a href="javascript:" class="m_btn full" @click="register"><span>下一步</span></a>
        </div>
      </div>
    </transition>
    <van-number-keyboard
      :show="visiable"
      @input="onInput"
      @delete="onDelete"
    />
  </div>
</template>
<script>
import {setCookie} from '@/common/js/utils'
export default {
  name: 'captacha',
  props: {
    mobile: {
      type: String,
      default: ''
    },
    isRegister: {
      type: Boolean,
      default: false
    },
    registerFn: {
      type: Function
    },
    loginFn: {
      type: Function
    }
  },
  data () {
    return {
      captchaList: ['', '', '', '', ''],
      value: '',
      realname: '',
      visiable: true,
      loading: false,
      num: 60
    }
  },
  mounted () {
    let time = setInterval(() => {
      if (this.num === 0) {
        clearInterval(time)
      } else {
        this.num -= 1
      }
    }, 1000)
  },
  computed: {
    phone () {
      let {mobile} = this
      if (mobile === '') {
        return ''
      }
      let num = mobile.split('')
      num[2] = num[2] + ' '
      num[6] = num[6] + ' '
      return num.join('')
    }
  },
  watch: {
    value (n) {
      let arr = []
      for (let i = 0; i < 5; i++) {
        if (!n[i]) {
          arr[i] = ''
        } else {
          arr[i] = n[i]
        }
      }
      this.captchaList = arr

      if (n.length === 5) {
        this.send()
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    closeRegister () {
      this.visiable = true
      this.value = ''
    },
    onInput (key) {
      this.value = (this.value + key).slice(0, 5)
    },
    onDelete () {
      this.value = this.value.slice(0, this.value.length - 1)
    },
    send () {
      if (this.isRegister) {
        this.visiable = false
      } else {
        this.login()
      }
    },
    register () {
      this.$toast.loading()
      let {post} = this.$axios
      let {mobile, value, realname} = this
      post('/v1/user/one-step-signup', {
        mobile,
        captcha: value,
        accountType: 'parent',
        realname: realname,
        school: '未填',
        password: mobile.slice(-7),
        repassword: mobile.slice(-7)
      })
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
          this.registerFn && this.registerFn({mobile, ...data.data, password: mobile.slice(-7)})
          !this.registerFn && this.$router.go(-1)
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    login () {
      this.$toast.loading()
      let {post} = this.$axios
      let {mobile, value} = this
      post('/v1/user/sms-login', {mobile, captcha: value})
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
          this.loginFn && this.loginFn({mobile, ...data.data})
          !this.loginFn && this.$router.go(-1)
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    sendCaptcha () {
      this.$emit('send')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variable/index';
.captcha_wrap {
  top: 45px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  .m_input,
  .m_btn {
    margin: 10px;
    width: 74%;
  }
}
.captcha_wrap > span {
  margin-top: 10px;
  text-align: center;
  color: #ADADBD;
}

.captcha_title,
.register_title {
  font-weight: normal;
  font-size: 20px;
  color: #000;
}

.captcha_feedback {
  margin-top: 10px;
  text-align: center;
  color: #ADADBD;
  &_message i{
    margin: 0 4px;
  }
  a {
    color: $color_theme;
  }
}

.captcha_content {
  display: flex;
  margin: 20px auto;
  width: 80%;
  border-radius: 4px;
  border: 1px #e5e5e5 solid;
  .captcha_input {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 45px;
    font-size: 18px;
    font-weight: bold;
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      border-right: 1px #e5e5e5 solid;
    }
    &:last-child:after {
      border: none;
    }
  }
}
</style>


