<template>
  <div class="m_wrap" id="m_wrap">
    <y-header class="m_header" @click-left="$router.go(-1)">
      <van-icon name="arrow-left" slot="left"/>
      <p>{{item.name}}</p>
      <el-button v-show="item.product.id" type="text" slot="right" @click="maskVis = true">分享</el-button>
    </y-header>
    <div class="a m_body">
      <ul class="tab">
        <li class="tab_item" :class="{'active': active == 1}" @click="active = 1">课程大纲</li>
        <li class="tab_item" :class="{'active': active == 2}" @click="active = 2">学生名单</li>
        <li v-if="" class="tab_item" :class="{'active': active == 3}" @click="active = 3">班级信息</li>
      </ul>
      <div style="position: relative;">
        <div v-show="active == 1" :data="item.lesson" class="m_content kcdg">
          <h2>课程大纲（{{title}}）</h2>
            <div class="lesson_item" style="margin-bottom: 0;color: #ADADBD;">
              <i class="xh" style="width:54px; margin-right: 26px"><p class="m_subtitle"><i class="xh"></i><span>序号</span></p></i>
              <div class="flex_1_5">
                <p class="m_subtitle"><i></i><span>课程名称</span></p>
              </div>
              <div class="flex_1_5">
                <p class="m_subtitle"><i class="date"></i><span>上课时间</span></p>
              </div>
              <div class="flex_1">
                <p class="m_subtitle"><i class="date"></i><span>上课时长（分钟</span></p>
              </div>
              <el-button class="status_btn" type="primary" style="background-color: #fff;border-color: #fff;">主要按钮</el-button>
            </div>
            <div class="lesson_item" v-for="(e, index) in item.lesson" :key="index">
              <i>{{index + 1}}</i>
              <div class="flex_1_5">
                <el-input disabled v-model="e.name" placeholder="请输入课程名称"></el-input>
              </div>
              <div class="flex_1_5">
                <el-date-picker
                  disabled
                  style="width: 100%;"
                  v-model="e.start_time"
                  type="datetime"
                  placeholder="选择上课时间">
                </el-date-picker>
              </div>
              <div class="flex_1">
                <el-input disabled v-model="e.timeLength" placeholder="请输入课程时长（分钟）"></el-input>
              </div>
              <el-button class="status_btn" :type="isStart(e) === 2 ? 'info' : 'primary'">{{isStart(e) === 0 ? '未开始' : isStart(e) === 2 ? '已结束' : '已开始' }}</el-button>
            </div>
            <div class="add_btn">
              <van-icon class="icon" name="add-o" />
              <el-button type="text" @click="addLesson">添加单节课程</el-button>
            </div>
        </div>
        <div :data="item.student" v-show="active == 2" class="tab_content m_content">
          <span>共 {{item.student.length + item.studentUnPay.length}} 为学生</span>
          <p style="text-align: center" v-if="(item.student.length + item.studentUnPay.length) == 0">暂无学生</p>
            <ul class="student-list" v-else>
              <li :key="i" v-for="(e, i) in item.student">
                <div class="avater">
                  <img :src="e.avatar ? e.avatar : '/static/images/Avatar_s@2x.png'">
                </div>
                <p>{{e.realname}}</p>
                <i class="free"></i>
              </li>
              <li :key="i" v-for="(e, i) in item.studentUnPay">
                <div class="avater">
                  <img :src="e.avatar ? e.avatar : '/static/images/Avatar_s@2x.png'">
                </div>
                <p>{{e.realname}}</p>
                <i></i>
              </li>
            </ul>
        </div>
        <div v-show="active == 3" class="tab_content m_content product">
          <div class="title_wrap">
            <p><i class="icon"></i>收费价格</p>
            <p class="price ml" style="margin-left: 35px;"><i>¥</i>{{item.product.market_price}}元</p>
          </div>
          <div class="title_wrap">
            <p class="title"><i class="icon start"></i>课程难度</p>
            <el-rate
            class="rate"
            style="margin-left: 35px;margin-top:0;"
              v-model="item.tags"
              disabled
              show-text
              :texts="['很简单','简单','一般', '难', '很难']"
              text-color="#ff9900"
              score-template="{value}">
            </el-rate>
          </div>
          <span>教学目标</span>
          <div class="info_text">
            {{item.product.pro_brief === '' ? '未填写' : item.product.pro_brief }}
          </div>
          <span>课程简介</span>
          <div class="info_text" v-html="item.product.pro_desc === '' ? '未填写' : item.product.pro_desc">
          </div>
        </div>
      </div>
    </div>
    <div class="mask_wrap" v-show="maskVis">
      <div class="mask" @click="maskVis = false"></div>
      <div class="mask_content">
        <p>分享</p>
        <qriously :value="QRurl" :size="200"></qriously>
        <p>扫二维码分享课程</p>
        <a class="mask_btn" @click="maskVis = false">取消</a>
      </div>
    </div>
    <div class="m_mask_wrap" v-show="addMaskVis">
      <div class="m_mask"></div>
      <div class="m_mask_content">
        <p>临时加课</p>
        <div class="m_input_content">
          <p class="m_subtitle"><i></i><span>课程名称</span></p>
          <input v-model="fromData.name" type="text" placeholder="请填写课程名称" class="m_input">
        </div>
        <div class="input_content_grade">
          <div class="m_input_content">
            <p class="m_subtitle"><i class="date"></i><span>开始时间</span></p>
            <input v-model="fromData.start_time" @focus="focus(index, $event)" type="text" placeholder="选择上课开始时间" class="m_input">
          </div>
          <span></span>
          <div class="m_input_content">
            <p class="m_subtitle"><i class="date"></i><span>课程时长</span></p>
            <input v-model="fromData.end_time" type="text" placeholder="请填写课程时长" class="m_input">
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
  </div>
