<template>
  <div class="page">
    <div class="left_nav">
      <div class="user_info w100">
        <div class="user_info_avater">
          <img src="/static/images/Avatar_s@3x.png">
        </div>
        <p class="user_info_name">刘德刚</p>
      </div>
      <ul class="nav_tab w100">
        <li class="nav_tab_item" :class="{'active': active === '0'}" @click="changeActive('0')">
          <i class="nav_icon nav_icon_lesson"></i>
          <p>课表</p>
        </li>
        <li class="nav_tab_item" :class="{'active': active === '1'}" @click="changeActive('1')">
          <i class="nav_icon nav_icon_course"></i>
          <p>班级管理</p>
        </li>
        <li class="nav_tab_item" :class="{'active': active === '2'}" @click="changeActive('2')">
          <i class="nav_icon nav_icon_courseware"></i>
          <p>传课件</p>
        </li>
        <li class="nav_tab_item" :class="{'active': active === '3'}" @click="changeActive('3')">
          <i class="nav_icon nav_icon_service"></i>
          <p>联系客服</p>
        </li>
      </ul>
    </div>
    <div class="container">
      <lesson v-show="active === '0'" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      active: '0'
    }
  },
  created () {
    let {active} = this.$route.query
    console.log(active)
    active && (this.active = active)
  },
  methods: {
    changeActive (v) {
      this.active = v
    }
  },
  components: {
    lesson: () => import('./lesson')
  }
}
</script>
<style lang="scss" scoped>
@import './index'
</style>


