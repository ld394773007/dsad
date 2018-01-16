<template>
  <div class="w100">
    <div class="header">
      <div class="left">
        <div class="year">
          <van-icon class="arrow_left" name="arrow-left" @click="changeYear('pre')" />
          <p>{{year}}年</p>
          <van-icon class="arrow" name="arrow" @click="changeYear('next')" />
        </div>
        <div class="month">
          <van-icon class="arrow_left" name="arrow-left" @click="changeMonth('pre')"/>
          <p>{{month}}月</p>
          <van-icon class="arrow" name="arrow" @click="changeMonth('next')"/>
        </div>
        <div class="today" @click="blackToday">
          <p>回今日</p>
        </div>
      </div>
      <div class="logo">
        <i class="logo_img"></i>
        <div class="logo_text">
          <span>师生都爱用的共享教室平</span>
          <p>叮叮云教室</p>
          <i class="logo_icon"></i>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content_title">
        <p>课表</p>
        <p>{{_today}} 课程 ( {{selectData.length}} )</p>
      </div>
      <vue-event-calendar class="calendar" ref="calendar" :showHeader="false"  @updateDate="updateDate" :events="lessonList" @day-changed="handleDayChanged">
        <template slot-scope="props">
          <div class="lesson_list">
            <div v-if="selectData.length" v-for="(event, index) in selectData" class="lesson_item">
              <div class="lesson_info">
                <p class="lesson_title"><i>第{{index + 1}}课</i>{{event.name}}</p>
                <span class="lesson_course">班级：{{event.course.name}}</span>
                <span class="lesson_time">{{formatStartTime(event.start_time)}}</span>
              </div>
              <button class="m_btn lesson_btn">{{isStart(event) === 0 ? '课程未开始' : isStart(event) === 1 ? '开始上课' : '课程已结束'}}</button>
            </div>
            <div v-if="!selectData.length" class="lesson_on">
              <img src="/static/images/class_kong@2x.png">
              <p>今天没有需要上的课程</p>
            </div>
          </div>
        </template>
      </vue-event-calendar>
      <ul class="content_nav">
        <li>
          <router-link to="./addLesson">
            <i class="content_nav_icon kxk"></i>
            <span>开新课</span>
          </router-link>
        </li>
        <li>
          <i class="content_nav_icon kmfk"></i>
          <span>开免费课</span>
        </li>
        <li>
          <i class="content_nav_icon lsjk"></i>
          <span>临时加课</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {formatTime} from '@/common/js/utils'
export default {
  name: 'home_lesson',
  data () {
    return {
      lessonList: [],
      year: 0,
      month: 0,
      today: '',
      _today: '',
      selectDay: ''
    }
  },
  created () {
    let time = formatTime(new Date(), 'YYYY/MM/DD')
    let t = time.split('/')
    this.today = time
    this._today = formatTime(new Date(), 'MM月DD日')
    this.year = t[0]
    this.month = t[1]
    this.getLesson()
  },
  computed: {
    selectData () {
      if (!this.lessonList.length) return []
      let list = this.lessonList.filter(e => {
        if (this.selectDay === '') {
          return e.date === this.today
        } else {
          console.log(e.date === this.selectDay)
          return e.date === this.selectDay
        }
      })
      return list
    }
  },
  methods: {
    getLesson () {
      let {get} = this.$axios
      get('/v1/teacher-lesson/list?expand=course,assistant,image,mlesson', {
        params: {
          endTime: formatTime(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365), 'YYYY-MM-DD') + ' 00:00:00',
          pageSize: 1000
        }
      })
      .then(({data}) => {
        if (!data.status) {
          this.lessonList = data.data.map(e => {
            e.date = e.start_time.split(' ')[0].replace(/-/g, '/')
            e.title = e.name
            return e
          })
        }
      })
    },
    // 回到今日
    blackToday () {
      this.$EventCalendar.toDate(this.today)
    },
    // 更新时间
    updateDate (v) {
      console.log(v)
      var time = v.split('年')
      this.year = time[0]
      this.month = time[1].replace('月', '')
    },
    // 切换月份
    changeMonth (v) {
      if (v === 'pre') {
        this.$EventCalendar.preMonth()
      } else {
        this.$EventCalendar.nextMonth()
      }
    },
    // 切换年份
    changeYear (v) {
      if (v === 'pre') {
        this.$EventCalendar.toDate(`${Number(this.year) - 1}/${this.month}/01`)
      } else {
        this.$EventCalendar.toDate(`${Number(this.year) + 1}/${this.month}/01`)
      }
    },
    // 点击某日发生
    handleDayChanged (v) {
      this._today = formatTime(new Date(v.date), 'MM月DD日')
      this.selectDay = v.date
    },
    formatStartTime (t) {
      return formatTime(new Date(t), 'YYYY年MM月DD日 HH:mm:ss')
    },
    // 判断课程时间状态
    isStart (data) {
      let time = new Date().getTime()
      let startTime = new Date(data.start_time).getTime()
      let endTime = new Date(data.end_time).getTime()
      if (time < startTime) {
        return 0
      } else if (time > startTime && time < endTime) {
        return 1
      } else {
        return 2
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index'
</style>


