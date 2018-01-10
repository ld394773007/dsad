<template>
  <div class="share_wrapper m_wrap">
    <div class="share_mask"></div>
    <div class="share_container">
      <div class="share_content">
        <p class="share_title">分享</p>
        <ul>
          <li><a href="javascript:">微信好友</a></li>
          <li><a href="javascript:">微信朋友圈</a></li>
          <li><a href="javascript:">xinlang</a></li>
          <li><a href="javascript:"></a></li>
        </ul>
      </div>
      <a href="javascript:" class="share_close_btn">取消</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'share'
}
</script>
<style lang="scss" scoped>
.share_container {
  background-color: #fafafb;
}
</style>


