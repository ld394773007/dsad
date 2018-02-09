
<template>
  <div v-if="studentData">

    <div class="m-bd m-card">
      <h1 class="m-summary-title">
        学情报告单
      </h1>

      <div class="m-summary">

        <ul>
          <li>
            <div class="m-summary-value m-top-score">{{studentData.paper.student}}</div>
            <span class="m-summary-text">考生姓名</span>
          </li>
        </ul>
        <ul>
          <li>
            <!--{{getPaeprRight}}-->
            <div class="m-summary-value">{{getPaeprRight}}</div>
            <span class="m-summary-text">考生正确率</span>
          </li>
          <li>
            <div class="m-summary-value">{{(studentData.paper.per_avg_right*100).toFixed(2)}}%</div>
            <span class="m-summary-text">班均正确率 </span>
          </li>
        </ul>
        <ul>
          <li>
            <!-- {{studentData.paper.score}} -->
            <div class="m-summary-value">{{getPaeprScore}}</div>
            <span class="m-summary-text">考生得分</span>
          </li>
          <li>
            <div class="m-summary-value">{{studentData.paper.point}}</div>
            <span class="m-summary-text">试卷总分</span>
          </li>
        </ul>
        <ul>
          <li>
            <div class="m-summary-value">{{getPaperTime()}}</div>
            <span class="m-summary-text">考生用时</span>
          </li>
          <li>
            <div class="m-summary-value">{{(parseInt(studentData.paper.per_avg_time/60) > 50 ? '20' : parseInt(studentData.paper.per_avg_time/60)) + '分' + parseInt(studentData.paper.per_avg_time%60) + '秒'}}</div>
            <span class="m-summary-text">班均用时</span>
          </li>
        </ul>

      </div>
      <p class="m-knowledge-point">未掌握的知识点：<br>
        <span v-for="know in title">{{know}}</span></p>
    </div>

    <div class="m-bd m-card">
      <div class="m-title-line">
        <h2 class="m-sub-title">答题详情</h2>
      </div>
      <div class="table" style="width: 96%;">

        <table class="table-head" style="width: 100%;">
          <colgroup>
            <col width="10%">
            <col width="15%">
            <col width="20%">
            <col width="15%">
            <col width="20%">
            <col width="20%">
          </colgroup>
          <thead>
            <tr>
              <th>题号</th>
              <th>正确率</th>
              <th>班均正确率</th>
              <th>用时</th>
              <th>班均用时</th>
              <th>知识点</th>
            </tr>

          </thead>
        </table>
        <table class="table-body" style="width: 100%;">
          <colgroup>
            <col width="10%">
            <col width="15%">
            <col width="20%">
            <col width="15%">
            <col width="20%">
            <col width="20%">
          </colgroup>
          <tbody>
            <tr v-for="item in formatData" v-if="formatData">
              <td :style="{'background' : item.isRight == 0 && '#eeb7b4'}">{{item.sort}}</td>
              <td :style="{'background' : item.isRight == 0 && '#eeb7b4'}">
                <i style="vertical-align:middle;" class="icons" :class="{'icon_right': item.isRight == 1, 'icon_err': item.isRight != 1}" v-if="!item.childs"></i>
                <span v-if="item.childs">{{getRight(item.childs)}}</span>
              </td>
              <td :rowspan="item.rightIndex" v-if="item.rightHide != 1">{{parseInt(item.avg_right* 100) + '%'}}</td>
              <td :rowspan="item.timeIndex" v-if="item.timeHide != 1">
                {{formatTime(item.start_time, item.end_time)}}
              </td>
              <td :rowspan="item.timeIndex" v-if="item.timeHide != 1">{{item.avg_time > 60 ? parseInt(item.avg_time / 60) + '分' + parseInt(item.avg_time % 60) + '秒' : parseInt(item.avg_time) + '秒'}}</td>
              <td :rowspan="item.knowIndex" v-if="item.knowIndex">{{item.know.length ? item.know[0].name : '' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="m-title-line">
        <h2 class="m-sub-title">错题集</h2>
      </div>
      <div class="" v-for="(item, index) in errorData">
        <div class="questions-item m-question">
          <span class="m-question-num">{{item.sort}}</span>
          <p class="m-question-title" v-html=" item.title.replace(/<p>|<\/p>/ig, '').replace(/<\/h3>/ig, '</h3><br>').replace(/<\/h4>/ig, '</h4><br>')" style="font-size: 16px;"></p>
          <div class="m-question-options m-half" v-if="item.type != 4 && item.type !=3">
            <label :class="{'m-result-right': item.choice_answer == itemData.key,'m-result-wrong': item.choice_answer == itemData.key}" v-for="itemData in JSON.parse(item.items)">
              <input type="radio" name="12" value="" checked="">
                <div v-html="itemData.key + '.&nbsp;&nbsp;' + getValue(itemData.value)"></div>
            </label>
          </div>
          <div class="m-question-options m-half" v-if="item.type == 4">
            <input class="m-input" :class="{'m-result-wrong':itemData != JSON.parse(item.items)[index].value ,'m-result-right':itemData == JSON.parse(item.items)[index].value }" type="text" disabled="disabled" :value="itemData" autocomplete="off" v-for="(itemData,index) in typeof item.choice_answer == 'object' ? 1 : item.choice_answer.split(',')">
          </div>
          <div class="m-question-options m-half" v-if="item.type == 3">
            <label>
              <input type="radio" name="12" value="" checked="">
                <div v-html="'A' + '.&nbsp;&nbsp;' + 'YES'"></div>
            </label>
            <label>
              <input type="radio" name="12" value="" checked="">
                <div v-html="'B' + '.&nbsp;&nbsp;' + 'No'"></div>
            </label>
          </div>

        </div>
        <div class="m-result">

          <div class="m-result-content">

            <table>
              <tr>
                <th>你的答案</th>
                <td>{{item.type == 3 ?(item.choice_answer == '' ? '未答': item.choice_answer == 0 ? 'NO' : 'YES' ): (item.choice_answer == '' ? '未答' : item.choice_answer)}}</td>
                <th>正确答案</th>
                <td>{{item.type == 3 ?item.answer == 0 ? 'NO': 'YES' : item.answer}}</td>
              </tr>
              <tr>
                <th>解析</th>
                <td colspan="5" v-html="item.answer_info"></td>
              </tr>

            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="m-bd m-card">
      <div class="m-title-line">
        <h2 class="m-sub-title">作答分析</h2>
      </div>
      <div ref="cb" class="m-charts cb"></div>
      <div ref="c1" class="m-charts c1"></div>
      <div ref="c2" v-show="has_5" class="m-charts c2"></div>
      <div ref="c3" v-show="has_6" class="m-charts c3"></div>

    </div>
  </div>

  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    props: {
      score: {
        type: Number,
        default: 0
      },
      errs: {
        type: Number,
        default: 0
      },
      pid: {
        type: [Number, String],
        default: 0
      }
    },
    data () {
      return {
        has_5: false,
        has_6: false,
        option: {
          xzuobiao: [],
          studentTime: [],
          averTime: []
        },
        option1: {
          xzuobiao: [],
          studentTime: [],
          averTime: []
        },
        option2: {
          xzuobiao: [],
          studentTime: [],
          averTime: []
        },
        option3: {
          knowledge: [],
          studentData: [],
          averData: []
        },
        studentData: null,
        errorData: {},
        strArr: [{
          title: '选择题作答时间',
          des: '考生选择题作答时间，高于考场人均作答时间'
        }, {
          title: '完形填空作答时间',
          des: '考生完形填空作答时间，高于考场人均作答时间'
        }, {
          title: '阅读理解作答时间',
          des: '考生阅读理解作答时间，高于考场人均作答时间'
        }],
        title: [],
        loading: true
      }
    },
    computed: {
      getPaeprRight () {
        let count = 0
        let right = 0
        let result = this.studentData.result
        let {score} = this
        if (result) {
          result.forEach((e, i) => {
            if (!e.childs) {
              count++
              e.isRight && right++
            }
          })
        }
        return Number(score) > 0 ? '隐藏' : parseInt(right / count * 100) + '%'  // 是否显示成绩
      },
      getPaeprScore: function () {
        let {score} = this
        return Number(score) > 0 ? '隐藏' : this.studentData.paper.score // 是否显示成绩
      },
      formatData: function () {
        let resultData = this.studentData.result
        let data = []
        let index = 0
        let knowIndex = 0

        if (resultData) {
          resultData.forEach(function (e, i) {
            if (!e.childs) {
              data.push(e)
            }
          })

          data.forEach(function (e, i) {
            if (!i) {
              e.index = 1
              e.knowIndex = 1
              e.knowParent = 1
            } else {
              if (e.type === data[i - 1].type) {
                data[index].index++
              } else {
                e.index = 1
                index = i
              }
              if (e.know.length) {
                if (data[i - 1].know.length && (e.know[0].name === data[i - 1].know[0].name)) {
                  data[knowIndex].knowIndex++
                } else {
                  knowIndex = i
                  e.knowIndex = 1
                }
              }
            }

            if (e.know.length) {
              if (e.know[0].parent.length === 0) {
                e.knowName = e.know[0].name
              } else {
                getKnow(e.know[0].parent[0], e)
              }
            } else {
              e.knowName = '无知识点'
            }
          })
        } else {
          return false
        }

        function getKnow (e, e_) {
          if (e.parent.length > 0) {
            getKnow(e.parent[0], e_)
          } else {
            e_.knowName = e.name
            return e.name
          }
        }

        return data
      }
    },
    methods: {
      getValue: function (v) {
        return v.replace(/<p>|<\/p>/ig, '')
      },
      getPaperTime: function () {
        let paper = this.studentData.paper
        let time = paper.end_time - paper.start_time
        let day = time > 60 * 60 * 24 ? parseInt(time / 24 / 60 / 60) + '天' : ''
        let hours = time > 60 * 60 ? parseInt(time / 60 / 60 % 24) + '小时' : ''
        let minutes = parseInt(time / 60 % 60, 10) + '分'
        let seconds = parseInt(time % 60, 10) + '秒'

        return time < 0 ? '未提交' : day + hours + minutes + seconds
      },
      getStudentTime: function (data) {
        let this_ = this
        data.forEach(function (e, i) {
          if (!e.childs) {
            this_.option.xzuobiao.push(e.sort)
            this_.option.studentTime.push(e.end_time - e.start_time)
            this_.option.averTime.push(parseInt(e.avg_time))
          } else if (e.type === 5) {
            this_.has_ = true
            if (!this_.option1.xzuobiao[0]) {
              this_.option1.xzuobiao.push(0)
              this_.option1.studentTime.push(0)
              this_.option1.averTime.push(0)
            }

            this_.option1.xzuobiao.push(e.sort)
            this_.option1.studentTime.push(e.end_time - e.start_time)
            this_.option1.averTime.push(parseInt(e.avg_time))
          } else if (e.type === 6) {
            this_.has_6 = true
            if (!this_.option2.xzuobiao[0]) {
              this_.option2.xzuobiao.push(0)
              this_.option2.studentTime.push(0)
              this_.option2.averTime.push(0)
            }

            this_.option2.xzuobiao.push(e.sort)
            this_.option2.studentTime.push(e.end_time - e.start_time)
            this_.option2.averTime.push(parseInt(e.avg_time))
          }
        })

        this_.formatMaxTime(this_.option)
        this_.formatMaxTime(this_.option1)
        this_.formatMaxTime(this_.option2)
      },
      getKownData (data) {
        let averData = this.option3.averData
        let studentData = this.option3.studentData
        let knowledge = this.option3.knowledge
        let knowData = []
        let index = 0

        data.forEach(function (e, i) {
          knowData.push({
            know: e.knowName,
            studentRight: e.isRight,
            right: parseInt(e.avg_right * 100)
          })
        })

        knowData.sort(function (a, b) {
          let A = a.know
          let B = b.know

          return A > B ? -1 : A < B ? 1 : 0
        })

        knowData.forEach(function (e, i) {
          if (!i) {
            e.amount = 1
          } else {
            if (e.know === knowData[i - 1].know) {
              knowData[index].amount++
              knowData[index].right += e.right
              if (e.studentRight) {
                knowData[index].studentRight++
              }
            } else {
              index = i
              e.amount = 1
            }
          }
        })

        knowData.forEach(function (e, i) {
          if (e.amount) {
            knowledge.push(e.know)
            studentData.push(parseInt(e.studentRight / e.amount * 100))
            averData.push(parseInt(e.right / e.amount))
          }
        })
      },
      getRight: function (childs) {
        let right = 0
        childs.forEach(function (e, i) {
          if (e.isRight) {
            right += 1
          }
        })
        return (right / childs.length) * 100 + '%'
      },
      formatTime: function (start, end) {
        let time = end - start

        return time > 60 ? parseInt(time / 60) + '分' + (time % 60) + '秒' : time + '秒'
      },
      formatMaxTime: function (option, t) {
        let maxTime = 240

        t && (maxTime = maxTime * 2)
        option.studentTime.forEach(function (e, i) {
          if (e > maxTime) {
            option.studentTime[i] = maxTime
          }
        })

        option.averTime.forEach(function (e, i) {
          if (e > maxTime) {
            option.averTime[i] = maxTime - 120
          }
        })
      },
      DrawChart: function (element, options, strArr) {
        let myChart = echarts.init(element)
        let option = {
          title: {
            text: strArr.title,
            textStyle: {
              fontSize: 15,
              color: '#4e5661',
              fontWeight: 600
            },
            top: 10,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line'
            }
          },
          legend: {
            left: '50',
            top: '62',
            data: ['考生用时', '人均时间'],
            textStyle: {
              color: '#959aa0'
            }
          },
          grid: {
            top: '24%',
            bottom: '8%',
            left: '3%',
            right: '12%',
            containLabel: true
          },
          calculable: true,
          xAxis: [{
            name: '题号',
            nameLocation: 'end',
            nameGap: 10,
            data: options.xzuobiao,
            splitLine: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            boundaryGap: ['0%', '10%'],
            name: '时间/秒',
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#ededee']
              }
            }
          }],
          series: [{
            name: '考生用时',
            type: 'line',
            barWidth: '18',
            barGap: '50%',
            color: '#6b729e',
            itemStyle: {
              normal: {
                color: '#7dd4cb',
                width: '5',
                type: 'dashed',
                label: {
                  show: false,
                  position: 'top'
                }
              }

            },
            data: options.studentTime
          }, {
            name: '人均时间',
            type: 'line',
            barWidth: '18',
            barGap: '50%',
            color: '#6b729e',
            itemStyle: {
              normal: {
                color: '#d5bd74',
                label: {
                  show: false,
                  position: 'top'
                }
              }
            },
            data: options.averTime
          }]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      DrawChart1: function (element, options, strArr) {
        let myChart = echarts.init(element)
        let option = {

          title: {
            text: '考生知识点掌握情况',
            textStyle: {
              fontSize: 15,
              color: '#4e5661',
              fontWeight: 600
            },
            top: 8,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line'
            }
          },
          legend: {
            left: '5%',
            top: '16%',
            itemWidth: 10,
            itemHeight: 10,
            data: ['考生正确率', '班均正确率'],
            textStyle: {
              color: '#959aa0'
            }
          },
          grid: {
            top: '30%',
            bottom: '8%',
            left: '5%',
            right: '6%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: options.knowledge,
            axisLabel: {
              interval: 0,
              formatter: function (val) {
                return val.split('').join('\n')
              }
            }
          }],

          yAxis: [{
            type: 'value',
            boundaryGap: ['0%', '10%'],
            splitLine: {
              lineStyle: {
                color: ['#ededee']
              }
            }

          }],
          series: [{
            name: '考生正确率',
            type: 'bar',
            color: '#6b729e',
            itemStyle: {

              normal: {

                color: '#7dd4cb',
                label: {
                  show: false,
                  position: 'top'
                }
              }

            },
            data: options.studentData

          }, {
            name: '班均正确率',
            type: 'bar',
            barWidth: '28%',
            barGap: '20%',
            color: '#6b729e',
            itemStyle: {
              normal: {
                color: '#d5bd74',
                label: {
                  show: false,
                  position: 'top'
                }
              }

            },
            data: options.averData

          }]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      }
    },
    mounted: function () {
      let this_ = this
      let {get} = this.$frontend
      let {pid, errs} = this
      get('/v1/result-share/share', {
        params: {stuPaperId: pid}
      })
        .then(({data}) => {
          if (data.status === 0) {
            this_.studentData = data.data
            this_.getStudentTime(this_.studentData.result)

            this_.studentData.result.forEach(function (e, i) {
              if (e.childs) {
                e.childs.forEach(function (e_, i_) {
                  !i_ ? (e_.timeIndex = e.childs.length) : (e_.timeHide = 1)
                  !i_ ? (e_.rightIndex = e.childs.length) : (e_.rightHide = 1)
                  e_.sort = (i + 1) + '-' + (i_ + 1)
                  e_.type = e.type
                  e_.start_time = e.start_time
                  e_.end_time = e.end_time
                  e_.avg_right = e.avg_right
                  e_.avg_time = e.avg_time
                  e_.group = 1
                  this_.studentData.result.push(e_)
                })
              }
            })

            this_.getKownData(this_.formatData)

            // 错题集
            this_.errorData = data.data.error_list
            let errCount = Number(errs)
            if (errCount > 0) {
              this_.errorData = data.data.error_list.slice(0, errCount)
            }

            this_.errorData.sort(function (a, b) {
              return a.sort - b.sort
            })
          }

          this.$nextTick(function () {
            this_.DrawChart(this_.$refs.c1, this_.option, this_.strArr[0])
            this_.DrawChart(this_.$refs.c2, this_.option1, this_.strArr[1])
            this_.DrawChart(this_.$refs.c3, this_.option2, this_.strArr[2])
            this_.DrawChart1(this_.$refs.cb, this_.option3)
          })
          this_.option3.studentData.forEach(function (e, i) {
            if (e < 60) {
              this_.title.push(this_.option3.knowledge[i])
            }
          })

          this_.loading = false
          this.$toast.clear()
        })

      /*
                  $.get(api.getErrorQuestion, { stuPaperId: api.getQueryString('pid') })
                  .then(function(req) {
                      if (req.status == 0) {
                          this_.errorData = req.data.slice(0,11)
                          this_.errorData.sort(function(a,b) {
                              return a.sort-b.sort
                          })
                      }
                  })
      */
    }
  }
</script>
<style lang="scss" scoped>
@import "./paper-m.scss";

img {
  vertical-align: middle;
}
.icons {
  display: block;
  width: 20px;
  height: 20px;
  margin: 0 auto;
}
.icon_right {
  background: url('/static/images/right.png') no-repeat;
  background-size: 100%;
}
.icon_err {
  background: url('/static/images/wrong.png') no-repeat;
  background-size: 100%;
}
</style>
