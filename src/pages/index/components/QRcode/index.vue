<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header" fixed left-arrow @click-left="close">
      <span slot="title">付款</span>
    </van-nav-bar>
    <div class="m_body">
      <div class="code-content">
        <h2>微信扫一扫支付</h2>
        <qriously :value="code" :size="200" />
        <a href="javascript:" class="m_btn" @click="handlerClick()" >已完成支付</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'QRcode',
  props: ['code', 'id'],
  methods: {
    close () {
      this.$emit('close')
    },
    handlerClick () {
      this.getPayStatus(() => {
        this.$toast.alert({
          message: '你还没有完成支付哦！ 请确认完成后再次点击！'
        })
      })
    },
    // 查询是否支付成功
    getPayStatus (fn) {
      let { get } = this.$shopApi
      get('/v1/order/query-pay-status', {params: {order_id: this.id}})
      .then(({data}) => {
        if (!data.status) {
          if (data.data.pay_status === 'paied') {
            this.$dialog.alert({
              message: '你已经完成支付！点击确认查看'
            }).then(() => {
              this.$emit('success')
            })
          } else {
            fn && fn()
          }
        } else {
          this.$toast.alert({
            message: data.message
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.code-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    font-size: 20px;
    margin: 20px 0;
  }
  .m_btn {
    margin-top: 20px;
    width: 60%;
  }
}
</style>


