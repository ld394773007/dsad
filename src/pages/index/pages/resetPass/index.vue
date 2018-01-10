<template>
  <div class="m_wrap white">
    <van-nav-bar class="m_header border0" fixed left-arrow @click-left="close">
    </van-nav-bar>
    <div class="m_body w80" v-show="!visiable1">
      <h2 class="p_validate_title">找回密码</h2>
      <div class="p_validate_login">
        <div class="m_validate_input" >
          <span>+86</span>
          <input ref="input" v-model="mobile" type="tel" placeholder="手机号">
        </div>
        <a href="javascript:" class="m_btn full" @click="sendCaptcha"><span>发送验证码</span></a>
      </div>
    </div>
    <div class="m_body w80" v-show="visiable1">
      <h2 class="p_validate_title">重置密码</h2>
      <div class="m_input_group">
        <input class="m_input" v-model="password" type="password" placeholder="密码">
        <input class="m_input" v-model="repassword" type="password" placeholder="确认密码">
      </div>
      <a class="m_btn full" @click="reset"><span>确认修改</span></a>
    </div>
    <transition name="right-in">
      <captcha
        :number="6"
        v-if="visiable"
        :mobile="mobile"
        @close="visiable = false"
        @sendCaptcha="sendCaptcha"
        @submit="next"
      />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'resetPass',
  data () {
    return {
      mobile: '',
      password: '',
      repassword: '',
      captcha: '',
      visiable: false,
      visiable1: false
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
    // 重置密码
    reset () {
      let {put} = this.$axios
      let {password, repassword, mobile, captcha} = this
      if (!(password !== '' && repassword !== '')) {
        this.$toast('请填写完整信息！')
        return
      }

      if (password !== repassword) {
        this.$toast('两次密码不相同！')
        return
      }
      this.$toast.loading()
      put('/v1/user/reset-pwd', {mobile, captcha, new_password: password, re_password: repassword})
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.$toast.success('修改成功！')
          this.$router.go(-1)
        } else {
          this.$dialog.alert({
            message: data.message
          })
        }
      })
    },
    // 检查找回密码验证码是否正确  并进行下一步
    next (v) {
      let {post} = this.$axios
      let {mobile} = this
      this.$toast.loading()
      post('/v1/user/exam-reset-pwd-sms', {mobile, captcha: v})
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.visiable = false
          this.visiable1 = true
          this.captcha = v
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    // 发送找回密码验证码
    sendCaptcha (v) {
      let {post} = this.$axios
      let {mobile} = this
      this.$toast.loading()
      post('/v1/user/send-reset-pwd-sms', {mobile})
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.$toast.success('发送成功！')
          setTimeout(() => {
            this.$toast.clear()
          }, 500)
          this.visiable = true
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    }
  },
  components: {
    captcha: () => import('../../components/sendCap')
  }
}
</script>
<style lang="scss" scoped>
h2 {
  margin-bottom: 20px;
  font-size: 22px;
  text-align: center;
}
.reset_content {
  margin: 0 auto;
  width: 80%;
}
</style>


