
<template>
  <div class="paper">
    <van-nav-bar class="header-bar" left-arrow @click-left="handleClick">
      <div class="absolute border-radius" slot="title">
        <mu-raised-button :label="`${index}/${paperData == '' ? 0 : paperData.data.length}`" @click="showDialog" event="touchstart" />
      </div>
      <p slot="right">{{timeText}}</p>
    </van-nav-bar>
    <paper v-if="index == item.sort" v-for="(item, i) in paperData.data" :key="i" :item="item"></paper>
    <a @click="changeIndex(false)" class="paper-next-button"><van-icon name="arrow" /></a>
    <mu-dialog @close="close" :open="dialog" scrollable>
      <div class="paper-list">
        <div class="paper-list-title">
          <span class="wd">
            未答
          </span>
          <span class="yd">
            已答
          </span>
        </div>
        <ul>
          <li class="paper-item" :key="i" v-for="(item, i) in paperData.data">
            <mu-raised-button event="touchstart" @click="changeIndex(item.sort)" :label="`${item.sort}`" :backgroundColor="getStatus(item)"/>
          </li>
        </ul>
      </div>
      <mu-flat-button primary label="关闭" event="touchstart" @click="close" slot="actions"/>
    </mu-dialog>
  </div>
</template>
<script>
import { formatTime } from '@/common/js/utils'
import paper from '@/components/paper'
import floatButton from 'muse-components/floatButton'
import appbar from 'muse-components/appbar'
import dialog from 'muse-components/dialog'
import flatButton from 'muse-components/flatButton'
import raisedButton from 'muse-components/raisedButton'
export default {
  components: {
    paper,
    [appbar.name]: appbar,
    [floatButton.name]: floatButton,
    [dialog.name]: dialog,
    [raisedButton.name]: raisedButton,
    [flatButton.name]: flatButton
  },
  data () {
    return {
      paperData: '',
      timeText: '00:00:00',
      index: 1,
      dialog: false,
      timeList: [],
      failList: [],
      timer: ''
    }
  },
  created () {
    let {stuPaperId} = this.$route.query
    this.getPaperContent(stuPaperId)
  },
  computed: {
    isEnd () {
      return this.index === this.paperData.data.length
    },
    isComplete () {
      let complete = true

      this.paperData.data.forEach(e => {
        if (!e.childs.length) {
          if (e.type === 4) {
            e.answer.split(',').length !== e.items.length && (complete = false)
          } else {
            e.answer === '' && (complete = false)
          }
        } else {
          if (e.answer === '') {
            complete = false
          } else {
            e.answer.forEach(el => {
              (!el.answer || el.answer === '') && (complete = false)
            })
          }
        }
      })
      return complete
    }
  },
  methods: {
    handleClick () {
      this.$dialog.alert({
        title: '提示',
        message: '作答已保存，下次可以继续答题哦！'
      }).then(() => {
        this.$router.go(-1)
      })
    },
    /*
    *
    *获取试卷内容
    *
    *@param [id] {num} 学生试卷id
    **/
    getPaperContent (id) {
      let {get} = this.$axios

      get('/v1/student-paper/get-paper-content', {
        params: {stuPaperId: id}
      })
      .then(({data}) => {
        if (!data.status) {
          this.paperData = data.data
          this.setTime()
          this.enterQuestion(1)
          this.$toast.clear()
        } else {
          this.$dialog.alert({
            title: '错误提示',
            message: data.message
          }).then(() => {
            this.$router.go(-1)
          })
        }
      })
      .catch(err => {
        if (err) {
          this.$router.go(-1)
        }
      })
    },
    // 获取试题作答情况
    getStatus (item) {
      let isAnswer = '#ccc'
      item.answer !== '' && (isAnswer = '#13ce66')
      return isAnswer
    },
    // 切换到下一道试题
    next () {

    },
    // 切换试题
    changeIndex (i) {
      let {paperData, changeIndexEnt} = this
      let isAnswer = this.checkIsAnswer(paperData.data[this.index - 1])
      this.dialog && (this.dialog = false)
      console.log(isAnswer)
      if (!isAnswer && !this.isEnd) {
        this.$dialog.confirm({
          message: '当前试题还未完成, 是否跳过进入下一题？'
        }).then(() => {
          changeIndexEnt(i, false)
        })
      } else {
        changeIndexEnt(i)
      }
    },
    // 切换试题触发事件
    changeIndexEnt (i) {
      let {index, enterQuestion, paperData, isComplete, submitAnswer, timeList} = this
      let data = paperData.data[index - 1]
      let paperSN = paperData.paper_sn
      let startTime = timeList[index]
      let answer = typeof data.answer === 'object' ? JSON.stringify(data.answer) : data.answer
      if (i) {
        if (data.answer !== '') {
          submitAnswer({
            learnId: data.learn_id,
            paperSN: paperSN,
            answer: answer,
            startTime: startTime
          })
        }
        this.index = i
        enterQuestion(this.index)
      } else {
        if (!this.isEnd) {
          console.log(data.answer)
          if (data.answer !== '') {
            submitAnswer({
              learnId: data.learn_id,
              paperSN: paperSN,
              answer: answer,
              startTime: startTime
            })
          }
          this.index += 1
          enterQuestion(this.index)
        } else {
          this.$dialog.confirm({
            message: isComplete ? '是否提交试卷？' : '你还有试题未做完，是否提交试卷？'
          }).then(() => {
            if (data.answer !== '') {
              submitAnswer({
                learnId: data.learn_id,
                paperSN: paperSN,
                answer: answer,
                startTime: startTime
              }, this.submitPaper)
            } else {
              this.submitPaper()
            }
          })
        }
      }
    },
    /*
    * @description 检查是否作答
    * @params {object} item 当前作答题目
    **/
    checkIsAnswer (item) {
      let isAnswer = true
      if (item.childs.length > 1) {
        if (item.answer.length !== item.childs.length) {
          isAnswer = false
        } else {
          item.answer.forEach(e => {
            if (e.answer === '') {
              isAnswer = false
            }
          })
        }
      } else {
        if (item.answer === '') {
          isAnswer = false
        }
      }
      return isAnswer
    },
    // 进入试题时间
    enterQuestion (i) {
      !this.timeList[i] && (this.timeList[i] = formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss'))
    },
    // 提交答案
    submitAnswer (obj, fn) {
      let {post} = this.$axios
      post('/v1/student-paper/answer', obj)
      .then(({data}) => {
        if (!data.status) {
          fn && fn()
        } else {
          this.failList.push(obj)
          this.$dialog.alert({
            title: '错误提示',
            message: data.message
          })
        }
      })
    },
    // 提交试卷
    submitPaper () {
      let {put} = this.$axios
      let {stuPaperId} = this.$route.query
      this.$toast.loading()
      put('/v1/student-paper/paper-complete', {
        paperSN: this.paperData.paper_sn
      })
      .then(({data}) => {
        this.$toast.clear()
        if (!data.staus) {
          this.$router.push('./paperResult?id=' + stuPaperId)
        } else {
          this.$dialog.alert({
            title: '错误提示',
            message: data.message
          })
        }
      })
    },
    // 显示试题列表
    showDialog () {
      this.dialog = true
    },
    // 设置计时
    setTime () {
      let timeDiffer = this.paperData.diff_time
      this.timer = setInterval(() => {
        this.timeText = this.countTime(timeDiffer)
        timeDiffer += 1
      }, 1000)
    },
    countTime (t) {
      let hour = Math.floor(t / 60 / 60)
      let minute = Math.floor(t / 60 % 60)
      let second = Math.floor(t % 60)

      let hourText = hour < 10 ? '0' + hour : hour
      let minuteText = minute < 10 ? '0' + minute : minute
      let secondText = second < 10 ? '0' + second : second
      return hourText + ':' + minuteText + ':' + secondText
    },
    close () {
      this.dialog = false
    }
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.timer)
    next()
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$toast.loading({
        message: '加载中'
      })
    })
  }
}
</script>



