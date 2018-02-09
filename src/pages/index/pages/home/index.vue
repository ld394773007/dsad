<template>
  <div class="m_wrap">
    <findLesson @pullDown="getLessonList" :listData="listData" v-if="!active"></findLesson>
    <practice @pullDown="getTestList" :data="testData" v-if="active == 1"></practice>
    <div v-if="active == 2">
      <van-nav-bar class="m_header" fixed right-text="全部课程" @click-right="goLesson">
        <p slot="title">我的课程</p>
      </van-nav-bar>
      <div class="no_login_lesson m_body" v-if="!userInfo.id">
        <i></i>
        <p>登录后即可查看</p>
        <a class="m_btn" @click="__login">登录</a>
      </div>
      <srcoll
        v-if="userInfo.id"
        ref="scroll"
        class="m_body is_center class"
        :pullDownRefresh="true"
        @pullingDown="onPullingDown"
      >
        <div class="content">

          <p class="h_title">今日课程</p>
          <span class="h_subtitle">{{lessonList[0].length}}节课</span>
          <div>
            <lesson-item
              :key="item.id"
              :item="item"
              :index="index"
              v-for="(item, index) in lessonList[0]"
              v-if="lessonList[0].length"
            ></lesson-item>
            <div class="no_lesson" v-if="!lessonList[0].length">
              <i class="icon_no_lesson"></i>
              <p>今天没有课程哦~</p>
            </div>
          </div>
          <p class="h_title">近期课程</p>
          <span class="h_subtitle">{{lessonList[1].length}}节课</span>
          <div>

            <lessonItem
              :key="item.id"
              :item="item"
              :index="index"
              v-for="(item, index) in lessonList[1]"
              v-if="lessonList[1].length"
            ></lessonItem>
            <div class="no_more" v-if="lessonList[1].length">
              没有更多内容了
            </div>
            <div class="no_lesson" v-if="!lessonList[1].length">
              <i class="icon_no_lesson"></i>
              <p>最近一周没有课程哦~</p>
            </div>
          </div>

        </div>
      </srcoll>
    </div>
    <div class="m_body is_center has_top" v-if="active == 3">
      <div class="my_header">
        <div class="my_header_content">
          <router-link to="/editUser" class="my_avater"  :class="{'no_login': !userInfo.id}">
            <div class="my_avater_img">
              <img :src="avater" v-if="userInfo.id">
            </div>
          </router-link>
          <div class="my_info_wrap" v-if="userInfo.id">
            <h2 class="my_name">{{userInfo.realname}}</h2>
            <div class="my_info">
              <p>{{userInfo_en_name}}</p>
              <span>{{phoneNum}}</span>
            </div>
          </div>
          <a class="m_btn" v-else type="primary" style="width: 100px;margin-top:15px;" @click="__login">登录</a>
        </div>
      </div>
      <div class="my_body">
        <van-cell-group class="my_cell_group">
          <!-- <van-cell to="/order" clickable is-link>
            <template slot="title">
              <div class="my_cell_content">
                <i class="cell_icon dd"></i>
                <span>我的预约</span>
              </div>
            </template>
          </van-cell> -->
           <van-cell @click="goLesson" clickable is-link>
            <template slot="title">
              <div class="my_cell_content">
                <i class="cell_icon kc"></i>
                <span>我的课程</span>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group class="my_cell_group">
           <van-cell to="./feedblack" clickable is-link>
            <template slot="title">
              <div class="my_cell_content">
                <i class="cell_icon fk"></i>
                <span>意见反馈</span>
              </div>
            </template>
          </van-cell>
           <van-cell clickable :value="'v' + version" @click="checkVersion" is-link>
            <template slot="title">
              <div class="my_cell_content">
                <i class="cell_icon bb"></i>
                <span>版本</span>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group class="my_cell_group">
          <van-cell @click="showEwm = true" title="联系客服" is-link/>
          <van-cell title="关于叮叮云教室" to="/about" is-link/>
        </van-cell-group>
      </div>
    </div>
    <van-tabbar v-model="active" class="nav_tabbar">
      <van-tabbar-item class="nav_item" :class="{[item]: true, 'active': active == i}" :key="i" v-for="(item, i) in navItem">
      </van-tabbar-item>
      </van-tabbar-item>
    </van-tabbar>
    <van-popup v-model="showEwm" :overlay="true">
      <i class="icon_ewm"></i>
    </van-popup>
  </div>
