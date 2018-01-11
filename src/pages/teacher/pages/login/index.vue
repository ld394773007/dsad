<template>
  <div class="pages">
    <y-header>
      <p>登陆</p>
    </y-header>
    <div class="container">
      <div class="logo">
        <img class="logo_img" :src="logoImg">
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
                <input class="m_input" type="text" v-model="code" placeholder="验证码">
                <button class="m_btn m_btn_danger captcha_btn">发送验证码</button>
              </div>
              <a class="m_btn full send_cap" @click="send"><span style="color: #fff; margin-bottom:0;">发送验证码</span></a>
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
  </div>
</template>
<script>
import logoImg from '../../assets/imgs/icon_dd@3x.png'
export default {
  name: 'login',
  data () {
    return {
      logoImg: logoImg,
      active: 0,
      mobile: '',
      password: '',
      code: ''
    }
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
    }
  },
  methods: {
    changeActive (v) {
      this.active = v
    },
    send () {
    },
    login () {
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
.m_tab_wrapper {
  width: 100%;
}
.m_validate_input {
  margin-bottom: 0;
}
</style>


