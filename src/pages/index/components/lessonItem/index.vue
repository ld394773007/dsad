<template>
  <div class="lesson_content">
    <h2 class="lesson_title"><i style="color:#34A9FF;margin-right: 8px;">第{{formatNum(index)}}课</i></span>{{item.name}}</h2>
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
        let endTime = new Date(this.item.end_time.replace(/-/ig, '/')).getTime() + 1000 * 60 * 60
        let startTime = new Date(this.item.start_time.replace(/-/ig, '/')).getTime() - 1000 * 60 * 30
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
        return n + 1
      },
      addLesson () {
        let nowTime = new Date().getTime()
        let endTime = new Date(this.item.end_time.replace(/-/ig, '/')).getTime() + 1000 * 60 * 60
        let startTime = new Date(this.item.start_time.replace(/-/ig, '/')).getTime() - 1000 * 60 * 30
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

