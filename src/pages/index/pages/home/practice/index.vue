<template>
  <div>
    <van-nav-bar class="m_header">
      <p slot="title">练习</p>
    </van-nav-bar>
    <div class="screen_nav">
      <div class="screen_nav_item" @click="gradeVisibald = true">
        <p>{{gradeColumns[gradeFilter]}}</p><i></i>
      </div>
      <div class="screen_nav_item" @click="subjectVisibald = true">
        <p>{{subjectColumns[categoryIndex]}}</p><i></i>
      </div>
    </div>
    <srcoll
      ref="scroll"
      class="m_body"
      :data="data"
      :pullDownRefresh="true"
      @pullingDown="onPullingDown"
    >
      <div class="content">

        <div class="list_data">
          <div class="loading_wrap" v-if="loading">
            <van-loading type="circle" color="black" style="width: 26px;height:26px" />
          </div>
          <div v-show="!testList.length">
            <i class="class_kong"></i>
            <p class="class_kong_text">没有相关练习</p>
          </div>
          <div class="list_item" @click="handleClick(item,i)" :key="i" v-for="(item, i) in testList">
            <i class="recommend_icon" v-show="item.is_elite"></i>
            <div class="list_item_left">
              <img :src="item.image_src === '' ? '/static/images/test_default@3x.jpg' : item.image_src">
            </div>
            <div class="list_item_right">
              <div><p>{{item.paper_title}}</p></div>
              <div><span>{{`${gradeColumns[item.paper.grade]} ${filterCategory(item.paper.category_id)}`}}</span></div>
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
        title="选择年级"
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

export default {
  name: 'findLesson',
  props: {
    data: {
      type: [Array, Boolean],
      default: []
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      is_empty: false,
      categoryFilter: 0,
      categoryIndex: 0,
      gradeFilter: 0,
      subjectVisibald: false,
      gradeVisibald: false,
      subjectColumns: ['全部科目', '英语', '数学'],
      subjectValues: [{
        index: 1,
        value: 1
      },
      {
        index: 2,
        value: 9
      }],
      gradeColumns: ['全部年级', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三']
    }
  },
  computed: {
    testList () {
      let {data} = this
      if (!data.length) return []
      return data.filter(e => {
        if (!this.categoryFilter && !this.gradeFilter) return e
        if (!this.categoryFilter && this.gradeFilter) return (Number(e.paper.grade) === this.gradeFilter)
        if (this.categoryFilter && !this.gradeFilter) return (Number(e.paper.category_id) === this.categoryFilter)
        if (this.categoryFilter && this.gradeFilter) return (Number(e.paper.category_id) === this.categoryFilter && Number(e.paper.grade) === this.gradeFilter)
      })
    }
  },
  methods: {
    handleClick (item, i) {
      sessionStorage.setItem('paperData', JSON.stringify(item))
      this.$router.push('./testDetail?id=' + item.paper.id)
    },
    filterCategory (id) {
      let index = 0
      this.subjectValues.forEach(e => {
        if (e.value === id) {
          index = e.index
        }
      })

      return this.subjectColumns[index]
    },
    onGradeConfirm (v, i) {
      this.gradeFilter = i
      this.gradeVisibald = false
    },
    onSubjectConfirm (v, i) {
      this.categoryIndex = i
      this.categoryFilter = i ? this.subjectValues[i - 1].value : 0
      this.subjectVisibald = false
    },
    onPullingDown () {
      this.$emit('pullDown')
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
  top: 86px;
  bottom: 60px;
}
.screen_nav {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  background-color: #fff;
  border-top: 1px rgb(235, 232, 232) solid;
  &_item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
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
  }
  .list_item {
    box-sizing: border-box;
    margin-bottom: 16px;
    position: relative;
    display: flex;
    height: 110px;
    padding: 16px;
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
  }
  .list_item_left {
    flex: 1;
    margin-right: 10px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .list_item_right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & > p {
      font-size: 16px;
    }
    & > span {
      margin: 8px 0;
    }
    div {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>