</template>
<script>
import {formatTime} from '@/common/js/utils'
import lessonItem from '../../components/lessonItem'
export default {
  name: 'home',
  data () {
    return {
      navItem: ['findClass', 'subject', 'class', 'my'],
      active: 0,
      listData: [],
      testData: false,
      showEwm: false
    }
  },
  created () {
    let {versionName} = this.$route.query
    if (versionName) {
      this.$store.commit('UPDATEVERSION', versionName)
    }
    if (window.sessionStorage.getItem('homeActive')) {
      this.active = Number(window.sessionStorage.getItem('homeActive'))
    }
    this.getLessonList()
    this.getTestList()
  },
  watch: {
    active (n) {
      window.sessionStorage.setItem('homeActive', n)
    }
  },
  methods: {
    __login () {
      this.$store.commit('CHANGE_LOGIN_STATUS', true)
    },
    getTestList () {
      let {get} = this.$axios

      get('/v1/train-paper/list').then(({data}) => {
        if (!status) {
          this.testData = data.data.sort((a, b) => {
            return a.is_elite < b.is_elite
          })
        }
      })
    },
    getLessonList () {
      let {get} = this.$shopApi

      get('/v1/product/hot').then(({data}) => {
        if (!status) {
          this.listData = data.data
        }
      })
    },
    goLesson () {
      if (!this.userInfo.id) {
        this.$store.commit('CHANGE_LOGIN_STATUS', true)
      } else {
        this.$router.push('./lesson')
      }
    },
    checkVersion () {
      this.$toast.loading()
      if (window.dsBridge) {
        let res = window.dsBridge.call('doUpdateClick')
        if (res) {
          this.$toast.clear()
        }
      }
    },
    onPullingDown () {
      this.getLesson()
    },
    getLesson () {
      let {get} = this.$axios
      let _t = new Date().getTime() + (1000 * 60 * 60 * 24 * 360)
      let t = new Date().getTime() - (1000 * 60 * 60 * 24 * 30)
      let time = formatTime(new Date(t), 'YYYY-MM-DD HH:mm:ss')
      let _time = formatTime(new Date(_t), 'YYYY-MM-DD HH:mm:ss')
      get('/v1/student-lesson/list?expand=course,teacher,assistant,image,room', {
        params: {
          startTime: time,
          endTime: _time,
          pageSize: 100
        }
      })
      .then(({data}) => {
        if (!data.status) {
          this.$store.commit('UPDATE_LESSON_LIST', data.data)
        }
        this.$refs.scroll.forceUpdate()
      })
    },
    formatNum (n) {
      let numList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      return numList[n]
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    version () {
      return this.$store.state.version
    },
    avater () {
      let {userInfo} = this
      if (!userInfo.id) {
        return ''
      }
      if (this.userInfo.sex === 1) {
        return userInfo.avater && userInfo.avater !== '' ? userInfo.avater : '/static/images/avater/avater_boy@3x.png'
      } else {
        return userInfo.avater && userInfo.avater !== '' ? userInfo.avater : '/static/images/avater/avater_gril@3x.png'
      }
    },
    lessonList () {
      let lessonList = this.$store.state.lessonList
      let todayTime = formatTime(new Date(), 'YYYY-MM-DD')
      let todayLesson = []
      let nextLesson = []
      lessonList.forEach(e => {
        let time = e.start_time.split(' ')
        if (time[0] === todayTime) {
          todayLesson.push(e)
        } else if (time[0] > todayTime) {
          nextLesson.push(e)
        }
      })
      setTimeout(() => {
        lessonList.length && this.$refs.scroll.refresh()
      }, 500)
      return [
        todayLesson,
        nextLesson
      ]
    },
    phoneNum () {
      let num = this.$store.state.phoneNum
      if (num === '' || !num) {
        return '未绑定手机'
      }
      let phoneNum = num.slice(0, 3) + '****' + num.slice(-4)
      return phoneNum
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/payResult') {
      next(vm => {
        vm.getTestList()
      })
    } else {
      next()
    }
  },
  components: {
    srcoll: () => import('@/components/srcoll'),
    lessonItem,
    findLesson: () => import('./findLesson'),
    practice: () => import('./practice')
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variable/index';
@import '../../assets/scss/minix/index';
.icon_ewm {
  display: block;
  width: 200px;
  height: 200px;
  @include dprImg('ewm');
  background-size: 100%;
  background-repeat: no-repeat;
}
.no_login_lesson {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  bottom: 50px;
  i {
    display: block;
    width: 102px;
    height: 78px;
    @include dprImg('login');
    background-size: 100%;
    background-repeat: no-repeat;
    margin-bottom: 15px;
  }
  p {
    margin-bottom: 20px;
  }
  .m_btn {
    width: 100px;
  }
}
.m_header {
  border-bottom: 1px #e0dfdf solid;
}
.nav_tabbar  {
  padding-top: 5px;
  border-top: 1px #e5e5e5 solid;
}
.nav_item {
  background-size: 120%;
  background-position: center;
  background-repeat: no-repeat;
  &.findClass {
    @include dprImg('/zhaoke/findClass');
    &.active {
      @include dprImg('/zhaoke/findClass_hl');
    }
  }
  &.subject {
    @include dprImg('/zhaoke/subject');
    &.active {
      @include dprImg('/zhaoke/subject_hl');
    }
  }
  &.class {
    @include dprImg('/zhaoke/class');
    &.active {
      @include dprImg('/zhaoke/class_hl');
    }
  }
  &.my {
    @include dprImg('/zhaoke/my');
    &.active {
      @include dprImg('/zhaoke/my_hl');
    }
  }
}
.h_title {
  margin-top: 16px;
  font-size: 18px;
  line-height: 25px;
  color: #34a9ff;
}
.h_subtitle {
  display: block;
  margin-top: 4px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #9d9caf;
}
.m_body.class {
  padding: 0 16px;
  bottom: 50px;
  .content {
    padding-bottom: 16px;
  }
}

.has_top {
  top: 0;
}
.my_header {
  box-sizing: border-box;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 27px 40px 27px;
  margin-bottom: 12px;
  background-color: #fff;

  &_content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

  }
}
.my_avater {
  position: relative;
  display: block;
  .my_avater_img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    text-align: center;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }

  &:after {
      content: '';
      position: absolute;
      right: -46px;
      top: 50%;
      width: 8px;
      height: 10px;
      @include dprImg('pointer');
      transform: translateY(-50%);
      background-size: 100%;
    }
  &.no_login::after {
    display: none;
  }
}


.my_avater_img {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  text-align: center;
  overflow: hidden;
  @include dprImg('Avatar_s');
  background-size: 100%;
  img {
    width: 100%;
  }
  &:after {
    content: '';
    position: absolute;
    right: -46px;
    top: 50%;
    width: 30px;
    height: 40px;
    @include dprImg('class');
    transform: translateY(-50%);
    background-size: 100%;
  }
}

.my_info_wrap {
  margin-top: 30px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  color: #ADADBD;
  .my_name {
    font-size: 36px;
    line-height: 36px;
    color: $color_theme;
  }
  .my_info {
    position: relative;
    text-align: right;
    font-size: 17px;
    p {
      margin-bottom: 9px;
      font-size: 20px;
      color: #0B0817;
    }
    &:after {
      content: '';
      position: absolute;
      left: -20px;
      top: 50%;
      height: 74px;
      width: 1px;
      background-color: $color_theme;
      transform: translateY(-50%) rotate(30deg);
    }
  }
}

.my_body {
  padding: 0 16px;
}
.my_cell_group {
  margin-bottom: 15px;
}
.my_cell_content {
  display: flex;
  align-items: center;
}
.cell_icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 20px;
  background-size: 100%;
  &.dd {
    @include dprImg('my_order');
  }
  &.fk {
    @include dprImg('my_feedblack');
  }
  &.kc {
    @include dprImg('class_hl');
  }
  &.bb {
    @include dprImg('my_system');
  }
}

.no_lesson {
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #ADADBD;
  .icon_no_lesson {
    display: block;
    margin-bottom: 15px;
    width: 64px;
    height: 52px;
    @include dprImg('class_kong');
    background-size: 100%;
  }
}
@media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
  .my_header {
      padding-top: 44px;
  }
}
</style>


