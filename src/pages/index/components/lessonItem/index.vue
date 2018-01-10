<template>
  <div class="lesson_content">
    <h2 class="lesson_title"><i class="lesson_icon"></i><span>第{{formatNum(index)}}课</span>{{item.name}}</h2>
    <p class="lesson_subtitle">班级：{{item.course.name}}</p>
    <div class="lesson_content_footer">
      <p>{{item.start_time}}上课</p>
      <a class="m_btn" :class="{'m_btn_danger': status.type === 3,'m_btn_disabled': status.type === 2}" @click="addLesson">{{status.text}}</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'lessonItem',
    props: ['item', 'index'],
    computed: {
      status () {
        let nowTime = new Date().getTime()
        let endTime = new Date(this.item.end_time.replace(/-/ig, '/')).getTime()
        let startTime = new Date(this.item.start_time.replace(/-/ig, '/')).getTime()
        let obj = {
          type: 1,
          text: '开始上课'
        }
        if (endTime < nowTime) {
          obj = {
            type: 3,
            text: '已经结束'
          }
        } else if (startTime > nowTime) {
          obj = {
            type: 2,
            text: '暂未开始'
          }
        } else {
          obj = {
            type: 1,
            text: '开始上课'
          }
        }
        return obj
      }
    },
    methods: {
      formatNum (n) {
        let numList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        return numList[n]
      },
      addLesson () {
        let nowTime = new Date().getTime()
        let endTime = new Date(this.item.end_time.replace(/-/ig, '/')).getTime()
        let startTime = new Date(this.item.start_time.replace(/-/ig, '/')).getTime()
        if (endTime < nowTime) {
          this.$dialog.alert({
            title: '提示',
            message: '课程已结束'
          })
        } else if (startTime > nowTime) {
          this.$dialog.alert({
            title: '提示',
            message: '课程未开始'
          })
        } else {
          this.$toast.loading()
          var data = JSON.parse(JSON.stringify(this.item))
          if (window.dsBridge) {
            let res = window.dsBridge.call('doCaseClick', data)
            res && this.$toast.clear()
            this.$toast.clear()
          }
        }
      }
    }
  }
</script>

