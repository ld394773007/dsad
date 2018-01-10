<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header" fixed left-arrow @click-left="close">
        <span slot="title">意见反馈</span>
      </van-nav-bar>
      <div class="m_body pd16">
        <van-cell-group>
          <van-field v-model="title" placeholder="标题内容"  label="标题" />
          <van-field
            v-model="content"
            label="反馈内容"
            type="textarea"
            placeholder="请输入反馈内容"
            rows="4"
        />
        </van-cell-group>
        <a class="m_btn" @click="submit">提交反馈</a>
      </div>
  </div>
</template>
<script>
export default {
  name: 'feedblack',
  data () {
    return {
      content: '',
      title: ''
    }
  },
  methods: {
    close () {
      this.$router.go(-1)
    },
    submit () {
      let feedbackData = localStorage.getItem('feedback')
      let {title, content} = this
      if (!(title !== '' && content !== '')) {
        this.$toast('请填写完整信息')
        return
      }
      if (feedbackData) {
        feedbackData = JSON.parse(feedbackData)
        feedbackData.push({title, content})
      } else {
        feedbackData = [{
          title,
          content
        }]
      }

      localStorage.setItem('feedback', JSON.stringify(feedbackData))
      this.$toast('提交成功！')
    }
  }
}
</script>
<style lang="scss" scoped>
.pd16 {
  padding-top: 16px;
}
.m_btn {
  margin: 15px auto;
}
</style>


