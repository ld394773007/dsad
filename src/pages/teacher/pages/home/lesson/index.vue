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
      <vue-event-calendar :selectedDate="selectedDate" class="calendar" ref="calendar" :showHeader="false"  @updateDate="updateDate" :events="lessonList" @day-changed="handleDayChanged">
        <template slot-scope="props">
          <div class="lesson_list">
            <div v-if="selectData.length" v-for="(event, index) in selectData" class="lesson_item">
              <div class="lesson_info">
                <p class="lesson_title">{{event.course.name}}</p>
                <span class="lesson_time">{{formatStartTime(event.start_time)}}</span>
                <span class="lesson_course" v-html="event.name"></span>
              </div>
              <a class="m_btn lesson_btn" :class="{'m_btn_disabled': isStart(event) !== 1}" @click="addLesson(event)">{{isStart(event) < 2 ? '进入课堂' : '课堂已结束'}}</a>
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
          <router-link to="./addLesson?isFree=1">
            <i class="content_nav_icon kmfk"></i>
            <span>开免费课</span>
          </router-link>
        </li>
        <li @click="add">
          <i class="content_nav_icon lsjk"></i>
          <span>临时加课</span>
        </li>
      </ul>
    </div>
    <div class="m_mask_wrap" v-show="maskVis">
      <div class="m_mask"></div>
      <div class="m_mask_content">
        <p>临时加课</p>
        <div class="select_course">
          <p>临时加课到哪个班级？</p>
          <div>
            <el-button @click="fromData.course_id = e.id" :type="e.id == fromData.course_id ? 'primary' : 'info'" :key="i" round v-for="(e, i) in list">{{e.name}}</el-button>
          </div>
        </div>

        <div class="input_content_grade">
          <div class="m_input_content">
            <p class="m_subtitle"><i></i><span>课程名称</span></p>
            <input v-model="fromData.name" type="text" placeholder="请填写课程名称" class="m_input">
          </div>
          <span></span>
          <div class="m_input_content">
            <p class="m_subtitle"><i class="date"></i><span>开始时间</span></p>
            <input v-model="fromData.start_time" @focus="focus(index, $event)" type="text" placeholder="选择上课开始时间" class="m_input">
          </div>
          <span></span>
          <div class="m_input_content">
            <p class="m_subtitle"><i class="date"></i><span>课程时长</span></p>
            <div class="m_input m_input_div" @click="timeShow = true" >{{fromData.end_time}}</div>
          </div>
        </div>
        <div class="m_mask_btn">
          <a class="btn" @click="cancle">取消</a>
          <a class="btn confirm" @click="confirm">添加</a>
        </div>
      </div>
    </div>
    <van-actionsheet v-model="showDate" title="时间格式（年-月-日 时：分）">
      <van-datetime-picker
        @cancel="showDate = false"
        @confirm="selectDate"
        type="datetime"
        :min-date="minDate"
      />
    </van-actionsheet>
    <van-actionsheet v-model="timeShow">
      <van-picker
        show-toolbar
        title="选择课程时长"
        :columns="[{values: ['15', '30', '60', '90', '120'], defaultIndex: 1}]"
        @cancel="timeShow = false"
        @confirm="onChangeEndTime"
      />
    </van-actionsheet>
  </div>
