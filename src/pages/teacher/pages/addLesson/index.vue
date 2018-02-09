<template>
  <div class="m_wrap" id="m_wrap">
    <y-header class="m_header" @click-left="$router.go(-1)" @click-right="cloneCourse">
      <van-icon name="arrow-left" slot="left"/>
      <p>开设班级</p>
      <a class="m_btn m_btn_text" slot="right">复制已有班级</a>
    </y-header>
    <div class="m_body">
      <ul class="step_list">
        <li :class="{'active': index <= active}" class="step_item" :key="index" v-for="(item, index) in stepList">
          <div :class="{'none': index === 3}"><span>{{index + 1}}</span><i :style="{'backgroundColor': (index <= active - 1) ? '#34A9FF' : '#adadad'}" v-if="index !== stepList.length -1"></i></div>
          <span>{{item}}</span>
        </li>
      </ul>
      <div v-if="active === 0">
        <div class="content">
          <p><i class="icon"></i>班级名称<span>（必填）</span></p>
          <input class="input" v-model="fromData.name" type="text" placeholder="请输入你的班级名称">
          <p><i class="icon subject"></i>班级科目<span>（必填）</span></p>
          <ul style="margin: 15px 0;">
            <li :class="{'active': fromData.category_id === item.id}" @click="changeSubject(item.id)" class="btn" :key="index" v-for="(item,index) in subjectList">{{item.title}}</li>
          </ul>
          <p><i class="icon grade"></i>适合年级<span>（必填）</span></p>
          <span>初中</span>
          <ul>
            <li :class="{'active': selectGrade === index + 7}" @click="changeGrade(index + 7)" class="btn" :key="index" v-for="(item,index) in czList">{{item}}</li>
          </ul>
          <span>高中</span>
          <ul>
            <li :class="{'active': selectGrade === index + 10}" @click="changeGrade(index + 10)" class="btn" :key="index" v-for="(item,index) in gzList">{{item}}</li>
          </ul>
        </div>
        <div class="handle_btn_wrap">
          <a class="m_btn" @click="nextStep(0)">下一步</a>
        </div>

      </div>

      <!-- 添加课程 -->
      <div v-if="active === 1">
        <div class="content add_lesson_content">
          <p class="lesson_title">添加课程</p>
          <ul class="sub_list">
            <li><p class="m_subtitle"><i class="xh"></i><span>序号</span></p></li>
            <li><p class="m_subtitle"><i></i><span>课程名称</span></p></li>
            <li><p class="m_subtitle"><i class="date"></i><span>上课时间</span></p></li>
            <li><p class="m_subtitle"><i class="date"></i><span>上课时长（分钟）</span></p></li>
            <li><a class="m_btn m_btn_text" @click="clearAll">清空所有</a></li>
          </ul>
          <ul class="lesson_list">
            <li class="lesson_item" :key="index" v-for="(item, index) in lessonList">
              <i>{{index + 1}}</i>
              <input v-model="item.name" type="text" placeholder="请填写课程名称" class="lesson_input">
              <input v-model="item.start_time" @focus="focus(index, $event)" type="text" placeholder="选择上课开始时间" class="lesson_input">
              <div class="lesson_input" style="margin-left: 8px; width: 150px;" @click="selectLessonTime(index)">{{item.timeLength}}分钟</div>
              <el-button type="danger" @click="removeLesson(index)">删除</el-button>
            </li>
          </ul>
          <div class="add_lesson_btn_wrap">
            <div>
              <van-icon name="add-o" />
              <el-button @click="addLesson" type="text">添加单节课程</el-button>
            </div>
            <div>
              <van-icon name="add-o" />
              <el-button @click="show = true" type="text">批量添加课程</el-button>
            </div>
          </div>
        </div>
        <div class="handle_btn_wrap">
          <a class="m_btn" @click="preStep">上一步</a>
          <a class="m_btn" @click="nextStep(1)">下一步</a>
        </div>
      </div>
      <!-- 定价， 介绍 -->
      <div v-if="active === 2">
        <div class="content">
          <p v-if="!isFree"><i class="icon price"></i>课程价格<span>（必填）</span></p>
          <div v-if="!isFree"><input  class="input price_input" v-model="fromData.market_price" type="tel" placeholder="请输入课程价格"><b>元</b></div>
          <p><i class="icon difficulty"></i>课程难度<span>（必填）</span></p>
          <el-rate style="margin-bottom:20px;" :texts="['很简单', '简单', '一般', '难', '很难']" show-text class="rate" v-model="fromData.tags"></el-rate>
          <span class="subtitle">教学目标</span>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入教学目标内容"
            v-model="fromData.pro_brief">
          </el-input>
          <span class="subtitle">课程简介</span>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入课程简介内容"
            v-model="fromData.pro_desc">
          </el-input>
        </div>
        <div class="handle_btn_wrap">
          <a class="m_btn" @click="preStep">上一步</a>
          <a class="m_btn m_btn_danger" @click="release">发布</a>
        </div>

      </div>

    <!-- 发布成功 -->
      <div v-if="active === 3">
        <div class="content result_content">
          <p class="result_title">恭喜你，你的新课【{{fromData.name}}】发布成功 赶快分享给你的学生吧！</p>
          <div class="wem_content">
            <qriously :value="QRurl" :size="200"></qriously>
          </div>
          <p class="result_subtitle">扫描二维码分享课程</p>
        </div>
        <div class="handle_btn_wrap">
          <a class="m_btn" @click="$router.push('/login?active=1')">进入班级管理</a>
          <a class="m_btn m_btn_danger" @click="$router.push('/login?active=0')">看课表</a>
        </div>

      </div>
    </div>
     <van-popup class="m_popup" v-model="show">
      <vue-event-calendar  class="calendar" :selectedDate="selectedDate" ref="calendar" :events="selectTimeList" @day-changed="handleDayChanged">
        <template slot-scope="props">
          <div class="calender_text">
            <p>请选择上课时间</p>
            <div @click="timeShow = true" class="m_input">{{currentDate_}}</div>
            <p>请选择上课时长</p>
            <div @click="selectTimeShow = true" class="m_input">{{lessonTime}}分钟</div>
          </div>
        </template>
      </vue-event-calendar>
      <div class="popup_btn_wrap">
        <a class="cancel" @click="onCaclenderCancel">取消</a>
        <a class="confirm" @click="onCaclenderConfirm">确认</a>
      </div>
    </van-popup>
    <van-popup class="m_clone_popup" v-model="cloneVisiable">
      <div>
        <div>
          <p class="clone_message">复制已有班级信息</p>
          <span>选择一个班级进行信息复制，对原有班级不产生影响</span>
        </div>
        <van-loading type="spinner" color="black" style="margin: 10px auto;" v-show="!list.length"/>
        <ul class="clone_list">
          <li :class="{'active': cloneActive === index}" v-for="(item,index) in list" @click="changeActive(index)">{{item.name}}</li>
        </ul>
        <div class="popup_btn_wrap">
          <a class="cancel" @click="onCloneCancel">取消</a>
          <a class="confirm" @click="onCloneConfirm">确认</a>
        </div>
      </div>
    </van-popup>
    <van-actionsheet v-model="selectTimeShow">
      <van-picker
      show-toolbar
      :title="请选择上课时长"
      :columns="columns"
      @cancel="onSelectTimeCancel"
      @confirm="onSelectTimeConfirm"
    />
    </van-actionsheet>
    <van-actionsheet v-model="timeShow">
      <van-datetime-picker
        v-model="currentDate_"
        type="time"
        :min-hour="10"
        @cancel="onTimeCancel"
        @confirm="onTimeConfirm"
      />
    </van-actionsheet>
    <van-actionsheet v-model="showDate" title="时间格式（年-月-日 时：分）">
      <van-datetime-picker
        @confirm="selectDate"
        @cancel="showDate = false"
        type="datetime"
        :min-date="minDate"
      />
    </van-actionsheet>
    <van-actionsheet v-model="lessonTimeShow">
      <van-picker
        show-toolbar
        title="选择课程时长"
        :columns="[{values: ['15', '30', '60', '90', '120'], defaultIndex: 3}]"
        @cancel="lessonTimeShow = false"
        @confirm="onChangeEndTime"
      />
    </van-actionsheet>
  </div>
