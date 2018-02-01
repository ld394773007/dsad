<template>
  <div class="content" >
    <div class="add_btn_wrap" @click="$router.push('/addLesson')">
      <van-icon class="icon" name="add-o" /><el-button type="text">开新课</el-button>
    </div>
    <srcoll
        class="scroll_content"
        ref="scroll"
        :data="list"
        >
          <div class="loading_content" v-if="show">
            <van-loading style="width: 22px; height: 22px;" type="circle" color="black" />
          </div>
          <div class="list_content" v-if="!show" style="padding: 15px;">
              <div class="no_lesson" v-if="!list.length">
                <i class="icon_no_lesson"></i>
                <p>没有相关班级哦~</p>
              </div>

              <ul class="course_list" v-if="list.length">
                <li class="course_item" :key="i" v-for="(e,i) in list" @click="$router.push('/courseDetails?id=' + e.id)">
                  <div class="course_item_header">
                    <div class="course_profit">
                      <span>收益</span>
                      <p><i>¥</i>{{e.product.id ? toDecimal2(getNum(e.product.market_price * e.student.length))  : '0.00'}}</p>
                    </div>
                    <div class="course_info">
                      <h2>{{e.name}}</h2>
                      <span>时间：{{formatCourseTime(e.lesson)}}</span>
                    </div>
                  </div>
                  <ul class="course_item_footer">
                    <li>
                      <span>预约学生</span>
                      <p class="yyxs">{{e.studentUnPay.length}}</p>
                    </li>
                    <li>
                      <span>缴费学生</span>
                      <p class="jfxs">{{e.student.length}}</p>
                    </li>
                    <li>
                      <span>课程数</span>
                      <p class="kcs">{{e.lesson.length}}</p>
                    </li>
                  </ul>
                </li>
              </ul>

            </div>
      </srcoll>
  </div>
</template>
<script>
import {formatTime} from '@/common/js/utils'
import srcoll from '@/components/srcoll'
export default {
  name: 'course',
  data () {
    return {
      show: true,
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      let {get} = this.$axios
      get('/v1/teacher-lesson/case-products')
      .then(({data}) => {
        if (!data.status) {
          this.$store.commit('UPDATE_COURSE_LIST', data.data)
          for (let item in data.data) {
            this.list.push(data.data[item])
          }

          this.list.forEach(e => {
            e.lesson.sort((a, b) => {
              return a.start_time - b.start_time
            })
          })
          this.list.sort((a, b) => {
            return b.lesson[0].start_time - a.lesson[0].start_time
          })
          this.show = false
        } else {
          this.show = false
        }
      })
    },
    formatCourseTime (data) {
      if (!data.length) {
        return '时间未定'
      } else {
        let start = formatTime(new Date(data[0].start_time * 1000), 'YYYY-MM-DD')
        let end = formatTime(new Date(data[data.length - 1].end_time * 1000), 'YYYY-MM-DD')
        return start + ' 至 ' + end
      }
    },
    // 格式化价格
    getNum (s) {
      return parseFloat(parseFloat(s).toFixed(2))
    },
    toDecimal2 (x) {
      let f1 = parseFloat(x)
      if (isNaN(f1)) {
        return false
      }
      let f = Math.round(x * 100) / 100
      let s = f.toString()
      let rs = s.indexOf('.')
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + 2) {
        s += '0'
      }
      return s
    }
  },
  components: {
    srcoll
  }
}
</script>
<style lang="scss" scoped>
@import './index'
</style>
