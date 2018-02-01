<template>
  <div class="m_wrap">
     <van-nav-bar class="m_header" fixed left-arrow @click-left="$router.go(-1)">
        <span slot="title">云教室</span>
      </van-nav-bar>
      <div class="m_body normal">
        <img class="img" src="/static/images/about.jpg">
      </div>
  </div>
</template>
<script>
export default {
  name: 'about'
}
</script>
<style lang="scss" scoped>
.m_body {
  background-color: #fff;
}
.img {
  width: 100%;
}
</style>


