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
    <van-number-keyboard
      :show="visiable"
      @input="onInput"
      @delete="onDelete"
    />
  </div>
</template>
<script>
export default {
  name: 'captacha',
  props: {
    mobile: {
      type: String,
      default: ''
    },
    number: {
      type: Number,
      default: 5
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
  created () {
    this.captchaList = Array(this.number)
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
      for (let i = 0; i < this.number; i++) {
        if (!n[i]) {
          arr[i] = ''
        } else {
          arr[i] = n[i]
        }
      }
      this.captchaList = arr

      if (n.length === this.number) {
        this.submit()
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    onInput (key) {
      this.value = (this.value + key).slice(0, this.number)
    },
    onDelete () {
      this.value = this.value.slice(0, this.value.length - 1)
    },
    submit () {
      this.$emit('submit', this.value)
    },
    sendCaptcha () {
      this.$emit('sendCaptcha')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variable/index';
.captcha_wrap {
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
  font-size: 20px;
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


