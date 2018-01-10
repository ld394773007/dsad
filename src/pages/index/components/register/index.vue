<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header border0" fixed left-arrow @click-left="close">
    </van-nav-bar>
    <div class="m_body p_validate">
      <h2 class="p_validate_title">注册</h2>
      <div class="p_validate_login">
        <div class="m_validate_input" >
          <span>+86</span>
          <input ref="input" v-model="mobile" type="tel" placeholder="手机号">
        </div>
        <a href="javascript:" class="m_btn full" @click="send"><span>发送验证码</span></a>
        <p>手机号将作为叮叮云教室上课登录账号</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'payLogin',
  props: {
    mobile: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      _mobile: ''
    }
  },
  watch: {
    mobile (n) {
      this.$emit('changeMobile', n)
    }
  },
  created () {
    this.$toast.clear()
    this._mobile = this._mobile
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
  },
  methods: {
    close () {
      this.$emit('close')
    },
    send (v) {
      this.$emit('send', this.mobile)
    }
  }
}
</script>
<style lang="scss" scoped>
.van-hairline--top-bottom::after {
  border-width: 0;
}
.p_validate {
  background-color: #fff;
  &_title {
    font-size: 20px;
    font-weight: normal;
    text-align: center;
    color: #000000;
  }
  &_login {
    padding: 30px;
  }
  p {
    margin-top: 20px;
    text-align: center;
    color: #adadad;
  }
}
.input_content {
  padding: 0 20px;
}
.input_content_captcha {
  display: flex;
  align-items: center;
  button {
    flex: 1;
  }
  label {
    flex: 3;
  }
}
</style>


