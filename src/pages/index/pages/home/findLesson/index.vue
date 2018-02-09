<template>
  <div>
    <van-nav-bar class="m_header">
      <p slot="title">找课</p>
    </van-nav-bar>
    <mu-avatar slot="left" src="/static/images/avater/avater_gril@2x.png"/>
    <srcoll
      ref="scroll"
      :data="courseList"
      class="m_body"
      :pullDownRefresh="true"
      @pullingDown="onPullingDown"
    >
      <div class="content">
        <van-swipe :autoplay="3000">
          <van-swipe-item class="swipe_item">
            <img src="/static/images/zhaoke/banner@2x.png">
          </van-swipe-item>
        </van-swipe>
        <div class="screen_nav">
          <div class="screen_nav_item" @click="gradeVisibald = true">
            <p>{{gradeColumns[gradeFilter]}}</p><i></i>
          </div>
          <div class="screen_nav_item" @click="subjectVisibald = true">
            <p>{{subjectColumns[categoryIndex]}}</p><i></i>
          </div>
        </div>
        <div class="list_data">
          <div v-show="!courseList.length">
            <i class="class_kong"></i>
            <p class="class_kong_text">没有相关课程</p>
          </div>
          <div class="list_item" v-for="(item, index) in courseList" @click="handleClick(item)">
            <i class="recommend_icon" v-if="listData.product[item.id].is_elite"></i>
            <div class="list_item_title"><i class="file_icon">{{categoryList[item.category_id]}}</i><p>{{listData.product[item.id].pro_name}}</p></div>
            <span class="list_item_subtitle">{{_formatText(listData.lesson[item.id], item)}}</span>
            <div class="list_item_footer">
              <div class="list_item_footer_left">
                <img src="/static/images/avater/avater_man@2x.png">
                <p>{{listData.teacher[listData.lesson[item.id][0].teacher_id].realname}}</p>
              </div>
              <div class="list_item_footer_right">
                <p class="price"><i v-show="listData.product[item.id].market_price !== '0.00'">¥</i><span>{{listData.product[item.id].market_price === '0.00' ? '免费' : listData.product[item.id].market_price}}</span></p>
                <span>已售{{randNum(listData.student[item.id])}}</span>
              </div>
            </div>
          </div>
          <div class="no_more">
            没有更多内容了
          </div>
        </div>
      </div>
    </srcoll>
    <van-actionsheet v-model="gradeVisibald">
      <van-picker
        show-toolbar
        :title="选择年级"
        :columns="gradeColumns"
        @cancel="gradeVisibald = false"
        @confirm="onGradeConfirm"
      />
    </van-actionsheet>
    <van-actionsheet v-model="subjectVisibald">
      <van-picker
        show-toolbar
        :title="选择科目"
        :columns="subjectColumns"
        @cancel="subjectVisibald = false"
        @confirm="onSubjectConfirm"
      />
    </van-actionsheet>
  </div>
