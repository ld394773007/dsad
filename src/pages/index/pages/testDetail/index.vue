<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header" fixed right-text="" @click-left="$router.go(-1)" left-arrow>
      <p slot="title">评测</p>
    </van-nav-bar>
    <srcoll
      :data="paperData"
      ref="scroll"
      class="m_body"
    >
      <div class="content">
        <div class="test_banner">
          <img :src="paperData.image_src == '' ? '/static/images/test_default@3x.jpg' : paperData.image_src">
        </div>
        <div class="test_content">
          <div class="test_info">
            <p>{{paperData.paper_title}}</p>
            <span>{{`${grade[paperData.paper.grade]} ${catgory[paperData.paper.category_id] ? catgory[paperData.paper.category_id] : '全部科目'}`}}</span>
            <!-- <span class="test_info_right">已有20人练习</span> -->
          </div>
          <div class="test_my_score" v-show="paperInfo.is_finished">
            <p>我的成绩</p>
            <a @click="handleClick" style="color: #34A9FF;padding: 15px 20px;">查看成绩</a>
          </div>
          <div class="test_introduce">
            <h2>真题介绍</h2>
            <div class="test_introduce_info" v-html="paperData.summary"></div>
          </div>
        </div>
      </div>
    </srcoll>
    <div class="fixed_bottom_wrap">
      <a class="m_btn full" @click="handleClick">{{btnInfo.text}}</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'testDetail',
  data () {
    return {
      paperData: null,
      paperInfo: '',
      stuPaperId: '',
      isLoad: false,
      id: 0,
      catgory: {
        '1': '英语',
        '9': '数学'
      },
      grade: {
        '1': '一年级',
        '2': '二年级',
        '3': '三年级',
        '4': '四年级',
        '5': '五年级',
        '6': '六年级',
        '7': '初一',
        '8': '初二',
        '9': '初三'
      }
    }
  },
  created () {
    let paperData = sessionStorage.getItem('paperData')
    let {id} = this.$route.query
    this.id = id
    if (this.userInfo.id) {
      this.getPaper()
    }
    if (paperData) {
      this.paperData = JSON.parse(paperData)
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    btnInfo () {
      let {paperInfo} = this
      let obj = {}
      if (paperInfo === '') {
        obj.link = './paper?stuPaperId=' + this.stuPaperId
        obj.text = '开始答题'
        return obj
      }
      if (paperInfo.is_finished) {
        obj.link = './paperResult?id=' + this.stuPaperId
        obj.text = '查看成绩'
      } else {
        obj.link = './paper?stuPaperId=' + this.stuPaperId
        if (paperInfo.complete !== '0') {
          obj.text = '继续答题'
        } else {
          obj.text = '开始答题'
        }
      }
      return obj
    }
  },
  watch: {
    userInfo (n) {
      if (n.id) {
        this.getPaper()
      }
    }
  },
  methods: {
    handleClick () {
      this.$toast.loading()
      let {id} = this.$store.state.userInfo
      if (!id) {
        this.$toast.clear()
        this.$store.commit('CHANGE_LOGIN_STATUS', true)
      } else {
        this.$router.push(this.btnInfo.link)
      }
    },
    /*
    * 获取学生试卷id
    *
    *@param [data] {object} {班级id, 课程id, 微课id}
    **/
    getPaper () {
      this.$toast.loading()
      let {post} = this.$axios
      post('/v1/student-paper/get-paper', {paperId: this.id})
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
        } else {
          this.$dialog.alert({
            title: '提示',
            message: data.message
          })
        }
      })
    }
  },
  components: {
    srcoll: () => import('@/components/srcoll')
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/minix/index';
.m_body {
  bottom: 41px;
}
.test_banner {
  margin-bottom: 10px;
  img {
    width: 100%;
  }
}
.test_content {
  padding: 16px;
}
.test_info {
  padding: 16px 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 105px;
  @include dprImg('zhaoke/smolltop_back', 'jpg');
  background-size: 100%;
  background-repeat: no-repeat;
  font-size: 16px;
  color: #fff;
  span {
    font-size: 14px;
    color: #c9c9ca;
  }
  &_right {
    align-self: flex-end;
  }
}
.test_introduce_info {
  word-wrap: break-word;
  word-break: normal;
}
.test_my_score {
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  padding-right: 0;
  background-color: #fff;
  color: #000;
  div {
    color: #ADADBD;
    display: flex;
    align-items: center;
    font-size: 12px;
  }
}
.test_introduce {
  margin-top: 20px;
  padding: 16px 12px;
  background-color: #fff;
  h2 {
    font-size: 18px;
    color: #000;
    margin-bottom: 16px;
  }
}
.fixed_bottom_wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>


