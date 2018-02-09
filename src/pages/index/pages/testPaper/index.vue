<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header" fixed left-arrow @click-left="$router.go(-1)">
      <span slot="title">试题测试</span>
    </van-nav-bar>
    <div class="m_body" v-if="isLoad">
      <h2>{{paperInfo.name}}</h2>
      <ul class="paper-info-list">
        <li class="paper-info-item">
          <span>来源：</span><span v-text="paperInfo.from"></span>
        </li>
        <li class="paper-info-item">
          <span>建议用时：</span><span v-text="foramtTime(paperInfo.exam_time)"></span>
        </li>
        <li class="paper-info-item">
          <span>进度：</span><span v-text="paperInfo.complete + '/' + paperInfo.total"></span>
        </li>
      </ul>
      <div class="paper-btn">
        <a class="m_btn full" @click="$router.push(btnInfo.link)">{{btnInfo.text}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import {formatSeconds} from '@/common/js/utils'
export default {
  data () {
    return {
      paperInfo: '',
      stuPaperId: '',
      isLoad: false
    }
  },
  created () {
    let {coursePaperId, lessonPaperId, mLessonPaperId, paperId} = this.$route.query
    this.getPaper({coursePaperId, lessonPaperId, mLessonPaperId, paperId})
  },
  computed: {
    btnInfo () {
      let {paperInfo, stuPaperId} = this
      let obj = {}
      if (paperInfo.is_finished) {
        obj.link = './paperResult?id=' + this.stuPaperId
        obj.text = '查看结果'
      } else {
        obj.link = './paper?stuPaperId=' + stuPaperId
        if (paperInfo.complete === '0') {
          obj.text = '开始答题'
        } else {
          obj.text = '继续答题'
        }
      }
      return obj
    }
  },
  methods: {
    /*
    * 获取学生试卷id
    *
    *@param [data] {object} {班级id, 课程id, 微课id}
    **/
    getPaper (data) {
      this.$toast.loading()
      let {post} = this.$axios
      post('/v1/student-paper/get-paper', data)
      .then(({data}) => {
        if (!data.status) {
          this.stuPaperId = data.data
          this.getPaperContent(data.data)
        } else {
          this.$toast.clear()
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    /*
    * 获取试卷封面内容
    *
    *@param [id] {num} 试卷id
    **/
    getPaperContent (id) {
      let {get} = this.$axios

      get('/v1/student-paper/paper-info', {
        params: {
          stuPaperId: id
        }
      })
      .then(({data}) => {
        this.$toast.clear()
        if (!data.status) {
          this.paperInfo = data.data
          this.isLoad = true
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    },
    /*
    *格式化时间-秒转具体时间
    *
    *@param [s] {num} 需要转化的秒
    **/
    foramtTime (s) {
      return formatSeconds(s)
    }
  }
}
</script>
<style lang="scss" scoped>
.m_body {
  padding: 30px;
  background-color: #fff;
  border-top: 1px #e7e7e9 solid;
  h2 {
    font-size: 22px;
    color: #000;
    text-align: center;
    margin-bottom: 20px;
  }
  .paper-info-list {
    padding: 10px;
    margin-bottom: 20px;
    li {
      margin-bottom: 8px;
    }
  }
}
</style>