</template>
<script>
import {formatTime} from '@/common/js/utils'
export default {
  name: 'findLesson',
  props: {
    listData: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      categoryFilter: 0,
      categoryIndex: 0,
      gradeFilter: 0,
      subjectVisibald: false,
      gradeVisibald: false,
      categoryList: {
        '1': '英',
        '9': '数'
      },
      subjectColumns: ['全部科目', '英语', '数学'],
      subjectValues: [1, 9],
      gradeColumns: ['全部年级', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三']
    }
  },
  computed: {
    courseList () {
      let {listData} = this
      if (!listData.course) return []
      let data = listData.course.filter(e => {
        if (!this.categoryFilter && !this.gradeFilter) return e
        if (!this.categoryFilter && this.gradeFilter) return (Number(e.tags) === this.gradeFilter)
        if (this.categoryFilter && !this.gradeFilter) return (Number(e.category_id) === this.categoryFilter)
        if (this.categoryFilter && this.gradeFilter) return (Number(e.category_id) === this.categoryFilter && Number(e.tags) === this.gradeFilter)
      })

      return data.sort((a, b) => {
        return this.listData.product[a.id].is_elite < this.listData.product[b.id].is_elite
      })
    }
  },
  methods: {
    handleClick (item) {
      let teacherInfo = this.listData.teacher[this.listData.lesson[item.id][0].teacher_id]
      teacherInfo.num = this.randNum(this.listData.student[item.id])
      teacherInfo.grade = this.gradeColumns[item.tags === '' ? 0 : Number(item.tags)]
      sessionStorage.setItem('teacherInfo', JSON.stringify(this.listData.teacher[this.listData.lesson[item.id][0].teacher_id]))
      this.$router.push('/details?id=' + this.listData.product[item.id].id)
    },
    onGradeConfirm (v, i) {
      this.gradeFilter = i
      this.gradeVisibald = false
    },
    onSubjectConfirm (v, i) {
      this.categoryIndex = i
      this.categoryFilter = i ? this.subjectValues[i - 1] : 0
      this.subjectVisibald = false
    },
    onPullingDown () {
      this.$emit('pullDown')
    },
    randNum (n) {
      let num = !n ? 1 : n.length
      let randNum = Math.floor(num / 1.4 * 50)
      return randNum
    },
    _formatText (data, course) {
      let startTime = formatTime(new Date(data[0].start_time * 1000), 'MM月DD日')
      let endTime = formatTime(new Date(data[data.length - 1].end_time * 1000), 'MM月DD日')
      return `${startTime}-${endTime} ${data.length}节课 ${this.gradeColumns[course.tags === '' ? 0 : Number(course.tags)]}`
    }
  },
  components: {
    srcoll: () => import('@/components/srcoll')
  }
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/variable/index';
@import '../../../assets/scss/minix/index';

.class_kong {
  margin: 20px auto;
  display: block;
  width: 128px;
  height: 104px;
  @include dprImg('class_kong');
  background-size: 100%;
  background-repeat: no-repeat;
}
.class_kong_text {
  text-align: center;
  font-size: 16px;
}

.m_body {
  bottom: 60px;
  background-color: #F6F7F9;
}

.swipe_item {
  img {
    width: 100%;
  }
}
.screen_nav {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  background-color: #fff;
  &_item {
    height: 44px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      margin-left: 5px;
      display: block;
      width: 8px;
      height: 5px;
      @include dprImg('zhaoke/pointer');
      background-size: 100%;
    }
  }
}
.list_data {
  padding: 16px;
  padding-bottom: 0;
  position: relative;
  .loading_wrap {
    position: absolute;
    display: flex;
    justify-content: center;
    padding-top: 20px;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, .8);
  }
  .list_item {
    margin-bottom: 16px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 26px 16px;
    background-color: #fff;
    border-radius: 5px;
    color: #000;
    span {
      font-size: 12px;
      color: #adadbd;
    }
    .recommend_icon {
      right: -2px;
      top: -2px;
      position: absolute;
      width: 26px;
      height: 26px;
      @include dprImg('zhaoke/hot');
      background-size: 100%;
    }
    &_title {
      height: 60px;
      display: flex;
      font-size: 20px;
      line-height: 28px;
      font-weight: bold;
      p {
        width: 90%;
      }
      i {
        margin-right: 10px;
        display: block;
        width: 22px;
        height: 30px;
        @include dprImg('file_icon');
        background-size: 100%;
        background-position-y: 5px;
        background-repeat: no-repeat;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        font-weight: normal;
        color: #fff;
      }
    }
  }
  .list_item_footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 5px;
    &_left {
      display: flex;
      align-items: center;
      img {
        margin-right: 20px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
    &_right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .price {
        display: flex;
        align-items: baseline;
        font-weight: bold;
        span {
          font-size: 24px;
          color: #F25417;
        }
        i {
          font-size: 14px;
          line-height: 10px;
          color: #F25417;
        }
      }
    }
  }
}
</style>


