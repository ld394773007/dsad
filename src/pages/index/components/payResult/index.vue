<template>
  <div class="m_wrap" style="z-index: 99">
    <van-nav-bar class="m_header" fixed>
      <span slot="title">预约状态</span>
    </van-nav-bar>
    <div class="m_body pay_result_wrap">
      <span>预约结果</span>
      <div class="pay_result_icon">
        <i></i>
        <p>预约成功</p>
      </div>
      <span>预约</span>
      <div class="m_content">
        <h2 class="m_content_title">{{data.pro_name}}</h2>
        <p class="m_content_subtitle">开始时间：{{startTime}}</p>
        <!-- <div class="price">
          <span>已支付订金:</span><span class="highlight_text weight large"><i>¥</i>{{price}}</span>
        </div> -->
      </div>
    </div>
    <a @click="$router.push('./download')" class="download_btn">去下载叮叮云教室App</a>
  </div>
</template>
<script>
export default {
  name: 'payResult',
  props: ['data', 'startTime', 'price'],
  data () {
    return {
      download_mask: false
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variable/index';
@import '../../assets/scss/minix/index';

.pay_result_wrap > span{
  display: block;
  margin: 16px;
  color: #ADADBD;
}

.download_btn {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  right: 0;
  height: 49px;
  font-size: 16px;
  color: #fff;
  background-color: $color_theme;
}

.pay_result_icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: $color_theme;
  i {
    width: 69px;
    height: 69px;
    margin-bottom: 8px;
    @include dprImg('icon_chenggong');
    background: {
      repeat: no-repeat;
      size: 100%;
    }
  }
}
</style>

