<template>
  <div class="m_wrap">
    <y-header @click-left="$router.go(-1)">
      <van-icon name="arrow-left" slot="left"/>
      <p>开设班级</p>
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
          <ul style="margin: 20px 0;">
            <li :class="{'active': fromData.category_id === item.id}" @click="changeSubject(item.id)" class="btn" :key="index" v-for="(item,index) in subjectList">{{item.title}}</li>
          </ul>
          <p><i class="icon grade"></i>适合年级<span>（必填）</span></p>
          <span>小学</span>
          <ul>
            <li :class="{'active': selectGrade === index + 1}" @click="changeGrade(index + 1)" class="btn" :key="index" v-for="(item,index) in xxList">{{item}}</li>
          </ul>
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
          <button class="m_btn" @click="nextStep(0)">下一步</button>
        </div>

      </div>

      <!-- 添加课程 -->
      <div v-if="active === 1">
        <div class="content add_lesson_content">
          <p class="lesson_title">添加课程</p>
          <ul class="lesson_list">
            <li class="lesson_item" :key="index" v-for="(item, index) in lessonList">
              <i>{{index + 1}}</i>
              <input v-model="item.name" type="text" placeholder="请填写课程名称" class="lesson_input">
              <el-date-picker
                  v-model="item.start_time"
                  type="datetime"
                  placeholder="选择上课开始时间">
                </el-date-picker>
              <input v-model="item.timeLength" style="margin-left: 8px; width: 150px;" type="text" placeholder="请填写课程时长" class="lesson_input">
              <el-button type="danger" @click="removeLesson(index)">删除</el-button>
            </li>
          </ul>
          <div class="add_lesson_btn_wrap">
            <van-icon name="add-o" />
            <el-button @click="addLesson" type="text">添加单节课程</el-button>
          </div>
        </div>
        <div class="handle_btn_wrap">
          <button class="m_btn" @click="preStep">上一步</button>
          <button class="m_btn" @click="nextStep(1)">下一步</button>
        </div>
      </div>
      <!-- 定价， 介绍 -->
      <div v-if="active === 2">
        <div class="content">
          <p><i class="icon price"></i>课程价格<span>（必填）</span></p>
          <input class="input price_input" v-model="fromData.market_price" type="text" placeholder="请输入课程价格"><b>元</b>
          <p><i class="icon difficulty"></i>课程难度<span>（必填）</span></p>
          <el-rate class="rate" v-model="fromData.tags"></el-rate>
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
          <button class="m_btn" @click="preStep">上一步</button>
          <button class="m_btn m_btn_danger" @click="release">发布</button>
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
          <button class="m_btn" @click="$router.push('/home?active=1')">进入班级管理</button>
          <button class="m_btn m_btn_danger" @click="$router.push('/home')">看课表</button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addLesson',
  data () {
    return {
      subjectList: [
        {
          title: '英语',
          id: 1
        },
        {
          title: '语文',
          id: 4
        }
      ],
      stepList: ['请填写基本信息', '定制课程大纲', '定价、介绍', '发布'],
      xxList: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      czList: ['初一', '初二', '初三'],
      gzList: ['高一', '高二', '高三'],
      completeNub: 0,
      lessonList: [
        {
          name: '',
          start_time: '',
          end_time: '',
          timeLength: ''
        }
      ],
      active: 0,
      selectGrade: 1,
      fromData: {
        name: '',
        best_grade: 0,
        tags: '',
        category_id: 1,
        cat_id: 1,
        price: 0,
        market_price: 0,
        pro_brief: '',
        pro_desc: ''
      },
      QRurl: 'https://www.yingyushu.com/ding/#/details?id='
    }
  },
  methods: {
    // 发布
    release () {
      let {fromData, lessonList} = this
      let {post} = this.$axios
      if (fromData.market_price === '') {
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
      if (fromData.pro_brief === '') {
        this.$dialog.alert({
          title: '提示',
          message: '教学目标是必填项'
        })
        return
      }
      if (fromData.pro_brief === '') {
        this.$dialog.alert({
          title: '提示',
          message: '教学目标是必填项'
        })
        return
      }
      this.$toast.loading('课程创建中')
      fromData.tags = String(fromData.tags)
      post('/v1/teacher-lesson/add-case', fromData)
      .then(({data}) => {
        if (!data.status) {
          let courseId = data.data.course_id
          this.QRurl = this.QRurl + data.data.pro_id
          lessonList = lessonList.map(e => {
            let endTime = new Date(e.start_time).getTime() / 1000 + (e.timeLength * 1000 * 60)
            return {
              course_id: courseId,
              name: e.name,
              start_time: new Date(e.start_time).getTime() / 1000,
              end_time: endTime
            }
          })

          lessonList.forEach(e => {
            this.addLessonAjax(e)
          })
        }
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
        end_time: ''
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
        console.log(this.lessonList)
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
  padding-bottom: 30px;
  overflow-y: auto;
  background-color: #F6F7F9;
}

</style>