</template>
<script>
import {formatTime} from '@/common/js/utils'
export default {
  props: ['data'],
  name: 'home_lesson',
  data () {
    return {
      lessonList: [],
      year: 0,
      month: 0,
      today: '',
      _today: '',
      selectDay: '',
      selectedDate: '',
      list: [],
      maskVis: false,
      showDate: false,
      timeShow: false,
      minDate: new Date(),
      fromData: {
        course_id: '',
        name: '',
        start_time: '',
        end_time: '30'
      }
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
    this.getList()
  },
  computed: {
    selectData () {
      if (!this.lessonList.length) return []
      let list = this.lessonList.filter(e => {
        if (this.selectDay === '') {
          return e.date === this.today
        } else {
          return e.date === this.selectDay
        }
      })
      return list
    }
  },
  watch: {
    data () {
      this.getLesson()
      this.getList()
    }
  },
  methods: {
    onChangeEndTime (v) {
      this.fromData.end_time = v[0]
      this.timeShow = false
    },
    selectDate (v) {
      this.fromData.start_time = formatTime(v, 'YYYY-MM-DD HH:mm:ss')
      this.showDate = false
    },
    focus (i, e) {
      e.target.blur()
      this.showDate = true
    },
    cancle () {
      this.maskVis = false
      this.fromData = {
        course_id: '',
        name: '',
        start_time: '',
        end_time: '30'
      }
    },
    confirm () {
      let data = Object.assign({}, this.fromData)
      if (data.course_id === '') {
        this.$toast('请选择需要加入的班级')
        return false
      }
      if (data.name === '') {
        this.$toast('请填写班级名称')
        return false
      }
      if (data.start_time === '') {
        this.$toast('请选择课程开始时间')
        return false
      }
      if (data.end_time === '') {
        this.$toast('请选择课程时长')
        return false
      }

      this.$toast.loading()
      let {post} = this.$axios
      data.start_time = new Date(data.start_time.replace(/-/g, '/')).getTime() / 1000
      data.end_time = data.start_time + (data.end_time * 60)
      post('/v1/teacher-lesson/add-lesson', data)
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.$toast.success('添加成功')
          this.getLesson()
          this.cancle()
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    add () {
      if (!this.list.length) {
        this.$dialog.alert({
          title: '提示',
          message: '你还没有创建班级，请先去创建班级！'
        }).then(() => {
          this.$router.push('/addLesson')
        })
        return
      }
      this.maskVis = true
    },
    getLesson () {
      let {get} = this.$axios
      get('/v1/teacher-lesson/list?expand=course,assistant,image,mlesson,room', {
        params: {
          startTime: formatTime(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365), 'YYYY-MM-DD') + ' 00:00:00',
          endTime: formatTime(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365), 'YYYY-MM-DD') + ' 00:00:00',
          pageSize: 1000
        }
      })
      .then(({data}) => {
        if (!data.status) {
          let obj = {}
          this.lessonList = data.data.map(e => {
            e.date = e.start_time.split(' ')[0].replace(/-/g, '/')
            e.title = e.name
            return e
          })

          this.lessonList.forEach(e => {
            if (obj[e.course.id]) {
              obj[e.course.id].push(e)
            } else {
              obj[e.course.id] = [e]
            }
          })

          for (let key in obj) {
            obj[key] = obj[key].sort((a, b) => {
              return a.start_time > b.start_time
            })
            obj[key] = obj[key].map((e, i) => {
              e.name = `<i style="color: #34A9FF;margin-right: 3px;">第${i + 1}课</i>${e.name}`
              return e
            })
          }
        }
      })
    },
    getList () {
      let {get} = this.$axios
      get('/v1/teacher-lesson/case-products')
      .then(({data}) => {
        if (!data.status) {
          for (let item in data.data) {
            this.list.push(data.data[item])
          }

          this.list.sort((a, b) => {
            return b.lesson[0].start_time - a.lesson[0].start_time
          })
        }
      })
    },
    addLesson (data) {
      let v = this.isStart(data)
      if (v === 2) {
        this.$dialog.alert({
          title: '提示',
          message: '课程已结束'
        })
        return false
      }
      this.$toast.loading()
      let _data = JSON.parse(JSON.stringify(data))
      if (window.dsBridge) {
        let res = window.dsBridge.call('doCaseClick', _data)
        res && this.$toast.clear()
        this.$toast.clear()
      }
    },
    // 回到今日
    blackToday () {
      this.selectDay = ''
      this.selectedDate = formatTime(new Date(), 'YYYY/MM/DD')
      this._today = formatTime(new Date(), 'MM月DD日')
      this.$EventCalendar.toDate(this.today)
    },
    // 更新时间
    updateDate (v) {
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
      this.selectedDate = v.date
    },
    formatStartTime (t) {
      return formatTime(new Date(t.replace(/-/g, '/')), 'YYYY年MM月DD日 HH:mm:ss')
    },
    // 判断课程时间状态
    isStart (data) {
      let start = data.start_time.replace(/-/g, '/')
      let end = data.end_time.replace(/-/g, '/')
      let time = new Date().getTime()
      let startTime = new Date(start).getTime()
      let endTime = new Date(end).getTime()
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
@import './index';
.m_input {
  margin: 0;
  height: 40px;
  font-size: 14px;
  color: #606266;
}
.m_input_div {
  width: 140px;
}
</style>


