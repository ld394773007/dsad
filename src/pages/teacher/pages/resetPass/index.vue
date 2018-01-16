<template>
  <div class="pages">
    <div class="page">
      <y-header @click-left="clickLeft">
        <van-icon name="arrow-left" slot="left" />
        <p>找回密码</p>
      </y-header>
      <div v-if="visiable">
        <h2 class="title">手机验证</h2>
        <div class="form_container">
          <div class="m_input_item">
            <input class="m_input" type="tel" v-model="mobile" placeholder="手机号">
          </div>
          <div class="m_input_item">
            <input class="m_input" type="text" v-model="captcha" placeholder="验证码">
            <button :disabled="disabled" :class="{'m_btn_disabled': disabled}" @click="send" class="m_btn m_btn_danger captcha_btn">{{captchaBtnText}}</button>
          </div>
          <button :disabled="capBtnDis" :class="{'m_btn_disabled': capBtnDis}" class="m_btn full send_cap" @click="handlerNext"><span style="color: #fff; margin-bottom:0;">下一步</span></button>
        </div>
      </div>
      <div v-else>
        <h2 class="title">设置新密码</h2>
        <div class="form_container">
          <div class="m_input_item">
            <input class="m_input" type="password" v-model="newPassword" @blur="handlerBlur(newPassword)" placeholder="新密码">
          </div>
          <div class="m_input_item">
            <input class="m_input" type="password" v-model="rePassword" @blur="handlerBlur(rePassword)" placeholder="再次输入新密码">
          </div>
          <button :disabled="resetBtnDis" :class="{'m_btn_disabled': resetBtnDis}" class="m_btn full send_cap" @click="handlerReset"><span style="color: #fff; margin-bottom:0;">下一步</span></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'restPass',
  data () {
    return {
      mobile: '',
      captcha: '',
      newPassword: '',
      rePassword: '',
      disabled: false,
      visiable: true,
      countDownTime: 60,
      phoneReg: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/
    }
  },
  computed: {
    capBtnDis () {
      let {mobile, captcha, phoneReg} = this
      return !(mobile !== '' && captcha !== '' && phoneReg.test(mobile))
    },
    resetBtnDis () {
      let {newPassword, rePassword} = this
      return !(newPassword !== '' && rePassword !== '')
    },
    captchaBtnText () {
      if (!this.disabled) return '发送验证码'
      return this.countDownTime + '秒后重发'
    }
  },
  methods: {
    clickLeft () {
      this.$router.go(-1)
    },
    handlerNext () {
      let {post} = this.$axios
      let {captcha, mobile, $dialog} = this
      post('/v1/user/exam-reset-pwd-sms', {
        captcha,
        mobile
      })
      .then(({data}) => {
        if (!data.status) {
          this.visiable = false
        } else {
          $dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    handlerBlur (v) {
      if (v.length < 6) {
        this.$toast('密码长度不能小于6位')
      }
    },
    handlerReset () {
      let {mobile, captcha, newPassword, rePassword, $toast, $dialog} = this
      let {put} = this.$axios
      if (newPassword.length < 6) {
        $toast('密码长度不能小于6位')
        return
      }
      if (rePassword.length < 6) {
        $toast('密码长度不能小于6位')
        return
      }
      if (rePassword !== newPassword) {
        $toast('两次密码输入的内容不同')
        return
      }
      $toast.loading()
      put('/v1/user/reset-pwd', {
        mobile,
        captcha,
        new_password: newPassword,
        re_password: rePassword
      })
      .then(({data}) => {
        $toast.clear()
        if (!data.status) {
          $toast.success('重置成功')
        } else {
          $dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    send () {
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
      sendCaptcha()
    },
    sendCaptcha () {
      let {post} = this.$axios
      let {mobile, $toast, $dialog} = this
      post('/v1/user/send-reset-pwd-sms', {mobile})
      .then(({data}) => {
        $toast.clear()
        if (!data.status) {
          $toast.success('发送成功')
          this.disabled = true
          this.countDown()
        } else {
          $dialog.alert({
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
@import './index';
</style>


