<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header border0" fixed left-arrow @click-left="close">
    </van-nav-bar>
    <div class="m_body p_validate">
      <h2 class="p_validate_title">手机验证</h2>
      <div class="p_validate_login">
        <div class="m_validate_input" >
          <span>+86</span>
          <input ref="input" v-model="mobile" type="tel" placeholder="手机号">
        </div>
        <a href="javascript:" class="m_btn full" @click="send(false)"><van-loading v-if="loading" type="circle" color="white" /><span v-else>发送验证码</span></a>
        <p>手机号将作为叮叮云教室上课登录账号</p>
      </div>
    </div>
    <transition name="right-in">
      <captcha @send="send" :mobile="mobile" :isRigister="isRegister" @close="visiable = false" v-if="visiable"></captcha>
    </transition>

  </div>
</template>
<script>
export default {
  name: 'payLogin',
  components: {
    YInput: () => import('@/components/input'),
    captcha: () => import('../../components/captcha')
  },
  data () {
    return {
      mobile: '',
      loading: false,
      visiable: false,
      isRegister: false
    }
  },
  created () {
    this.$toast.clear()
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
  },
  methods: {
    close () {
      this.$router.go(-1)
    },
    send (v) {
      let {mobile} = this
      if (mobile === '' && !v) {
        this.$toast.fail('请填写手机号')
        return
      }

      let {post} = this.$axios
      this.$toast.loading()
      post('/v1/user/send-signup-sms', {mobile: mobile, check: 0})
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.$toast.success('发送成功')
          setTimeout(() => {
            this.$toast.clear()
          }, 1000)
          if (data.data === 'success' && !v) {
            this.isRegister = true
          }
          !v && (this.visiable = true)
        } else {
          this.$dialog.alert({title: '提示', message: data.message})
        }
      })
    }
  }
}
</script>
<style lang="scss">
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