</template>
<script>
import {formatTime} from '@/common/js/utils'
import scroll from '@/components/srcoll'
export default {
  data () {
    return {
      showDate: false,
      minDate: new Date(),
      active: 1,
      maskVis: false,
      addMaskVis: false,
      QRurl: '',
      fromData: {
        course_id: '',
        name: '',
        start_time: '',
        end_time: '90'
      }
    }
  },
  created () {
    let {id} = this.$route.query
    this.fromData.course_id = id
    this.QRurl = 'http://www.dingdingclass.com/#/details?id=' + this.item.product.id
  },
  methods: {
    selectDate (v) {
      this.fromData.start_time = formatTime(v, 'YYYY-MM-DD HH:mm:ss')
      this.showDate = false
    },
    focus (i, e) {
      e.target.blur()
      this.showDate = true
    },
    cancle () {
      this.addMaskVis = false
      this.fromData = {
        course_id: this.fromData.course_id,
        name: '',
        start_time: '',
        end_time: '90'
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
      if (data.start_time === '') {
        this.$toast('请选择课程结束时间')
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
          this.getList()
          this.cancle()
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    getList () {
      let {get} = this.$axios
      get('/v1/teacher-lesson/case-products')
      .then(({data}) => {
        if (!data.status) {
          this.$store.commit('UPDATE_COURSE_LIST', data.data)
        }
      })
    },
    addLesson () {
      this.addMaskVis = true
    },
    isStart (data) {
      let time = new Date().getTime()
      let startTime = data.start_time
      let endTime = data.end_time * 1000
      if (time < startTime) {
        return 0
      } else if (time > startTime && time < endTime) {
        return 1
      } else {
        return 2
      }
    }
  },
  computed: {
    item () {
      let {id} = this.$route.query
      let list = this.$store.state.courseList
      let data = list[id]
      data.lesson = data.lesson.map(e => {
        return {
          ...e,
          start_time: e.start_time * 1000,
          timeLength: Math.floor(Math.floor(e.end_time - e.start_time) / 60)
        }
      })
      data.lesson.sort((a, b) => {
        return a.start_time - b.start_time
      })
      return data
    },
    title () {
      let start = formatTime(new Date(this.item.lesson[0].start_time), 'YYYY年MM月DD日')
      let end = formatTime(new Date(this.item.lesson[this.item.lesson.length - 1].end_time * 1000), 'YYYY年MM月DD日')

      return `${start} 至 ${end} 共${this.item.lesson.length}课`
    },
    hasProduct () {
      if (this.item.product.length) return false
      return true
    }
  },
  components: {
    scroll
  }
}
</script>
<style lang="scss" scoped>
@import './index';
.m_body {
  background-color: #f6f7f9;
}
.m_mask_content {
  height: 350px;
}
.m_content {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>


