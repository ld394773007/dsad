<template>
  <div class="m_wrap">
    <div v-show="!active">
      <van-nav-bar class="m_header" fixed right-text="全部课程" @click-right="$router.push('./lesson')">
        <p slot="title">我的课程</p>
      </van-nav-bar>
      <srcoll :data="lessonList" class="m_body is_center class">
        <div class="content">
          <p class="h_title">今日课程</p>
          <span class="h_subtitle">{{lessonList.todayLesson.length}}节课</span>
          <div>
            <lesson-item
              :key="item.id"
              :item="item"
              :index="index"
              v-for="(item, index) in lessonList.todayLesson"
              v-if="lessonList.todayLesson.length"
            ></lesson-item>
            <div class="no_lesson" v-if="!lessonList.todayLesson.length">
              <i class="icon_no_lesson"></i>
              <p>今天没有课程哦~</p>
            </div>
          </div>
          <p class="h_title">近期课程</p>
          <span class="h_subtitle">{{lessonList.nextLesson.length}}节课</span>
          <div>

            <lessonItem
              :key="item.id"
              :item="item"
              :index="index"
              v-for="(item, index) in lessonList.nextLesson"
              v-if="lessonList.nextLesson.length"
            ></lessonItem>
            <div class="no_lesson" v-if="!lessonList.nextLesson.length">
              <i class="icon_no_lesson"></i>
              <p>最近一周没有课程哦~</p>
            </div>
          </div>
          
        </div>
      </srcoll>
    </div>
    <div class="m_body is_center has_top" v-if="active">
      <div class="my_header">
        <router-link to="/editUser" class="my_avater">
          <div class="my_avater_img">
            <img :src="userInfo.avater">
          </div>
        </router-link>
        <div class="my_info_wrap">
          <h2 class="my_name">{{userInfo.realname}}</h2>
          <div class="my_info">
            <p>{{userInfo_en_name}}</p>
            <span>{{phoneNum}}</span>
          </div>
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
           <van-cell to="./lesson" clickable is-link>
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
           <van-cell clickable value="v1.0.0">
            <template slot="title">
              <div class="my_cell_content">
                <i class="cell_icon bb"></i>
                <span>版本</span>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group class="my_cell_group">
          <van-cell title="关于叮叮云教室" is-link/>
        </van-cell-group>
      </div>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item>
        <template slot="icon" slot-scope="props">
          <i class="h_icon class" :class="{'active':props.active}"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item>
        <template slot="icon" slot-scope="props">
          <i class="h_icon my" :class="{'active':props.active}"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import {formatTime} from '@/common/js/utils'
import lessonItem from '../../components/lessonItem'
export default {
  name: 'home',
  data () {
    return {
      active: 0
    }
  },
  created () {
    if (window.sessionStorage.getItem('homeActive')) {
      this.active = Number(window.sessionStorage.getItem('homeActive'))
    }
  },
  watch: {
    active (n) {
      window.sessionStorage.setItem('homeActive', n)
    }
  },
  methods: {
    formatNum (n) {
      let numList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      return numList[n]
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
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
      return {
        todayLesson,
        nextLesson
      }
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
  components: {
    srcoll: () => import('@/components/srcoll'),
    lessonItem
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variable/index';
@import '../../assets/scss/minix/index';
.m_header {
  border-bottom: 1px #e0dfdf solid;
}
.h_icon {
  display: block;
  width: 26px;
  height: 34px;
  background-size: 100%;
  background-repeat: no-repeat;
  &.class {
    @include dprImg('class');
    &.active {
      @include dprImg('class_hl');
    }
  }
  &.my {
    @include dprImg('my');
    &.active {
      @include dprImg('my_hl');
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
  .content {
    padding-bottom: 16px;
  }
}

.has_top {
  top: 0;
}
.my_header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 27px 40px 27px;
  margin-bottom: 12px;
  background-color: #fff;
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
</style>


