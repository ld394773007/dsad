<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header" fixed left-arrow @click-left="close">
      <span slot="title">课程列表</span>
    </van-nav-bar>
    <div class="loading_content" v-if="show">
      <van-loading style="width: 22px; height: 22px;" type="circle" color="black" />
    </div>
    <div class="m_body" v-if="!show">

      <van-tabs :active="active" @click="handleClick">
        <van-tab title="待上课程">
          <srcoll
            v-if="!active"
            :data="lessonList"
            ref="scroll"
            class="srcoll_content"
            :pullDownRefresh="!!lessonList.length"
            @pullingDown="onPullingDown(1)"
          >
            <div class="content">
              <div class="w100">
                  <div class="no_lesson" v-if="!lessonList.length">
                    <i class="icon_no_lesson"></i>
                    <p>没有待上的课程哦~</p>
                  </div>
                  <lessonItem :key="item.id" :item="item" :index="index" v-for="(item,index) in lessonList"></lessonItem>
                  <div class="no_more" v-if="lessonList.length">
                    没有更多内容了
                  </div>
                </div>
            </div>
          </srcoll>
        </van-tab>
        <van-tab title="结束课程">
          <srcoll ref="scroll1"
            v-if="active"
            class="srcoll_content"
            :data="end_lessonList"
            :pullDownRefresh="!!end_lessonList.length"
            @pullingDown="onPullingDown(2)">
            <div class="content">
              <div class="w100" style="padding: 15px;">
                  <div class="no_lesson" v-if="!end_lessonList.length">
                    <i class="icon_no_lesson"></i>
                    <p>没有已经结束的课程哦~</p>
                  </div>
                  <lessonItem :key="item.id" :item="item" :index="index" v-for="(item,index) in end_lessonList"></lessonItem>
                  <div class="no_more" v-if="lessonList.length">
                    没有更多内容了
                  </div>
                </div>
            </div>
          </srcoll>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import {formatTime} from '@/common/js/utils'
  import lessonItem from '../../components/lessonItem'
  import srcoll from '@/components/srcoll'
  export default {
    name: 'lessonList',
    data () {
      return {
        active: 0,
        show: true,
        lessonList: null,
        end_lessonList: null,
        pullDownRefreshTxt: '加载成功'
      }
    },
    created () {
      this.getList()
    },
    methods: {
      handleClick (i) {
        this.active = i
      },
      onPullingDown (v) {
        this.getList(v)
      },
      close () {
        this.$router.go(-1)
      },
      // 获取列表
      async getList (v) {
        let _t = new Date().getTime() + (1000 * 60 * 60 * 24 * 360)
        let t = new Date().getTime() - (1000 * 60 * 60 * 24 * 30)
        let time = formatTime(new Date(t), 'YYYY-MM-DD HH:mm:ss')
        let _time = formatTime(new Date(_t), 'YYYY-MM-DD HH:mm:ss')
        let {
          get
        } = this.$axios

        await get('/v1/student-lesson/list?expand=course,teacher,assistant,image,room', {
          params: {
            startTime: time,
            endTime: _time,
            pageSize: 100
          }
        })
          .then(({
            data
          }) => {
            if (!data.status) {
              let endLessonList = []
              let lessonList = []

              data.data.forEach((e, i) => {
                let nTime = new Date().getTime()
                let endTime = new Date(e.end_time.replace(/-/ig, '/')).getTime()
                if (nTime > endTime) {
                  endLessonList.push(e)
                } else {
                  lessonList.push(e)
                }
              })
              !lessonList.length ? (this.lessonList = []) : (this.lessonList = lessonList)
              !endLessonList.length ? (this.end_lessonList = []) : (this.end_lessonList = endLessonList)
            }
            setTimeout(() => {
              v === 1 && this.$refs.scroll.forceUpdate()
              v === 2 && this.$refs.scroll1.forceUpdate()
            }, 500)
          })

        this.show = false
      }
    },
    components: {
      lessonItem,
      srcoll
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (!vm.$store.state.userInfo.id) {
          next('/login')
        }
      })
    }
  }
</script>
<style lang="scss" scoped>
@import '../../assets/scss/minix/index';
.srcoll_content {
  width: 100vw;
  height: calc(100vh - 90px);
}
.w100 {
  padding: 15px;
}
.loading_content {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
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
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .m_body {
    bottom: 0;
  }
}
</style>