</template>
<script>
import {formatTime} from '@/common/js/utils'
export default {
  name: 'addLesson',
  data () {
    return {
      selectedDate: '',
      selectTimeShow: false,
      timeShow: false,
      cloneVisiable: false,
      lessonTimeShow: false,
      currentDate_: '10:00',
      lessonTime: '90',
      columns: [{
        values: ['15', '30', '60', '90', '120'],
        defaultIndex: 2
      }],
      minDate: new Date(),
      showDate: false,
      show: false,
      currentDate: '',
      subjectList: [
        {
          title: '英语',
          id: 1
        },
        {
          title: '数学',
          id: 9
        }
      ],
      stepList: ['请填写基本信息', '定制课程大纲', '定价、介绍', '发布'],
      czList: ['初一', '初二', '初三'],
      gzList: ['高一', '高二', '高三'],
      completeNub: 0,
      lessonList: [

      ],
      selectTimeList: [],
      selectDateIndex: 0,
      lessonTimeIndex: 0,
      active: 0,
      selectGrade: 7,
      isFree: false,
      fromData: {
        name: '',
        best_grade: 1,
        tags: '1',
        category_id: 1,
        cat_id: 1,
        price: 0,
        market_price: '',
        pro_brief: '',
        pro_desc: ''
      },
      list: [],
      cloneActive: '',
      QRurl: 'http://www.dingdingclass.com/#/details?id='
    }
  },
  created () {
    let {isFree} = this.$route.query
    if (isFree) {
      this.fromData.market_price = '0'
      this.isFree = true
    }
  },
  methods: {
    sort (arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
                      // 获取第一个值和后一个值比较
          var cur = arr[i]
          if (cur.start_time > arr[j].start_time) {
                      // 因为需要交换值，所以会把后一个值替换，我们要先保存下来
            var index = arr[j]
                        // 交换值
            arr[j] = cur
            arr[i] = index
          }
        }
      }
      return arr
    },
    onChangeEndTime (v) {
      this.lessonList[this.lessonTimeIndex].timeLength = v
      this.lessonTimeShow = false
    },
    selectLessonTime (i) {
      this.lessonTimeIndex = i
      this.lessonTimeShow = true
    },
    onCloneCancel () {
      this.cloneActive = ''
      this.cloneVisiable = false
    },
    onCloneConfirm () {
      let {cloneActive, list, fromData} = this
      if (cloneActive === '') {
        this.$toast('请选择需要复制的班级')
        return
      }
      let {
            best_grade,
            category_id,
            product,
            name,
            tags,
            lesson
          } = list[cloneActive]
      let productData = {
        price: 0,
        market_price: '',
        pro_brief: '',
        pro_desc: ''
      }
      if (product.id) {
        productData = {
          market_price: product.market_price,
          pro_brief: product.pro_brief,
          pro_desc: product.pro_desc,
          price: 0
        }
      }
      this.fromData = {...fromData, best_grade, category_id, name: name + '( 复制 )', tags, ...productData}
      this.lessonList = lesson.map(e => {
        return {
          name: e.name,
          start_time: formatTime(new Date(e.start_time * 1000), 'YYYY-MM-DD HH:mm'),
          end_time: '',
          timeLength: (e.end_time - e.start_time) / 60
        }
      })
      this.lessonList = this.sort(this.lessonList)
      this.onCloneCancel()
    },
    // 设置克隆选择项
    changeActive (i) {
      this.cloneActive = i
    },
    // 显示设置克隆课程列表
    cloneCourse () {
      this.getList()
      this.cloneVisiable = true
    },
    onTimeCancel () {
      this.timeShow = false
    },
    onTimeConfirm (v) {
      this.onTimeCancel()
    },
    onCaclenderCancel () {
      this.selectedDate = ''
      this.selectTimeList = []
      this.show = false
    },
    onCaclenderConfirm () {
      this.selectTimeList.forEach(e => {
        this.lessonList.push({
          name: '',
          start_time: e.date.replace(/\//g, '-') + ' ' + this.currentDate_,
          end_time: '',
          timeLength: this.lessonTime
        })
      })
      this.lessonList.sort((a, b) => {
        return a.start_time > b.start_time
      })
      this.onCaclenderCancel()
    },
    onSelectTimeCancel () {
      this.selectTimeShow = false
    },
    onSelectTimeConfirm (v) {
      this.lessonTime = v[0]
      this.onSelectTimeCancel()
    },
    // 日历点击事件
    handleDayChanged (v) {
      this.selectedDate = v.date
      let has = false
      this.selectTimeList.forEach((e, i) => {
        if (e.date === v.date) {
          has = true
          this.selectTimeList.splice(i, 1)
        }
      })
      !has && this.selectTimeList.push({
        date: v.date,
        title: ' '
      })
    },
    // 清空全部课程
    clearAll () {
      this.lessonList = []
    },
    focus (i, e) {
      e.target.blur()
      this.selectDateIndex = i
      this.showDate = true
    },
    selectDate (v) {
      this.lessonList[this.selectDateIndex].start_time = formatTime(v, 'YYYY-MM-DD HH:mm')
      this.showDate = false
    },
    // 获取班级列表
    getList () {
      let {get} = this.$axios
      get('/v1/teacher-lesson/case-products')
      .then(({data}) => {
        if (!data.status) {
          if (!this.list.length) {
            for (let item in data.data) {
              this.list.push(data.data[item])
            }
            this.list.sort((a, b) => {
              return b.lesson[0].start_time - a.lesson[0].start_time
            })
          }
        }
      })
    },
    // 发布
    release () {
      let {fromData, lessonList, isFree} = this
      let {post} = this.$axios
      if (fromData.market_price === '' && !isFree) {
        this.$dialog.alert({
          title: '提示',
          message: '课程价格是必填项'
        })
        return
      }
      if (fromData.tags === '') {
        this.$dialog.alert({
          title: '提示',
          message: '课程难度是必填项'
        })
        return
      }

      this.$dialog.confirm({
        title: '提示',
        message: '注意：班级课程发布后将不能编辑、删除！',
        confirmButtonText: '确定发布',
        cancelButtonText: '再检查一下'
      }).then(() => {
        this.$toast.loading('课程创建中')
        fromData.tags = String(fromData.tags)
        fromData.price = Number(fromData.price)
        fromData.market_price = Number(fromData.market_price)
        post('/v1/teacher-lesson/add-case', fromData)
        .then(({data}) => {
          if (!data.status) {
            let courseId = data.data.course_id
            this.QRurl = this.QRurl + data.data.pro_id
            lessonList = lessonList.map(e => {
              let endTime = new Date(e.start_time.replace(/-/g, '/')).getTime() / 1000 + (e.timeLength * 60)
              return {
                course_id: courseId,
                name: e.name,
                start_time: new Date(e.start_time.replace(/-/g, '/')).getTime() / 1000,
                end_time: endTime
              }
            })

            lessonList.forEach(e => {
              this.addLessonAjax(e)
            })
          }
        })
      })
    },
    // 为班级添加课程
    addLessonAjax (data) {
      let {post} = this.$axios
      post('/v1/teacher-lesson/add-lesson', data)
      .then(({data}) => {
        if (!data.status) {
          this.completeNub += 1
          this.$toast.loading(`已完成${this.completeNub}/${this.lessonList.length}`)
          if (this.completeNub === this.lessonList.length) {
            this.$toast.clear()
            this.$toast.success('创建成功')
            this.active += 1
          }
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    // 为课程列表数组添加单条信息
    addLesson () {
      this.lessonList.push({
        name: '',
        start_time: '',
        end_time: '',
        timeLength: this.lessonTime
      })
    },
    // 删除课程数组中的某条信息
    removeLesson (i) {
      this.lessonList.splice(i, 1)
    },
    // 选择科目
    changeSubject (v) {
      this.fromData.category_id = v
    },
    // 选择年级
    changeGrade (v) {
      this.selectGrade = v
      this.fromData.best_grade = v
    },
    // 下一步
    nextStep (v) {
      let {fromData} = this
      if (v === 0) {
        if (fromData.name === '') {
          this.$dialog.alert({
            title: '提示',
            message: '班级名称是必填'
          })
          return
        }
      } else {
        let a = true
        this.lessonList.forEach(e => {
          if (e.name === '') {
            a = false
          }
          if (e.start_time === '') {
            a = false
          }
          if (e.timeLength === '') {
            a = false
          }
        })
        if (!a) {
          this.$dialog.alert({
            title: '提示',
            message: '有信息没有填写'
          })
          return
        }
        if (!this.lessonList.length) {
          this.$dialog.alert({
            title: '提示',
            message: '课程不能为空'
          })
          return
        }
      }
      this.active += 1
    },
    // 上一步
    preStep () {
      this.active -= 1
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
.m_body {
  overflow-y: auto;
  background-color: #F6F7F9;
}
.sub_list {
  display: flex;
  align-items: center;
  li:first-child {
    margin-right: 25px;
  }
  li:nth-child(2) {
    margin-right: 185px;
  }
  li:nth-child(3) {
    margin-right: 195px;
  }
  li:nth-child(4) {
    margin-right: 20px;
  }
  li:nth-child(5) {
    .m_btn {
      padding: 0 10px;
    }
  }
}
.m_popup {
  width: 700px;
}

</style>




