<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header" fixed left-arrow @click-left="close">
      <span slot="title">订单列表</span>
    </van-nav-bar>
    <div class="m_body">
      <van-tabs :active="active">
        <van-tab title="待支付订单">
          <srcoll class="srcoll_content">
            <div class="content">
              <div class="loading_content" v-if="show">
                <van-loading style="width: 22px; height: 22px;" type="circle" color="black" />
              </div>
              <transition name="bottom-go">
                <div v-if="!show" style="padding: 15px;">
                  <div class="no_lesson" v-if="!unpaidOrderList.length">
                    <i class="icon_no_lesson"></i>
                    <p>没有待支付的订单哦~</p>
                  </div>
                  <orderItem @hanlerClick="hanlerClick" :key="item.id" :item="item" :index="index" v-for="(item,index) in unpaidOrderList"></orderItem>
                </div>
              </transition>
            </div>
          </srcoll>
        </van-tab>
        <van-tab title="全部订单">
          <srcoll class="srcoll_content">
            <div class="content">
              <div class="loading_content" v-if="show">
                <van-loading style="width: 22px; height: 22px;" type="circle" color="black" />
              </div>
              <transition name="bottom-go">
                <div v-if="!show" style="padding: 15px;">
                  <div class="no_lesson" v-if="!orderList.length">
                    <i class="icon_no_lesson"></i>
                    <p>没有订单哦~</p>
                  </div>
                  <orderItem @hanlerClick="hanlerClick" :key="item.id" :item="item" :index="index" v-for="(item,index) in orderList"></orderItem>
                </div>
              </transition>
            </div>
          </srcoll>
        </van-tab>
      </van-tabs>
    </div>
    <transition name="right-in">
      <orderDetail v-if="orderData" :item="orderData"></orderDetail>
    </transition>
  </div>
</template>

<script>
  import orderDetail from '../../components/orderDetail'
  import orderItem from '../../components/orderItem'
  import srcoll from '@/components/srcoll'
  export default {
    name: 'lessonList',
    data () {
      return {
        show: true,
        orderList: [],
        unpaidOrderList: [],
        orderData: null
      }
    },
    created () {
      this.$shopApi.defaults.headers = {
        Authorization: 'Bearer ujMAkhuM3AZXfvs_iB2nzqR5HuRXy5ph'
      }
      this.getOrderList()
    },
    methods: {
      hanlerClick (id) {
        this.getOrder(id)
      },
      close () {
        this.$router.go(-1)
      },
      getOrderList () {
        let { get } = this.$shopApi

        get('/v1/order/list?expand=product,coupon,payLog')
        .then(({data}) => {
          if (!data.staus) {
            let unpaid = []
            data.data.forEach((e) => {
              if (e.order_status < 2 && !e.pay_status) {
                unpaid.push(e)
              }
            })

            this.orderList = data.data
            this.unpaidOrderList = unpaid
            this.show = false
          }
        })
      },
       // 获取订单详情
      getOrder (id) {
        this.$toast.loading()
        let { get } = this.$shopApi
        get('/v1/order/detail', {params: {order_id: id, expand: 'product,coupon,payLog'}})
        .then(({data}) => {
          this.$toast.clear()
          if (!data.status) {
            this.orderData = data.data
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
      orderItem,
      orderDetail,
      srcoll
    }
  }
</script>
<style lang="scss" scoped>
@import '../../assets/scss/minix/index';
.srcoll_content {
  height: calc(100vh - 90px);
}
.loading_content {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no_lesson {
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #ADADBD;
  .icon_no_lesson {
    display: block;
    margin-bottom: 15px;
    width: 64px;
    height: 52px;
    @include dprImg('class_kong');
    background-size: 100%;
  }
}
</style>

