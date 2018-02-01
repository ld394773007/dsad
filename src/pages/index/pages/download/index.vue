<template>
  <div class="m_wrap">
    <div class="bg"></div>
    <div class="text" @click="download"></div>
    <div v-if="download_mask" class="download_mask">
      <div class="download_mask_header">
        <div>
          <p>请点击右上角菜单</p>
          <p>在 "在浏览器中打开" 或 "在Safari中打开" </p>
        </div>
        <i></i>
      </div>
    </div>
  </div>
</template>
<script>
import {ismobile} from '@/common/js/utils'
export default {
  data () {
    return {
      download_mask: false
    }
  },
  created () {
    let {is_weixin} = this
    if (is_weixin() && ismobile(0) !== '0') {
      this.download_mask = true
    }
  },
  methods: {
    download () {
      if (ismobile(0) === '0') {
        window.location = 'https://itunes.apple.com/cn/app/%E5%8F%AE%E5%8F%AE%E4%BA%91%E6%95%99%E5%AE%A4-phone/id1335549367?l=zh&ls=1&mt=8'
      } else {
        window.location = 'http://www.dingdingclass.com/app_download/ding.apk'
      }
    },
    is_weixin () {
      var ua = window.navigator.userAgent.toLowerCase()
      return /MicroMessenger/i.test(ua)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/minix/index';

.bg, .text{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.bg {
  @include dprImg('background', 'jpg');
  background-size: 100%;
}

.text {
  @include dprImg('group');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 90%;
}

</style>


