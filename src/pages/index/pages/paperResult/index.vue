<template>
  <div class="paper-result ">
    <van-nav-bar class="header-bar" left-arrow @click-left="onClickLeft">
      <div slot="title">
        评测结果
      </div>
    </van-nav-bar>
    <div class="paper-result-content paper-list" v-if="resultData != ''">
      <div class="result-info">
        <div class="info-left">
          <span>{{`共${resultData.paper.total}道题`}}</span>
          <span>作答用时： 4分36秒</span>
        </div>
        <div class="info-right">
          <span>得分：</span>
          <span class="red">{{score}}</span>
        </div>
      </div>
      <div class="paper-list-title">
        <span class="wd">
          未答
        </span>
        <span class="cw">
          错误
        </span>
        <span class="yd">
          正确
        </span>
      </div>
      <div class="user-list result-list">
        <span class="user-list-title">试题</span>
        <ul>
          <li class="paper-item" :key="i" v-for="(e,i) in resultData.result">
            <mu-raised-button :label="`${e.sort}`" :backgroundColor="getStatus(e)"/>
          </li>
        </ul>
      </div>
      <a class="m_btn full" v-if="!paperId" @click="encrypted" >查看详细报告</a>
    </div>
    <div style="margin-to: 20px;">
      <result v-if="paperId" :pid="paperId" />
    </div>
  </div>
</template>

<script>
  import result from '@/components/paper/result'
  import raisedButton from 'muse-components/raisedButton'
  export default {
    components: {
      result,
      [raisedButton.name]: raisedButton
    },
    data () {
      return {
        id: '',
        paperId: 0,
        resultData: ''
      }
    },
    created () {
      this.id = this.$route.query.id
      this.getPaperResult()
    },
    computed: {
      score () {
        let score = 0

        this.resultData.result.forEach(e => {
          if (e.isRight) {
            score += e.point
          }
        })

        return score
      }
    },
    methods: {
      onClickLeft () {
        window.sessionStorage.setItem('homeActive', 1)
        this.$router.replace('./login')
      },
      // 加密结果
      async encrypted () {
        let {get} = this.$frontend
        this.$toast.loading({
          message: '加载中'
        })
        get('/v1/student-result/encrypt', {
          params: {stuPaperId: this.id}
        })
        .then(({data}) => {
          if (!data.status) {
            this.paperId = data.data
          }
        })
      },
      async getPaperResult () {
        let {
          get
        } = this.$axios
        let {
          id
        } = this.$route.query

        await get('/v1/student-paper/paper-result', {
          params: {
            stuPaperId: id
          }
        })
          .then(({
            data
          }) => {
            if (!data.status) {
              this.resultData = data.data
            } else {
              this.$dialog.alert({
                title: '错误提示',
                message: data.message
              })
            }
          })
        this.$toast.clear()
      },
      // 获取试题作答情况
      getStatus (item) {
        if (item.answer === '') {
          return '#ccc'
        } else if (item.isRight) {
          return '#13ce66'
        } else {
          return '#FF0000'
        }
      }
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
<style lang="scss" scoped>
.user-list-title {
    display: block;
    text-align: center;
    width: 74px;
    height: 24px;
    font-size: 12px;
    color: #fff;
    line-height: 24px;
    background: url('/static/images/u1204.png') no-repeat;
}
.paper-result  {
  padding-top: 46px;
}
.header-bar {
  left: 0;
  top: 0;
  right: 0;
  position: fixed;
  background-color: #fff;
  z-index: 99;
  padding-top: 0;
  height: 46px;
}
</style>


