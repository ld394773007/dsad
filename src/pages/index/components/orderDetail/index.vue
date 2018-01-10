<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header" fixed left-arrow @click-left="close">
      <span slot="title">订单详情</span>
    </van-nav-bar>
    <div class="m_body">
      <div class="order-item">
        <div class="order-item-head">
          <p>{{foramtTime1(item.created_at, 'YYYY-MM-DD')}}</p>
          <span>{{getStatus()}}</span>
        </div>
        <div class="order-item-body">
          <div class="order-item-img">
            <img :src="item.product[0].thumb">
          </div>
          <div class="order-item-info">
            <div>
              <p>{{item.product[0].product_name}}</p>
            </div>
            <span>￥{{toDecimal2(getNum(item.order_amount))}}</span>
          </div>
        </div>
      </div>
      <div class="order-detail-1">
        <div class="order-detail-price">
          <p><span>课程总价</span><span>￥ {{goodAmount}}</span></p>
          <p><span>优惠</span><span>￥ {{couponAmount}}</span></p>
        </div>
        <div class="order-item-foot order-detail-foot">
          <a @touchstart="deleteOrder" href="javascript:;" v-if="item.order_status == 2">删除订单</a>
          <a @touchstart="cancelOrder" href="javascript:;" v-if="!item.pay_status && item.order_status < 2">取消订单</a>
          <a @touchstart="payOrder" href="javascript:;" class="payment" v-if="!item.pay_status && item.order_status < 2">去支付</a>
          <p v-if="item.pay_status == 1"><span>实付款</span>￥{{toDecimal2(getNum(item.order_amount))}}</p>
        </div>
      </div>
      <div class="order-detail-2">
        <p>订单编号：{{item.order_sn}}</p>
        <p v-if="item.pay_status == 1">付款方式：{{item.pay_name}}</p>
        <p>创建时间：{{foramtTime1(item.created_at, 'YYYY-MM-DD HH:mm:ss')}}</p>
        <p v-if="item.pay_status == 1">付款时间：{{foramtTime1(item.pay_time, 'YYYY-MM-DD HH:mm:ss')}}</p>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
  import {formatTime} from '@/common/js/utils'
  export default {
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      goodAmount () {
        let getNum = this.getNum
        let detailData = this.item
        return this.toDecimal2(getNum(detailData.goods_amount) + getNum(detailData.pay_fee) + getNum(detailData.shipping_fee))
      },
      couponAmount () {
        let getNum = this.getNum
        let detailData = this.item
        return this.toDecimal2(getNum(detailData.coupon_amount) + getNum(detailData.discount_amount))
      }
    },
    methods: {
      back () {
        this.$emit('back')
      },
      getStatus () {
        let orderStatus = this.item.order_status
        let payStatus = this.item.pay_status

        if (orderStatus < 2 && !payStatus) {
          return '未支付'
        } else if (orderStatus === 2) {
          return '已取消'
        } else if (payStatus === 1) {
          return '已付款'
        }
      },
      cancelOrder () {
        this.$emit('cancelOrder', this.item.id)
      },
      payOrder () {
        this.$emit('payOrder', this.item.id)
      },
      deleteOrder () {
        this.$emit('deleteOrder', this.item.id)
      },
      foramtTime1 (t, v) {
        let time = new Date(t * 1000)
        return formatTime(time, v)
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
    }
  }
</script>

